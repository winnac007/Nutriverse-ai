import React, { useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { useAuth } from "../lib/auth";
import api from "../lib/api";
import { toast } from "sonner";

const SUGGESTIONS = [
  "What should I eat now?",
  "I ate unhealthy, how to recover?",
  "Quick high-protein snack idea",
  "Should I sleep more or work out?",
];

export default function CoachWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user?.is_premium) return null; // only premium

  const ask = async (q) => {
    if (!q || busy) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const { data } = await api.post("/ai/coach", { question: q });
      setMessages((m) => [...m, { role: "coach", text: data.reply }]);
    } catch (e) {
      toast.error("Coach unavailable");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        data-testid="coach-fab"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-50 size-14 rounded-full nv-gradient-cu text-white grid place-items-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Open AI coach"
      >
        <Sparkles className="size-6" />
      </button>

      {open && (
        <div data-testid="coach-panel" className="fixed inset-0 z-50 sm:inset-auto sm:bottom-24 sm:right-4 sm:w-[380px] sm:h-[520px]">
          <div className="absolute inset-0 sm:rounded-2xl bg-background border border-border nv-shadow flex flex-col">
            <header className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full nv-gradient-cu grid place-items-center text-white"><Sparkles className="size-4" /></div>
                <div>
                  <div className="font-semibold text-sm">Adaptive AI Coach</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Premium</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} data-testid="coach-close" className="size-8 rounded-full hover:bg-muted grid place-items-center"><X className="size-4" /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Ask your coach anything — meals, recovery, sleep, hydration.</p>
                  <div className="grid gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => ask(s)} className="text-left text-sm px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] text-sm rounded-2xl px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.text}</div>
                </div>
              ))}
              {busy && <div className="text-xs text-muted-foreground">Coach is thinking…</div>}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="p-3 border-t border-border flex gap-2">
              <input
                data-testid="coach-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 bg-card border border-border rounded-full px-4 text-sm h-10 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="submit" data-testid="coach-send" disabled={busy || !input} className="size-10 rounded-full nv-gradient-cu text-white grid place-items-center disabled:opacity-50">
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
