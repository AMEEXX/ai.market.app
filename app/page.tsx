import Link from "next/link"
import { prisma } from "@/lib/prisma"
import AgentCard from "@/components/agent-card"
import Header from "@/components/site-header"
import Footer from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { TestimonialsMarquee } from "@/components/landing/testimonials-marquee"
import { AgentsGrid } from "@/components/landing/agents-grid"

export default async function HomePage() {
  const featured = await prisma.agent.findMany({
    where: { featured: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="bg-black text-white">
      <Header />

      <main className="space-y-16">
        <Hero />

        <section className="py-6">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-2xl font-semibold brand-italic">Featured</h2>
              <p className="text-sm text-gray-400">Handpicked agents loved by teams</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {featured.map((a) => (
                <div key={a.id}>
                  {/* @ts-expect-error Server Component rendering client component */}
                  <AgentCard id={a.id} name={a.name} description={a.description} price={a.price} featured />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-muted-foreground text-sm">Demo login: demo@market.ai / password123</p>
              <Link className="underline underline-offset-4 text-cyan-400 hover:text-cyan-300" href="/agents">
                Browse all agents →
              </Link>
            </div>
          </div>
        </section>

        <section id="reviews" className="py-4">
          <TestimonialsMarquee />
        </section>

        <section className="py-6">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-2xl font-semibold brand-italic">Demo agents</h2>
              <p className="text-sm text-gray-400">Animated cards with Framer Motion</p>
            </div>
            <AgentsGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
