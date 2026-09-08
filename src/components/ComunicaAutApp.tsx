import { useEffect, useState, useRef, useCallback } from "react";
import { Droplets, UtensilsCrossed, HeartPulse, ShowerHead, Gamepad2, Moon, ShieldAlert, Heart, Infinity as InfinityIcon, Volume2, Bell, Settings2, Plus, Eye, EyeOff, Trash2, CheckCheck, Send, Sparkles, Lock, Unlock, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
type Urgency = "Alta" | "Média" | "Baixa";
type AppCard = { id: string; title: string; phrase: string; category: string; icon: string; color: string; urgency: Urgency; active: boolean };
type Notif = { id: string; title: string; phrase: string; urgency: Urgency; time: string; icon: string; responded?: string; read: boolean };
const CATS = ["Necessidades","Alerta","Lazer","Bem-estar","Emoções","Personalizado"];
const DEFAULT_CARDS: AppCard[] = [
  { id:"agua", title:"Água", phrase:"Eu quero água", category:"Necessidades", icon:"Droplets", color:"bg-[#E0F2FE] border-[#BAE6FD]", urgency:"Média", active:true },
  { id:"comida", title:"Comida", phrase:"Estou com fome", category:"Necessidades", icon:"UtensilsCrossed", color:"bg-[#FEF3C7] border-[#FDE68A]", urgency:"Média", active:true },
  { id:"dor", title:"Dor", phrase:"Estou com dor", category:"Alerta", icon:"HeartPulse", color:"bg-[#FEE2E2] border-[#FECACA]", urgency:"Alta", active:true },
  { id:"banheiro", title:"Banheiro", phrase:"Preciso ir ao banheiro", category:"Necessidades", icon:"ShowerHead", color:"bg-[#EDE9FE] border-[#DDD6FE]", urgency:"Alta", active:true },
  { id:"brincar", title:"Brincar", phrase:"Quero brincar ou passear", category:"Lazer", icon:"Gamepad2", color:"bg-[#D1FAE5] border-[#A7F3D0]", urgency:"Baixa", active:true },
  { id:"descansar", title:"Descansar", phrase:"Quero descansar e dormir", category:"Bem-estar", icon:"Moon", color:"bg-[#E0E7FF] border-[#C7D2FE]", urgency:"Baixa", active:true },
  { id:"medo", title:"Medo", phrase:"Estou com medo", category:"Emoções", icon:"ShieldAlert", color:"bg-[#FFEDD5] border-[#FED7AA]", urgency:"Alta", active:true },
  { id:"abraco", title:"Abraço", phrase:"Quero um abraço", category:"Emoções", icon:"Heart", color:"bg-[#FCE7F3] border-[#FBCFE8]", urgency:"Baixa", active:true },
];
const ICON_MAP: Record<string,any> = { Droplets, UtensilsCrossed, HeartPulse, ShowerHead, Gamepad2, Moon, ShieldAlert, Heart };
function tone(u:Urgency){ if(u==="Alta") return "bg-rose-100 text-rose-700 border-rose-200"; if(u==="Média") return "bg-amber-100 text-amber-700 border-amber-200"; return "bg-emerald-100 text-emerald-700 border-emerald-200"; }
export function ComunicaAutApp(){
  const [mode,setMode]=useState<"filho"|"pais">("filho");
  const [cards,setCards]=useState<AppCard[]>(DEFAULT_CARDS);
  const [notifs,setNotifs]=useState<Notif[]>([]);
  const [pin,setPin]=useState("1234");
  const [pinInput,setPinInput]=useState("");
  const [pinErr,setPinErr]=useState("");
  const [showPin,setShowPin]=useState(false);
  const [pending,setPending]=useState<"filho"|"pais"|null>(null);
  const [rate,setRate]=useState(0.95);
  const [pitch,setPitch]=useState(1);
  const [speaking,setSpeaking]=useState(false);
  const [confirmId,setConfirmId]=useState<string|null>(null);
  const [debounceUntil,setDebounceUntil]=useState(0);
  const [reply,setReply]=useState<string|null>(null);
  const [showNew,setShowNew]=useState(false);
  const [filter,setFilter]=useState("Todas");
  const [newCard,setNewCard]=useState<Partial<AppCard>>({title:"",phrase:"",category:"Personalizado",icon:"Heart",urgency:"Baixa"});
  const [customImg,setCustomImg]=useState<string|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const debRef=useRef(0);
  useEffect(()=>{
    try{
      const c=localStorage.getItem("ca_cards"); if(c) setCards(JSON.parse(c));
      const n=localStorage.getItem("ca_notifs"); if(n) setNotifs(JSON.parse(n));
      const p=localStorage.getItem("ca_pin"); if(p) setPin(p);
      const r=localStorage.getItem("ca_rate"); if(r) setRate(parseFloat(r));
      const pi=localStorage.getItem("ca_pitch"); if(pi) setPitch(parseFloat(pi));
    }catch{}
  },[]);
  useEffect(()=>{localStorage.setItem("ca_cards",JSON.stringify(cards));},[cards]);
  useEffect(()=>{localStorage.setItem("ca_notifs",JSON.stringify(notifs));},[notifs]);
  useEffect(()=>{localStorage.setItem("ca_pin",pin);},[pin]);
  useEffect(()=>{localStorage.setItem("ca_rate",String(rate));},[rate]);
  useEffect(()=>{localStorage.setItem("ca_pitch",String(pitch));},[pitch]);
  useEffect(()=>{ if("speechSynthesis" in window){ window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices(); } },[]);
  const speak=useCallback((t:string)=>{
    if(!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(t);
    u.lang="pt-BR"; u.rate=rate; u.pitch=pitch; u.volume=1;
    const vs=window.speechSynthesis.getVoices();
    const pt=vs.find(v=>v.lang.toLowerCase().includes("pt"));
    if(pt) u.voice=pt;
    u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false); u.onerror=()=>setSpeaking(false);
    window.speechSynthesis.speak(u);
  },[rate,pitch]);
  const handleCard=(card:AppCard)=>{
    const now=Date.now();
    if(now<debounceUntil||now<debRef.current) return;
    const next=now+1600; setDebounceUntil(next); debRef.current=next;
    speak(card.phrase);
    const n:Notif={ id:`${Date.now()}-${card.id}`, title:card.title, phrase:card.phrase, urgency:card.urgency, time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}), icon:card.icon, read:false };
    setNotifs(p=>[n,...p].slice(0,80));
    setConfirmId(card.id); setTimeout(()=>setConfirmId(null),2200);
    setTimeout(()=>setDebounceUntil(0),1600);
    if("vibrate" in navigator) (navigator as any).vibrate(60);
  };
  const requestMode=(t:"filho"|"pais")=>{
    if(t==="pais"&&mode==="filho"){ setPending(t); setPinInput(""); setPinErr(""); setShowPin(true);} else setMode(t);
  };
  const confirmPin=()=>{
    if(pinInput===pin){ setShowPin(false); if(pending) setMode(pending); setPinErr(""); setPinInput(""); } else setPinErr("PIN incorreto. Tente novamente.");
  };
  const handleReply=(id:string,msg:string)=>{
    setNotifs(p=>p.map(n=>n.id===id?{...n,responded:msg,read:true}:n));
    setReply(msg); speak(msg); setTimeout(()=>setReply(null),6000);
  };
  const filtered=filter==="Todas"?cards:cards.filter(c=>c.category===filter);
  const activeCards=filtered.filter(c=>c.active);
  const unread=notifs.filter(n=>!n.read).length;
  return (
    <div className="min-h-screen w-full selection:bg-[#DDD6FE]" style={{fontFamily:"'Nunito',system-ui,sans-serif",background:"linear-gradient(180deg,#F8F7FF 0%,#EFF6FF 45%,#FFF7ED 100%)"}}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full bg-[#C7D2FE]/30 blur-3xl" />
        <div className="absolute top-40 -right-24 h-[420px] w-[420px] rounded-full bg-[#FBCFE8]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#FEF3C7]/25 blur-3xl" />
      </div>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-[#EDE9FE]">
        <div className="mx-auto max-w-[1080px] px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#EDE9FE] relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{background:"linear-gradient(135deg,#60A5FA 0%,#A78BFA 50%,#F472B6 75%,#FBBF24 100%)"}} />
              <InfinityIcon className="h-6 w-6 text-[#6366F1] relative" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[22px] font-extrabold leading-none tracking-tight text-[#312E81]" style={{fontFamily:"'Baloo 2',cursive"}}>ComunicaAut</h1>
              <p className="hidden sm:block text-[11px] font-bold tracking-widest text-[#6D28D9]/60 uppercase">Comunicação Alternativa e Aumentativa</p>
              <p className="sm:hidden text-[11px] font-bold text-[#6366F1]">CAA • acolhimento e voz</p>
            </div>
            <span className="hidden md:inline-flex ml-2 items-center gap-1 rounded-full bg-[#EDE9FE] px-2.5 py-1 text-[11px] font-bold text-[#6D28D9] border border-[#DDD6FE]"><Sparkles className="h-3 w-3"/> Sensorialmente suave</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-full bg-[#F5F3FF] p-1 border border-[#DDD6FE]">
              <button onClick={()=>requestMode("filho")} className={`rounded-full px-4 py-2 text-sm font-extrabold ${mode==="filho"?"bg-white shadow-sm text-[#4338CA] border border-[#DDD6FE]":"text-[#6B7280]"}`}>Modo Filho</button>
              <button onClick={()=>requestMode("pais")} className={`rounded-full px-4 py-2 text-sm font-extrabold flex items-center gap-1.5 ${mode==="pais"?"bg-[#4338CA] shadow text-white":"text-[#6B7280]"}`}><Lock className="h-3.5 w-3.5"/> Modo Pais {unread>0&&<span className="ml-1 bg-white text-[#4338CA] text-[11px] font-black rounded-full px-1.5 py-0.5">{unread}</span>}</button>
            </div>
            <div className="flex sm:hidden rounded-full bg-[#F5F3FF] p-1 border border-[#DDD6FE]">
              <button onClick={()=>requestMode("filho")} className={`rounded-full px-3 py-1.5 text-xs font-black ${mode==="filho"?"bg-white shadow text-[#4338CA] border border-[#DDD6FE]":"text-[#6B7280]"}`}>Filho</button>
              <button onClick={()=>requestMode("pais")} className={`rounded-full px-3 py-1.5 text-xs font-black flex items-center gap-1 ${mode==="pais"?"bg-[#4338CA] text-white":"text-[#6B7280]"}`}><Lock className="h-3 w-3"/> Pais</button>
            </div>
          </div>
        </div>
      </header>
      {reply && (
        <div className="sticky top-[57px] z-30 mx-auto max-w-[1080px] px-3 sm:px-6 pt-3">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#06B6D4] px-4 py-3 text-white shadow-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><CheckCheck className="h-5 w-5"/></div>
            <div className="flex-1 min-w-0"><p className="text-sm font-black">Resposta dos cuidadores</p><p className="text-sm font-bold opacity-90 truncate">{reply}</p></div>
            <Button variant="secondary" size="sm" className="rounded-full bg-white text-emerald-700 font-black" onClick={()=>setReply(null)}><X className="h-4 w-4"/></Button>
          </div>
        </div>
      )}
      <main className="relative mx-auto max-w-[1080px] px-3 sm:px-6 pb-10 pt-4">
        {mode==="filho" ? (
          <ChildView filtered={filtered} activeCards={activeCards} filter={filter} setFilter={setFilter} rate={rate} setRate={setRate} pitch={pitch} setPitch={setPitch} speaking={speaking} speak={speak} handleCard={handleCard} confirmId={confirmId} debounceUntil={debounceUntil} />
        ) : (
          <ParentView cards={cards} setCards={setCards} notifs={notifs} setNotifs={setNotifs} filter={filter} setFilter={setFilter} pin={pin} setPin={setPin} rate={rate} setRate={setRate} pitch={pitch} setPitch={setPitch} speaking={speaking} speak={speak} handleReply={handleReply} setShowNew={setShowNew} setMode={setMode} />
        )}
      </main>


