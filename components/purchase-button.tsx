"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

export default function PurchaseButton({ agentId }: { agentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onBuy() {
    setLoading(true)
    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    })
    setLoading(false)
    if (res.ok) {
      router.push("/dashboard")
      router.refresh()
    } else if (res.status === 401) {
      router.push("/auth/login")
    }
  }

  return (
    <motion.div initial={{ scale: 0.98 }} whileHover={{ scale: 1 }}>
      <Button onClick={onBuy} disabled={loading} className="brand-italic">
        {loading ? "Processing..." : "Buy Agent"}
      </Button>
    </motion.div>
  )
}
