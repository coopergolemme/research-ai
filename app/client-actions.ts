"use client"

import type { ResearchIdea } from "@/types/research"

export function storeResearchData(data: {
  ideas: ResearchIdea[]
  sources: string[]
}) {
  localStorage.setItem("researchData", JSON.stringify(data))
}

