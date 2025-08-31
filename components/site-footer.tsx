export default function Footer() {
  return (
    <footer className="border-t border-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} AgentMarket. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white transition">
              Privacy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition">
              Terms
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
