"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateResearchIdeas } from "@/app/actions"
import { Loader2 } from "lucide-react"
import { storeResearchData } from "@/app/client-actions"

export function ResearchForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true)
      const researchData = await generateResearchIdeas(formData)

      // Store the research data in localStorage
      storeResearchData(researchData)

      router.refresh()
    } catch (error) {
      console.error("Error generating research ideas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Research Topic/Question</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="Enter your research topic or question here..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documents">Upload Documents (Optional)</Label>
            <Input
              id="documents"
              name="documents"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <div className="text-sm text-muted-foreground mt-2">{files.length} file(s) selected</div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              "Generate Research Ideas"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

