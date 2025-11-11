"use client";

import { useState } from "react";

// Typ för meddelanden
type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    // Typade meddelanden
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

      const assistantMessage: Message = { role: "assistant", content: assistantReply };
      setMessages([...newMessages, assistantMessage]);
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Stadgar-Assistent</h1>

      <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10, borderRadius: 8, minHeight: 300 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{m.role === "user" ? "Du:" : "Bot:"}</strong>
            <p style={{ margin: 2 }}>{m.content}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv din fråga..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 12px", marginLeft: 8, borderRadius: 4, cursor: "pointer" }}>
          Skicka
        </button>
      </div>
    </main>
  );
}
