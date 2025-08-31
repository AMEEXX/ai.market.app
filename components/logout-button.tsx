"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <Button
      size="sm"
      variant="outline"
      className="brand-italic bg-transparent"
      onClick={async () => {
        setLoading(true)
        await fetch("/api/auth/logout", { method: "POST" })
        setLoading(false)
        router.push("/")
        router.refresh()
      }}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  )
}
