import { type NextRequest, NextResponse } from "next/server"
import { generateResearchIdeas } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const researchData = await generateResearchIdeas(formData)

    return NextResponse.json(researchData)
  } catch (error) {
    console.error("Error in research API:", error)
    return NextResponse.json({ error: "Failed to generate research ideas" }, { status: 500 })
  }
}

