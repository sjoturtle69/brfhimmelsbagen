"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    let assistantReply = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      assistantReply += new TextDecoder().decode(value);
      setMessages([...newMessages, { role: "assistant", content: assistantReply }]);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f12] p-6 text-white">
      {/* Chat container */}
      <div className="flex flex-col w-full max-w-5xl"> {/* Bredare container */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Stadgar‑Assistent</h1>
          <p className="text-gray-400 mt-1">Fråga mig vad som helst</p>
        </div>

        <div className="flex flex-col bg-[#1a1b1f] rounded-2xl p-6 h-[600px] overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[90%] text-sm ${ // Bredare bubblor
                  m.role === "user"
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#222225] text-gray-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="mt-4 relative w-full">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv ditt meddelande..."
            className="w-full bg-[#1a1b1f] resize-none text-white p-4 rounded-2xl outline-none placeholder-gray-500 pr-20"
            rows={1}
          />
          <button
            onClick={sendMessage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#3bf] hover:bg-[#0cf] p-3 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
