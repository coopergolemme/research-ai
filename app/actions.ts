"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"

export async function generateResearchIdeas(formData: FormData) {
  const prompt = formData.get("prompt") as string
  const documents = formData.getAll("documents") as File[]

  let documentContents = ""

  // Process uploaded documents
  if (documents.length > 0) {
    for (const doc of documents) {
      if (doc.size > 0) {
        const text = await doc.text()
        documentContents += `Document: ${doc.name}\n${text}\n\n`
      }
    }
  }

  // Generate research ideas using AI
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a research assistant that helps generate research ideas based on user prompts and documents.
    Analyze the provided information and generate 3-5 research ideas.
    For each idea, provide a title, description, and 2-3 considerations.
    Also provide a list of sources that were used or would be relevant.
    Format your response as JSON with the following structure:
    {
      "ideas": [
        {
          "title": "Research Idea Title",
          "description": "Detailed description of the research idea",
          "considerations": ["Consideration 1", "Consideration 2"]
        }
      ],
      "sources": ["Source 1", "Source 2"]
    }`,
    prompt: `Research Topic: ${prompt}\n\n${documentContents ? `Uploaded Documents:\n${documentContents}` : ""}`,
  })

  try {
    // Parse the response as JSON
    const researchData = JSON.parse(text)

    // Store in a database in a real application
    // For this example, we'll use localStorage on the client side

    revalidatePath("/")

    return researchData
  } catch (error) {
    console.error("Error parsing AI response:", error)
    throw new Error("Failed to generate research ideas")
  }
}

