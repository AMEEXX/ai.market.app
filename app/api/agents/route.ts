import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"
import { seedDemo } from "@/lib/seed"

export async function GET(req: Request) {
  const url = new URL(req.url)

  const search = url.searchParams.get("search") ?? undefined
  const category = url.searchParams.get("category") ?? undefined
  const minPrice = url.searchParams.get("minPrice")
  const maxPrice = url.searchParams.get("maxPrice")
  const featured = url.searchParams.get("featured")

  // ensure demo data
  await seedDemo()

  const agents = await prisma.agent.findMany({
    where: {
      ...(featured ? { featured: featured === "true" } : {}),
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ agents })
}

export async function POST(req: Request) {
  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const payload = await verifyToken(token)
    const body = await req.json()
    const { name, description, category, price, featured = false } = body
    if (!name || !description || !category || typeof price !== "number") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        category,
        price,
        featured,
        userId: payload.sub,
      },
    })
    return NextResponse.json({ agent }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
