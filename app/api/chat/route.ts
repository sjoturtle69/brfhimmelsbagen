import { loadDocument } from "@/lib/rag"; // din nya funktion
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1].content;

  // Läs dokumentet direkt istället för rag.retrieval
  const context = await loadDocument();

  // Skapa streamText
  const result = await streamText({
    model: openai("gpt-4.1-mini"),
    system: `
      Du är en juridisk assistent.
      Svara endast baserat på innehållet i stadgarna.
      Om svaret inte finns, säg att du inte vet.

      --- STADGAR ---
      ${context}
      ----------------
    `,
    messages,
  });

  // Returnera stream
  return result.toTextStreamResponse();
}
