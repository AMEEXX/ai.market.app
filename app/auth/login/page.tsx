"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("demo@market.ai")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const next = useSearchParams().get("next") || "/dashboard"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) router.push(next)
    else setError((await res.json()).error || "Login failed")
  }

  return (
    <motion.div className="mx-auto max-w-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle className="brand-italic">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={onSubmit}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="brand-italic">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
