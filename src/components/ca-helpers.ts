export type Urgency="Alta"|"Média"|"Baixa";
export type AppCard={id:string;title:string;phrase:string;category:string;icon:string;color:string;urgency:Urgency;active:boolean};
export type Notif={id:string;title:string;phrase:string;urgency:Urgency;time:string;icon:string;responded?:string;read:boolean};
export const CATEGORIES=["Necessidades","Alerta","Lazer","Bem-estar","Emoções","Personalizado"] as const;
export const URGENCIES:Urgency[]=["Alta","Média","Baixa"];
export const DEFAULT_CARDS:AppCard[]=[
  {id:"agua",title:"Água",phrase:"Eu quero água",category:"Necessidades",icon:"Droplets",color:"bg-[#E0F2FE] border-[#BAE6FD]",urgency:"Média",active:true},
  {id:"comida",title:"Comida",phrase:"Estou com fome",category:"Necessidades",icon:"UtensilsCrossed",color:"bg-[#FEF3C7] border-[#FDE68A]",urgency:"Média",active:true},
  {id:"dor",title:"Dor",phrase:"Estou com dor",category:"Alerta",icon:"HeartPulse",color:"bg-[#FEE2E2] border-[#FECACA]",urgency:"Alta",active:true},
  {id:"banheiro",title:"Banheiro",phrase:"Preciso ir ao banheiro",category:"Necessidades",icon:"ShowerHead",color:"bg-[#EDE9FE] border-[#DDD6FE]",urgency:"Alta",active:true},
  {id:"brincar",title:"Brincar",phrase:"Quero brincar ou passear",category:"Lazer",icon:"Gamepad2",color:"bg-[#D1FAE5] border-[#A7F3D0]",urgency:"Baixa",active:true},
  {id:"descansar",title:"Descansar",phrase:"Quero descansar e dormir",category:"Bem-estar",icon:"Moon",color:"bg-[#E0E7FF] border-[#C7D2FE]",urgency:"Baixa",active:true},
  {id:"medo",title:"Medo",phrase:"Estou com medo",category:"Emoções",icon:"ShieldAlert",color:"bg-[#FFEDD5] border-[#FED7AA]",urgency:"Alta",active:true},
  {id:"abraco",title:"Abraço",phrase:"Quero um abraço",category:"Emoções",icon:"Heart",color:"bg-[#FCE7F3] border-[#FBCFE8]",urgency:"Baixa",active:true},
];
export function tone(u:Urgency){ if(u==="Alta") return "bg-rose-100 text-rose-700 border-rose-200"; if(u==="Média") return "bg-amber-100 text-amber-700 border-amber-200"; return "bg-emerald-100 text-emerald-700 border-emerald-200"; }
