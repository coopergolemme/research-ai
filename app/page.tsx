import { ResearchForm } from "@/components/research-form";
import { ResearchResults } from "@/components/research-results";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">
          AI Research Assistant
        </h1>
        <p className="text-lg text-center text-muted-foreground">
          Enter your research topic and upload relevant documents to generate
          research ideas and insights.
        </p>

        <ResearchForm />

        <div className="w-full mt-8">
          <ResearchResults />
        </div>
      </div>
    </main>
  );
}
