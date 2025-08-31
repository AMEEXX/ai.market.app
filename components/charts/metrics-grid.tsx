"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

export function MetricsGrid({
  data,
}: {
  data: {
    requests: { x: number; y: number }[]
    latency: { x: number; y: number }[]
    success: { x: number; y: number }[]
    rating: number
    uptime: number
  }
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard title="Requests/day" series={data.requests} color="hsl(var(--primary))" />
      <MetricCard title="Latency (ms)" series={data.latency} color="hsl(var(--accent))" />
      <MetricCard title="Success (%)" series={data.success} color="hsl(var(--primary))" />
    </div>
  )
}

function MetricCard({
  title,
  series,
  color,
}: {
  title: string
  series: { x: number; y: number }[]
  color: string
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke={color} dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
