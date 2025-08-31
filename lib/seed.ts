import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export async function seedDemo() {
  const count = await prisma.agent.count()
  if (count > 0) return

  const email = "demo@market.ai"
  const password = "password123"
  const hash = await bcrypt.hash(password, 10)

  const demo = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Demo User", email, password: hash },
  })

  const agents = [
    {
      name: "Email Wizard",
      description: "Drafts persuasive emails instantly.",
      category: "Productivity",
      price: 1999,
      featured: true,
      userId: demo.id,
    },
    {
      name: "Code Reviewer",
      description: "AI code review with detailed suggestions.",
      category: "Engineering",
      price: 4999,
      featured: true,
      userId: demo.id,
    },
    {
      name: "Market Analyst",
      description: "Summarizes trends and competitors.",
      category: "Research",
      price: 2999,
      featured: false,
      userId: demo.id,
    },
    {
      name: "Support Buddy",
      description: "Automates tier-1 support responses.",
      category: "Customer Support",
      price: 2599,
      featured: false,
      userId: demo.id,
    },
  ]

  await prisma.agent.createMany({ data: agents })
}
