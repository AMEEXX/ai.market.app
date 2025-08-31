// In-memory types that match how the rest of the app uses them
type User = {
  id: string
  email: string
  name?: string | null
  // NOTE: routes use `user.password` and store a bcrypt hash in this field
  password: string
  createdAt: Date
}

type Agent = {
  id: string
  name: string
  description: string
  // App treats price as cents in UI (divides by 100). We'll store cents.
  price: number
  category?: string | null
  featured?: boolean
  imageUrl?: string | null
  userId?: string | null
  createdAt: Date
}

type Purchase = {
  id: string
  userId: string
  agentId: string
  createdAt: Date
}

// Ephemeral stores (reset on reload)
const store = {
  users: [] as User[],
  agents: [] as Agent[],
  purchases: [] as Purchase[],
}

// Utils
const now = () => new Date()
const genId = () => Math.random().toString(36).slice(2, 10)

// Seed a few demo agents on first load
if (store.agents.length === 0) {
  store.agents.push(
    {
      id: genId(),
      name: "Email Assistant",
      description: "Drafts and polishes emails.",
      price: 1900,
      category: "Productivity",
      featured: true,
      imageUrl: null,
      createdAt: now(),
    },
    {
      id: genId(),
      name: "Research Copilot",
      description: "Summarizes links and PDFs.",
      price: 2900,
      category: "Research",
      featured: true,
      imageUrl: null,
      createdAt: now(),
    },
    {
      id: genId(),
      name: "Code Reviewer",
      description: "Suggests improvements in PRs.",
      price: 3900,
      category: "Developer Tools",
      featured: false,
      imageUrl: null,
      createdAt: now(),
    },
  )
}

// Helper for case-insensitive "contains"
function containsCI(haystack: string | undefined | null, needle: string) {
  if (!haystack) return false
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

// Minimal Prisma-like API surface that the app uses
export const prisma = {
  user: {
    async findUnique(opts: { where: { email?: string; id?: string } }) {
      const { email, id } = opts.where || {}
      if (email) return store.users.find((u) => u.email === email) || null
      if (id) return store.users.find((u) => u.id === id) || null
      return null
    },
    async create(opts: { data: { email: string; name?: string | null; password: string } }) {
      const exists = store.users.some((u) => u.email === opts.data.email)
      if (exists) throw new Error("User already exists")
      const u: User = {
        id: genId(),
        email: opts.data.email,
        name: opts.data.name ?? null,
        password: opts.data.password, // bcrypt hash saved by route
        createdAt: now(),
      }
      store.users.push(u)
      return u
    },
  },

  agent: {
    async findMany(opts?: {
      where?: {
        featured?: boolean
        category?: string
        price?: { gte?: number; lte?: number }
        OR?: Array<
          | { name?: { contains: string; mode?: "insensitive" } }
          | { description?: { contains: string; mode?: "insensitive" } }
        >
      }
      orderBy?: { createdAt?: "asc" | "desc" }
      take?: number
    }) {
      let list = [...store.agents]

      const w = opts?.where
      if (w) {
        if (typeof w.featured === "boolean") {
          list = list.filter((a) => !!a.featured === w.featured)
        }
        if (w.category) {
          list = list.filter((a) => a.category === w.category)
        }
        if (w.price) {
          const { gte, lte } = w.price
          if (typeof gte === "number") list = list.filter((a) => a.price >= gte)
          if (typeof lte === "number") list = list.filter((a) => a.price <= lte)
        }
        if (Array.isArray(w.OR) && w.OR.length > 0) {
          list = list.filter((a) => {
            return w.OR!.some((cond) => {
              if ("name" in cond && cond.name?.contains) {
                return containsCI(a.name, cond.name.contains)
              }
              if ("description" in cond && cond.description?.contains) {
                return containsCI(a.description, cond.description.contains)
              }
              return false
            })
          })
        }
      }

      const order = opts?.orderBy?.createdAt
      if (order === "desc") list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      if (order === "asc") list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

      if (opts?.take && opts.take > 0) {
        list = list.slice(0, opts.take)
      }

      return list
    },

    async findUnique(opts: { where: { id: string } }) {
      return store.agents.find((a) => a.id === opts.where.id) || null
    },

    async create(opts: {
      data: {
        name: string
        description: string
        category: string
        price: number
        featured?: boolean
        userId?: string
        imageUrl?: string | null
      }
    }) {
      const a: Agent = {
        id: genId(),
        createdAt: now(),
        name: opts.data.name,
        description: opts.data.description,
        category: opts.data.category,
        price: opts.data.price,
        featured: !!opts.data.featured,
        userId: opts.data.userId ?? null,
        imageUrl: opts.data.imageUrl ?? null,
      }
      store.agents.push(a)
      return a
    },
  },

  purchase: {
    // Match route's usage: findUnique({ where: { userId_agentId: { userId, agentId } } })
    async findUnique(opts: { where: { userId_agentId: { userId: string; agentId: string } } }) {
      const { userId, agentId } = opts.where.userId_agentId
      return store.purchases.find((p) => p.userId === userId && p.agentId === agentId) || null
    },

    async findMany(opts?: {
      where?: { userId?: string }
      include?: { agent?: boolean }
      orderBy?: { createdAt?: "asc" | "desc" }
    }) {
      const where = opts?.where
      let list = [...store.purchases]
      if (where?.userId) list = list.filter((p) => p.userId === where.userId)

      const order = opts?.orderBy?.createdAt
      if (order === "desc") list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      if (order === "asc") list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

      // include agent relation when requested
      if (opts?.include?.agent) {
        // Return objects with an `agent` property attached
        return list.map((p) => ({
          ...p,
          agent: store.agents.find((a) => a.id === p.agentId) || null,
        })) as any
      }

      return list as any
    },

    async create(opts: { data: { userId: string; agentId: string } }) {
      const dup = store.purchases.find((p) => p.userId === opts.data.userId && p.agentId === opts.data.agentId)
      if (dup) throw new Error("Already purchased")
      const p: Purchase = {
        id: genId(),
        userId: opts.data.userId,
        agentId: opts.data.agentId,
        createdAt: now(),
      }
      store.purchases.push(p)
      return p
    },
  },

  // API parity
  async $disconnect() {
    return
  },
}
