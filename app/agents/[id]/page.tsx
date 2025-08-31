import { prisma } from "@/lib/prisma"
import { PriceHistoryChart } from "@/components/charts/price-history"
import { MetricsGrid } from "@/components/charts/metrics-grid"
import { seedDemo } from "@/lib/seed"

// Synthetic analytics generators (demo)
function seedMetrics(seed: string) {
  const n = 14
  const rand = (i: number, base: number, spread: number) => {
    const h = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0)
    const t = Math.sin((i + h) * 12.9898) * 43758.5453
    const frac = t - Math.floor(t)
    return Math.max(0, base + Math.round((frac - 0.5) * spread))
  }
  const requests = Array.from({ length: n }, (_, i) => ({ x: i, y: rand(i, 120, 80) }))
  const latency = Array.from({ length: n }, (_, i) => ({ x: i, y: rand(i, 180, 120) }))
  const success = Array.from({ length: n }, (_, i) => ({ x: i, y: 92 + (rand(i, 0, 10) % 8) }))
  return { requests, latency, success }
}

function seedPriceHistory(seed: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const base = 15 + (seed.charCodeAt(0) % 10)
  return months.slice(0, 8).map((m, i) => ({
    month: m,
    price: (base + (i % 4)) * 100, // cents
  }))
}

export default async function AgentDetail({ params }: { params: { id: string } }) {
  await seedDemo()

  const agent = await prisma.agent.findUnique({ where: { id: params.id } })
  if (!agent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold brand-italic">Agent not found</h1>
        <p className="text-muted-foreground">
          We couldn&apos;t locate this agent. It may have been removed or the link is invalid.
        </p>
        <a href="/agents" className="underline underline-offset-4 text-primary">
          Browse all agents
        </a>
      </div>
    )
  }

  const PurchaseButton = (await import("@/components/purchase-button")).default

  const metrics = seedMetrics(agent.id)
  const priceHistory = seedPriceHistory(agent.id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold brand-italic">{agent.name}</h1>
        <p className="text-muted-foreground">{agent.description}</p>
        <div className="flex items-center gap-4">
          <p className="text-primary text-xl">${(agent.price / 100).toFixed(2)}</p>
          <div>
            {/* @ts-expect-error Server Component rendering client component */}
            <PurchaseButton agentId={agent.id} />
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold brand-italic">Performance</h2>
        {/* KPIs/mini charts */}
        <MetricsGrid data={{ ...metrics, rating: 4.6, uptime: 99.8 }} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold brand-italic">Price history</h2>
        <div className="h-56 rounded-xl border p-3">
          <PriceHistoryChart data={priceHistory.map((d) => ({ month: d.month, price: d.price / 100 }))} />
        </div>
        <p className="text-muted-foreground text-xs">Prices shown in USD.</p>
      </section>
    </div>
  )
}
