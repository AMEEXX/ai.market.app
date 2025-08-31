import { cookies } from "next/headers"
import { verifyToken } from "./jwt"
import { prisma } from "./prisma"

export async function getAuthUser() {
  try {
    const cookie = (await cookies()).get("token")?.value
    if (!cookie) return null
    const payload = await verifyToken(cookie)
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    return user
  } catch {
    return null
  }
}
