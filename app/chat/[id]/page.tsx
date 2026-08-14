"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { useBooking } from "@/lib/context/booking-context";
import { Send, ArrowLeft, ShieldCheck, User } from "lucide-react";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const { storeOrders, guideRequests, chatMessages, sendChatMessage } = useBooking();
  const [inputText, setInputText] = React.useState("");

  const guideReq = guideRequests.find((r) => r.id === id);
  const toolOrd = storeOrders.find((o) => o.orderId === id);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 border border-stone-300 rounded-sm mt-12">
          <p className="font-bold text-sm">Silakan masuk untuk mengakses Room Chat.</p>
        </div>
      </main>
    );
  }

  const isGuideChat = !!guideReq;
  const targetName = isGuideChat 
    ? (user.role === "pemandu" ? guideReq.clientName : guideReq.guideName)
    : (user.role === "pemilik" ? toolOrd?.clientName : toolOrd?.ownerName);

  const messages = chatMessages.filter((m) => m.orderOrRequestId === id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(id, user.name, inputText);
    setInputText("");
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-28 pb-16 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-mono font-bold text-stone-600 hover:text-[#1d3a28] uppercase cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="bg-white border border-stone-300 rounded-sm overflow-hidden shadow-sm flex flex-col h-[580px]">
          <div className="bg-[#1d3a28] text-white p-4 flex justify-between items-center border-b border-stone-800">
            <div>
              <span className="font-mono text-[10px] text-[#c5922e] uppercase font-bold tracking-widest block">// ROOM CHAT TERVERIFIKASI</span>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-300" /> Kontak: {targetName} ({id})
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Lunas & Aktif
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#f9f8f3] text-xs">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-3.5 rounded-sm max-w-[80%] space-y-1 ${msg.sender === user.name ? "ml-auto bg-[#1d3a28] text-white" : "bg-white border border-stone-300 text-stone-900"}`}>
                <div className="flex justify-between items-center gap-4 text-[10px] opacity-75 font-mono">
                  <span className="font-bold">{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="text-xs leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-300 flex gap-2">
            <input type="text" placeholder="Ketik pesan koordinasi..." value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 px-4 py-2.5 bg-[#f4f2eb] border border-stone-300 text-xs focus:outline-none focus:border-[#1d3a28]" />
            <button type="submit" className="px-5 py-2.5 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}