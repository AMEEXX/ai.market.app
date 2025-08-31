"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

type Props = {
  id: string
  name: string
  description: string
  price: number
  featured?: boolean
}

export default function AgentCard({ id, name, description, price, featured }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <Card className={featured ? "border-primary/40" : ""}>
        <CardHeader>
          <CardTitle className="brand-italic">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="mt-3 font-medium text-primary">${(price / 100).toFixed(2)}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/agents/${id}`} className="text-sm underline underline-offset-4">
            Details
          </Link>
          <Link href={`/agents/${id}`}>
            <Button size="sm" className="brand-italic">
              Purchase
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
