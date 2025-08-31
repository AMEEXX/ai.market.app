import { NextResponse } from "next/server"
import { seedDemo } from "@/lib/seed"

export async function POST() {
  await seedDemo()
  return NextResponse.json({ ok: true })
}
