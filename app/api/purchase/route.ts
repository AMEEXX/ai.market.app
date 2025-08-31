import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1]
  if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const payload = await verifyToken(cookie)
    const { agentId } = await req.json()
    if (!agentId) return NextResponse.json({ error: "Missing agentId" }, { status: 400 })

    const exists = await prisma.purchase.findUnique({
      where: { userId_agentId: { userId: payload.sub, agentId } },
    })
    if (exists) return NextResponse.json({ error: "Already purchased" }, { status: 409 })

    const purchase = await prisma.purchase.create({
      data: { userId: payload.sub, agentId },
    })

    return NextResponse.json({ purchase }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
