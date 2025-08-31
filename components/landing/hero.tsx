"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-16 md:pt-28 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-balance text-4xl md:text-6xl font-semibold tracking-tight"
            >
              Launch AI agents in minutes on a sleek black canvas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-gray-400 leading-relaxed max-w-xl"
            >
              Discover, test, and buy production‑ready AI agents. Clean UI, smooth animations, and real customer
              reviews.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex items-center gap-3"
            >
              <Link
                href="/agents"
                className="inline-flex items-center rounded-md bg-cyan-400 text-black px-4 py-2 text-sm font-medium hover:bg-cyan-300 transition"
              >
                Explore agents
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-md border border-neutral-800 px-4 py-2 text-sm font-medium hover:border-neutral-700 transition"
              >
                Dashboard
              </Link>
            </motion.div>

            <div className="mt-8 flex items-center gap-4">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <p className="text-sm text-gray-400">1,200+ successful runs this week</p>
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl border border-neutral-900 p-3 bg-neutral-950"
            >
              <div className="aspect-video rounded-lg overflow-hidden border border-neutral-900">
                <img
                  src="/ai-agents-dashboard-preview.png"
                  alt="Agents dashboard preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  "Lead Finder",
                  "Email Writer",
                  "Analytics Summarizer",
                  "Meeting Notes",
                  "Image Tagger",
                  "Code Reviewer",
                ].map((name) => (
                  <motion.div
                    key={name}
                    whileHover={{ y: -2 }}
                    className="rounded-lg border border-neutral-900 p-3 bg-black"
                  >
                    <p className="text-xs text-gray-400">{name}</p>
                    <p className="mt-1 text-sm font-medium text-cyan-400">Demo</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* subtle cyan glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(34,211,238,0.08),transparent)]" />
    </section>
  )
}
