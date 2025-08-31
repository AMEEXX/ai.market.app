"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export type FilterState = {
  search: string
  category: string
  minPrice: number
  maxPrice: number
}

export const categories = ["All", "Productivity", "Developer Tools", "Engineering", "Research", "Customer Support"]

export function Filters({
  value,
  onChange,
  onApply,
}: {
  value: FilterState
  onChange: (v: FilterState) => void
  onApply: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-4">
          <Input
            placeholder="Search agents..."
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
          <select
            className="rounded-md border bg-background p-2 text-sm"
            value={value.category}
            onChange={(e) => onChange({ ...value, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min $"
              value={value.minPrice || ""}
              onChange={(e) => onChange({ ...value, minPrice: Number(e.target.value || 0) })}
            />
            <Input
              type="number"
              placeholder="Max $"
              value={value.maxPrice || ""}
              onChange={(e) => onChange({ ...value, maxPrice: Number(e.target.value || 0) })}
            />
          </div>
          <Button onClick={onApply} className="brand-italic">
            Apply
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
