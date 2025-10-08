"use client";

import React, { useState, useRef, useEffect } from 'react';

type Msg = {
  role: string;
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;

    const next = [...messages, { role: "user", content: input } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error || "unknown"}` },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff5f5",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        height: "calc(100vh - 40px)",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "24px",
        boxShadow: "0 32px 64px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
          padding: "24px 32px",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{ fontSize: "28px" }}>🔍</div>
          <div>
            <h1 style={{ 
              fontSize: "24px", 
              fontWeight: "700", 
              margin: 0,
              letterSpacing: "-0.02em"
            }}>AI Knowledge Bot</h1>
            <p style={{ 
              fontSize: "16px", 
              margin: 0, 
              opacity: 0.9,
              fontWeight: "500"
            }}>知恵の輪 - Wisdom Ring</p>
          </div>
          <div style={{ 
            marginLeft: "auto",
            fontSize: "12px",
            opacity: 0.8,
            background: "rgba(255,255,255,0.2)",
            padding: "6px 12px",
            borderRadius: "12px"
          }}>
            GPT-5 + File Search
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ 
          flex: 1, 
          padding: "24px", 
          overflowY: "auto",
          background: "#fafafa"
        }}>
          {messages.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "#64748b"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💭</div>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px 0", color: "#334155" }}>
                こんにちは！
              </h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                プロジェクト、業務プロセス、担当者など、何でも質問してください。
              </p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} style={{ 
              marginBottom: "24px",
              display: "flex",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              gap: "12px"
            }}>
              {/* Avatar */}
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
                background: m.role === "user" 
                  ? "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)"
                  : "#e7e0f7",
                color: m.role === "user" ? "white" : "#6b46c1",
                fontWeight: "600"
              }}>
                {m.role === "user" ? "👤" : "🔮"}
              </div>
              
              {/* Message */}
              <div style={{
                maxWidth: "70%",
                padding: "16px 20px",
                borderRadius: "18px",
                background: m.role === "user" 
                  ? "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)"
                  : "white",
                color: m.role === "user" ? "white" : "#1f2937",
                boxShadow: m.role === "user" 
                  ? "0 4px 12px rgba(15, 118, 110, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.08)",
                lineHeight: "1.6",
                fontSize: "15px"
              }}>
                <div style={{ 
                  fontSize: "12px", 
                  fontWeight: "600", 
                  marginBottom: "8px",
                  opacity: 0.8,
                  color: m.role === "user" ? "rgba(255,255,255,0.9)" : "#6b7280"
                }}>
                  {m.role === "user" ? "あなた" : "知恵の輪"}
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                background: "#e7e0f7",
                color: "#6b46c1"
              }}>
                🔮
              </div>
              <div style={{
                padding: "16px 20px",
                borderRadius: "18px",
                background: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6b7280"
              }}>
                <div className="pulse-dot" style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#6b46c1"
                }}></div>
                <div className="pulse-dot" style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#6b46c1"
                }}></div>
                <div className="pulse-dot" style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#6b46c1"
                }}></div>
                <span style={{ fontSize: "14px", marginLeft: "8px" }}>考えています...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: "24px",
          background: "white",
          borderTop: "1px solid #e5e7eb"
        }}>
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-end"
          }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={3}
                placeholder="メッセージを入力してください... (Cmd/Ctrl + Enter で送信)"
                style={{ 
                  width: "100%", 
                  padding: "16px 20px",
                  borderRadius: "16px",
                  border: "2px solid #e5e7eb",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  resize: "none",
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  background: "#fafafa"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4f46e5";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.background = "#fafafa";
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setMessages([])}
                disabled={loading}
                style={{ 
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  background: "white",
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.background = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "white";
                  }
                }}
              >
                リセット
              </button>
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{ 
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: loading || !input.trim() 
                    ? "#d1d5db" 
                    : "linear-gradient(135deg, #374151 0%, #4b5563 100%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: loading || !input.trim() 
                    ? "none" 
                    : "0 4px 12px rgba(55, 65, 81, 0.2)"
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(55, 65, 81, 0.25)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(55, 65, 81, 0.2)";
                  }
                }}
              >
                {loading ? "送信中..." : "送信"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}