import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const token = await signToken({ sub: user.id, email: user.email, name: user.name })
    ;(await cookies()).set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
