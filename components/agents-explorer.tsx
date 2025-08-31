"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import AgentCard from "@/components/agent-card"
import { Filters, type FilterState } from "@/components/filters"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AgentsExplorer() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    minPrice: 0,
    maxPrice: 0,
  })

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.category && filters.category !== "All") params.set("category", filters.category)
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice * 100))
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice * 100))
    return `/api/agents?${params.toString()}`
  }, [filters])

  const { data, isLoading, mutate } = useSWR(query, fetcher, { keepPreviousData: true })

  return (
    <div className="space-y-4">
      <Filters value={filters} onChange={setFilters} onApply={() => mutate()} />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(data?.agents ?? []).map((a: any) => (
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
      )}
      {!isLoading && (data?.agents ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">No agents match your filters. Try adjusting them.</p>
      )}
    </div>
  )
}
