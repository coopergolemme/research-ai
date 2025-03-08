"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ResearchIdea } from "@/types/research";

export function ResearchResults() {
  const [researchData, setResearchData] = useState<{
    ideas: ResearchIdea[];
    sources: string[];
  } | null>(null);
  const [storageChanged, setStorageChanged] = useState(false);

  useEffect(() => {
    // Function to update research data from localStorage
    const updateResearchData = () => {
      const storedData = localStorage.getItem("researchData");
      if (storedData) {
        setResearchData(JSON.parse(storedData));
      }
    };

    // Initial load of research data
    updateResearchData();

    // Add event listener for storage changes
    const handleStorageChange = () => {
      setStorageChanged((prev) => !prev);
    };
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Update research data when storageChanged state changes
    const storedData = localStorage.getItem("researchData");
    if (storedData) {
      setResearchData(JSON.parse(storedData));
    }
  }, [storageChanged]);

  if (!researchData || researchData.ideas.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Results</CardTitle>
        <CardDescription>
          Generated ideas and sources based on your input
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ideas">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ideas">Research Ideas</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent
            value="ideas"
            className="space-y-4 mt-4">
            {researchData.ideas.map((idea, index) => (
              <div
                key={index}
                className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">{idea.title}</h3>
                <p className="text-muted-foreground mt-2">{idea.description}</p>
                {idea.considerations && (
                  <div className="mt-3">
                    <h4 className="font-medium">Considerations:</h4>
                    <ul className="list-disc pl-5 mt-1">
                      {idea.considerations.map((consideration, idx) => (
                        <li key={idx}>{consideration}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent
            value="sources"
            className="mt-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Sources Used</h3>
              {researchData.sources.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {researchData.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No specific sources were used.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
