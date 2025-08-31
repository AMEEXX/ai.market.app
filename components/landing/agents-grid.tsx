"use client"

import { motion } from "framer-motion"
import Link from "next/link"

type Agent = {
  id: string
  name: string
  category: string
  price: string
  description: string
}

const agents: Agent[] = [
  {
    id: "email-writer",
    name: "Email Writer",
    category: "Productivity",
    price: "$9",
    description: "Drafts persuasive outreach emails in seconds.",
  },
  {
    id: "lead-finder",
    name: "Lead Finder",
    category: "Sales",
    price: "$12",
    description: "Finds and qualifies leads with web signals.",
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    category: "Operations",
    price: "$7",
    description: "Transcribes and summarizes calls into action items.",
  },
  {
    id: "analytics-summarizer",
    name: "Analytics Summarizer",
    category: "Analytics",
    price: "$11",
    description: "Converts dashboards into clear weekly insights.",
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    category: "Engineering",
    price: "$10",
    description: "Finds issues and suggests improvements on PRs.",
  },
  {
    id: "image-tagger",
    name: "Image Tagger",
    category: "Vision",
    price: "$6",
    description: "Tags and organizes image libraries automatically.",
  },
]

export function AgentsGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((a, idx) => (
        <motion.article
          key={a.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: idx * 0.04 }}
          whileHover={{ y: -4 }}
          className="group rounded-xl border border-neutral-900 bg-neutral-950 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs rounded-full border border-neutral-800 px-2 py-0.5 text-gray-400">
              {a.category}
            </span>
            <span className="text-xs font-medium text-green-500">Featured</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{a.name}</h3>
          <p className="mt-1 text-sm text-gray-400">{a.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm">
              <span className="text-cyan-400 font-medium">{a.price}</span>
              <span className="text-gray-500">/mo</span>
            </p>
            <Link
              href={`/agents/${a.id}`}
              className="text-sm rounded-md border border-neutral-800 px-3 py-1.5 hover:border-neutral-700 transition"
            >
              View
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
