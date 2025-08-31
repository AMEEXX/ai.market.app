import Link from "next/link"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import LogoutButton from "./logout-button"

export default async function Navbar() {
  const token = (await cookies()).get("token")?.value
  let user: { name: string } | null = null
  try {
    if (token) user = await verifyToken(token)
  } catch {
    user = null
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-primary brand-italic">
          ai-agent.market
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/agents" className="text-sm hover:text-primary/80">
            Agents
          </Link>
          <Link href="/dashboard" className="text-sm hover:text-primary/80">
            Dashboard
          </Link>
          {!user ? (
            <>
              <Link href="/auth/login" className="text-sm hover:text-primary/80">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm hover:text-primary/80">
                Register
              </Link>
            </>
          ) : (
            <LogoutButton />
          )}
        </nav>
      </div>
    </header>
  )
}
