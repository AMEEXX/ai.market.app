"use client"

import useSWR from "swr"
import AgentCard from "@/components/agent-card"
import { Filters, type FilterState } from "@/components/filters"
import { useState } from "react"
import { motion } from "framer-motion"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AgentsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    minPrice: 0,
    maxPrice: 0,
  })
  const [url, setUrl] = useState("/api/agents")
  const { data } = useSWR(url, fetcher)

  const apply = () => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.category && filters.category !== "All") params.set("category", filters.category)
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice * 100))
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice * 100))
    setUrl(`/api/agents?${params.toString()}`)
  }

  const agents = data?.agents ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl brand-italic">
        Explore Agents
      </motion.h1>
      <p className="text-muted-foreground text-sm">Filter and discover AI agents like products in a catalog.</p>

      <Filters value={filters} onChange={setFilters} onApply={apply} />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {agents.map((a: any) => (
          <AgentCard
            key={a.id}
            id={a.id}
            name={a.name}
            description={a.description}
            price={a.price}
            featured={a.featured}
          />
        ))}
      </div>
    </div>
  )
}
