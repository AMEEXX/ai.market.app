import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import AgentCard from "@/components/agent-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) redirect("/auth/login")

  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: { agent: true },
    orderBy: { createdAt: "desc" },
  })

  const yourListings = await prisma.agent.findMany({
    where: { userId: user.id ?? undefined },
    orderBy: { createdAt: "desc" },
  })

  // Find sales of your listings
  const allSales = await prisma.purchase.findMany({ include: { agent: true }, orderBy: { createdAt: "desc" } })
  const soldOfYours = allSales.filter((p: any) => p.agent && p.agent.userId === user.id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-10">
      <header className="space-y-1">
        <h1 className="text-3xl brand-italic">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your agents and activity</p>
      </header>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold brand-italic">Bought / Rented</h2>
          <p className="text-muted-foreground text-xs">{purchases.length} total</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {purchases.length === 0 ? (
            <p className="text-muted-foreground">No purchases yet.</p>
          ) : (
            purchases.map((p: any) =>
              p.agent ? (
                <div key={p.id}>
                  {/* @ts-expect-error Server Component rendering client component */}
                  <AgentCard
                    id={p.agent.id}
                    name={p.agent.name}
                    description={p.agent.description}
                    price={p.agent.price}
                  />
                </div>
              ) : null,
            )
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold brand-italic">Your listings</h2>
          <p className="text-muted-foreground text-xs">{yourListings.length} active</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {yourListings.length === 0 ? (
            <p className="text-muted-foreground">You haven’t listed any agents yet.</p>
          ) : (
            yourListings.map((a: any) => (
              <div key={a.id}>
                {/* @ts-expect-error Server Component rendering client component */}
                <AgentCard id={a.id} name={a.name} description={a.description} price={a.price} />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold brand-italic">Sold agents</h2>
          <p className="text-muted-foreground text-xs">{soldOfYours.length} sales</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {soldOfYours.length === 0 ? (
            <p className="text-muted-foreground">No sales yet.</p>
          ) : (
            soldOfYours.map((s: any) =>
              s.agent ? (
                <div key={s.id}>
                  {/* @ts-expect-error Server Component rendering client component */}
                  <AgentCard
                    id={s.agent.id}
                    name={s.agent.name}
                    description={s.agent.description}
                    price={s.agent.price}
                  />
                </div>
              ) : null,
            )
          )}
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="brand-italic">Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Manage your profile and billing (demo). Coming soon.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
