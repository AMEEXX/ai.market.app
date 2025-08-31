import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b border-neutral-900 sticky top-0 z-40 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
          <span className="font-semibold">AgentMarket</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/agents" className="text-gray-300 hover:text-white transition">
            Agents
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/#reviews" className="text-gray-300 hover:text-white transition">
            Reviews
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition">
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center rounded-md bg-cyan-400 text-black px-3 py-2 text-sm font-medium hover:bg-cyan-300 transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
