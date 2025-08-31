"use client"

import { motion } from "framer-motion"

type Testimonial = {
  quote: string
  name: string
  title: string
}

const testimonials: Testimonial[] = [
  { quote: "The smoothest agent launch we’ve tried.", name: "Maya R.", title: "Founder, Zento" },
  { quote: "Animations are chef’s kiss and UX is clean.", name: "Luis C.", title: "PM, Orbital" },
  { quote: "The agents actually save our team hours.", name: "Harper K.", title: "Ops Lead" },
  { quote: "Love the dark aesthetic. It feels premium.", name: "Jules P.", title: "Designer" },
  { quote: "Setup took minutes. Impressive.", name: "Tariq A.", title: "CTO, Gridly" },
  { quote: "Our writers rely on the email agent daily.", name: "Nina W.", title: "Head of Content" },
]

function Row({ speed = 28, offset = "-50%" }: { speed?: number; offset?: string }) {
  const items = [...testimonials, ...testimonials]
  return (
    <div className="overflow-hidden">
      <motion.div
        aria-hidden
        initial={false}
        animate={{ x: [offset, "0%"] }} // rightward movement
        transition={{ duration: speed, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="flex gap-4 will-change-transform"
      >
        {items.map((t, i) => (
          <figure
            key={`${t.name}-${i}`}
            className="min-w-[300px] max-w-[320px] rounded-xl border border-neutral-900 bg-neutral-950 p-5"
          >
            <blockquote className="text-sm leading-relaxed text-gray-300">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-xs text-gray-500">
              <span className="text-white">{t.name}</span> — {t.title}
            </figcaption>
          </figure>
        ))}
      </motion.div>
    </div>
  )
}

export function TestimonialsMarquee() {
  return (
    <div id="reviews" className="mx-auto max-w-6xl px-4">
      <div className="space-y-6">
        <Row speed={28} offset="-50%" />
        <Row speed={22} offset="-60%" />
      </div>
    </div>
  )
}
