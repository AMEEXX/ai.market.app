import { prisma } from "../lib/prisma"
import { seedDemo } from "../lib/seed"

async function main() {
  await seedDemo()
  const count = await prisma.agent.count()
  console.log("[seed] Agents:", count)
  console.log("[seed] Demo login -> email: demo@market.ai, password: password123")
}

main()
  .then(() => {
    console.log("[seed] done")
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
