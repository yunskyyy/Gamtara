"use client";

import * as React from "react";
import { X, Send, User } from "lucide-react";

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  guideName: string;
}

export function RoomChatModal({ isOpen, onClose, clientName, guideName }: ChatProps) {
  const [messages, setMessages] = React.useState([
    { sender: guideName, text: `Halo Klien ${clientName}! Pembayaran telah dikonfirmasi. Sampai jumpa di titik kumpul!`, time: "10:00" },
  ]);
  const [input, setInput] = React.useState("");

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: clientName, text: input, time: "10:05" }]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#f4f2eb] border border-stone-300 rounded-xl shadow-2xl flex flex-col h-[500px]">
        <div className="p-4 bg-[#1d3a28] text-white rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#c5922e]" />
            <span className="font-bold text-xs font-mono uppercase">ROOM CHAT: {guideName}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:text-stone-300 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-xl max-w-[80%] ${m.sender === clientName ? "ml-auto bg-[#1d3a28] text-white" : "bg-white border border-stone-300 text-stone-900"}`}>
              <p className="font-bold text-[10px] opacity-75 mb-1">{m.sender}</p>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-300 flex gap-2 rounded-b-xl">
          <input type="text" placeholder="Ketik pesan..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-3 py-2 bg-[#f4f2eb] border border-stone-300 rounded-xl text-xs" />
          <button type="submit" className="px-4 py-2 bg-[#1d3a28] text-white rounded-xl text-xs font-bold uppercase"><Send className="w-3.5 h-3.5" /></button>
        </form>
      </div>
    </div>
  );
}
