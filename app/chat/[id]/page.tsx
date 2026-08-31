"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { useBooking } from "@/lib/context/booking-context";
import { Send, ArrowLeft, ShieldCheck, User, Store } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const { guideRequests } = useBooking();
  
  const [inputText, setInputText] = React.useState("");
  const [messages, setMessages] = React.useState<any[]>([]);
  const [orderDetails, setOrderDetails] = React.useState<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  React.useEffect(() => {
    if (!id) return;

    const fetchMessagesAndOrder = async () => {
      // Tarik Pesan
      const { data: msgData } = await supabase.from("chat_messages").select("*").eq("order_or_request_id", id).order("created_at", { ascending: true });
      if (msgData) setMessages(msgData);

      // FIX: Sederhanakan Query untuk mencegah PGRST200
      if (id.startsWith("TRX-")) {
        const { data: ordData, error } = await supabase
          .from("bookings")
          .select("*, customer:profiles!customer_id(full_name)")
          .eq("qr_code_token", id)
          .single();
          
        if (!error && ordData) {
          setOrderDetails(ordData);
        }
      }
    };

    fetchMessagesAndOrder();

    const channel = supabase.channel(`room_${id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `order_or_request_id=eq.${id}` }, (payload) => {
      setMessages((prev) => [...prev, payload.new]);
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, supabase]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 border border-stone-300 rounded-none mt-12 space-y-4">
          <p className="font-bold text-sm">Silakan login untuk mengakses Room Chat.</p>
        </div>
      </main>
    );
  }

  const guideReq = guideRequests.find((r: any) => r.id === id);
  const isGuideChat = !!guideReq;
  
  let targetName = "Mitra GAMTARA";
  let subtitle = "";

  if (isGuideChat) {
    targetName = user.role === "pemandu" ? guideReq.clientName : guideReq.guideName;
    subtitle = `Destinasi: ${guideReq.selectedDestination}`;
  } else if (orderDetails) {
    targetName = user.role === "pemilik" ? orderDetails.customer?.full_name : "Toko Alat Outdoor";
    subtitle = `Total Transaksi: Rp ${Number(orderDetails.total_amount).toLocaleString("id-ID")}`;
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const textToSend = inputText;
    setInputText(""); 

    const { error } = await supabase.from("chat_messages").insert([{
      order_or_request_id: id, sender_name: user.name, text: textToSend
    }]);

    if (error) alert("Gagal mengirim pesan. Periksa koneksi Anda.");
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-28 pb-16 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-mono font-bold text-stone-600 hover:text-[#1d3a28] uppercase cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="bg-white border border-stone-300 rounded-none overflow-hidden shadow-sm flex flex-col h-[580px]">
          <div className="bg-[#1d3a28] text-white p-4 flex justify-between items-center border-b border-stone-800">
            <div>
              <span className="font-mono text-[10px] text-[#c5922e] uppercase font-bold tracking-widest block mb-1">// ROOM CHAT TERVERIFIKASI</span>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                {isGuideChat ? <User className="w-4 h-4 text-emerald-300" /> : <Store className="w-4 h-4 text-emerald-300" />}
                Kontak: {targetName}
              </h2>
              <p className="text-[10px] text-stone-300 font-mono mt-1">{subtitle}</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Lunas & Aktif
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#f9f8f3] text-xs">
            {messages.length === 0 ? (
              <p className="text-center text-stone-500 font-mono mt-10">Belum ada pesan. Mulai percakapan sekarang.</p>
            ) : (
              messages.map((msg: any) => (
                <div key={msg.id} className={`p-3.5 rounded-none max-w-[80%] space-y-1 ${msg.sender_name === user.name ? "ml-auto bg-[#1d3a28] text-white" : "bg-white border border-stone-300 text-stone-900"}`}>
                  <div className="flex justify-between items-center gap-4 text-[10px] opacity-75 font-mono">
                    <span className="font-bold">{msg.sender_name}</span>
                    <span>{formatTime(msg.created_at)}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-300 flex gap-2">
            <input type="text" placeholder="Ketik pesan koordinasi..." value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 px-4 py-2.5 bg-[#f4f2eb] border border-stone-300 text-xs focus:outline-none focus:border-[#1d3a28] rounded-none" />
            <button type="submit" className="px-5 py-2.5 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer rounded-none">
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}