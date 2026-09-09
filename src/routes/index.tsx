import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ComunicaTEA — Prancha de comunicação por cartões" },
      {
        name: "description",
        content:
          "Prancha de comunicação alternativa para crianças autistas: toque nos cartões, monte a frase e ouça a fala em português.",
      },
      { property: "og:title", content: "ComunicaTEA — Prancha de comunicação" },
      {
        property: "og:description",
        content:
          "Cartões grandes com imagem e palavra para montar frases e falar em voz alta.",
      },
    ],
  }),
  component: Index,
});

type CategoryId = "req" | "feel" | "food" | "place" | "people";

const categories: { id: CategoryId; label: string }[] = [
  { id: "req", label: "eu quero" },
  { id: "feel", label: "sentimentos" },
  { id: "food", label: "comida" },
  { id: "place", label: "lugares" },
  { id: "people", label: "pessoas" },
];

type Card = { id: string; word: string; emoji: string; cat: CategoryId };

const cards: Card[] = [
  { id: "falar", word: "FALAR", emoji: "🗣️", cat: "req" },
  { id: "alegria", word: "ALEGRIA", emoji: "😄", cat: "feel" },
  { id: "maca", word: "MAÇÃ", emoji: "🍎", cat: "food" },
  { id: "casa", word: "CASA", emoji: "🏠", cat: "place" },
  { id: "mae", word: "MÃE", emoji: "👩", cat: "people" },
  { id: "passear", word: "PASSEAR", emoji: "🚶", cat: "req" },
  { id: "triste", word: "TRISTE", emoji: "😢", cat: "feel" },
  { id: "agua", word: "ÁGUA", emoji: "🥤", cat: "food" },
  { id: "escola", word: "ESCOLA", emoji: "🏫", cat: "place" },
  { id: "papai", word: "PAPAI", emoji: "👨", cat: "people" },
  { id: "dormir", word: "DORMIR", emoji: "🛏️", cat: "req" },
  { id: "calmo", word: "CALMO", emoji: "😌", cat: "feel" },
  { id: "brincar", word: "BRINCAR", emoji: "🧸", cat: "req" },
  { id: "banheiro", word: "BANHEIRO", emoji: "🚽", cat: "place" },
  { id: "pao", word: "PÃO", emoji: "🍞", cat: "food" },
  { id: "bravo", word: "BRAVO", emoji: "😠", cat: "feel" },
  { id: "vovo", word: "VOVÓ", emoji: "👵", cat: "people" },
  { id: "parque", word: "PARQUE", emoji: "🌳", cat: "place" },
  { id: "ajuda", word: "AJUDA", emoji: "🙋", cat: "req" },
  { id: "leite", word: "LEITE", emoji: "🥛", cat: "food" },
];

const catBg: Record<CategoryId, string> = {
  req: "bg-req/15",
  feel: "bg-feel/15",
  food: "bg-food/15",
  place: "bg-place/15",
  people: "bg-people/15",
};
const catChip: Record<CategoryId, string> = {
  req: "bg-req/15 text-req",
  feel: "bg-feel/15 text-feel",
  food: "bg-food/15 text-food",
  place: "bg-place/15 text-place",
  people: "bg-people/15 text-people",
};
const catPhrase: Record<CategoryId, string> = {
  req: "bg-req/12 ring-req/25",
  feel: "bg-feel/12 ring-feel/25",
  food: "bg-food/12 ring-food/25",
  place: "bg-place/12 ring-place/25",
  people: "bg-people/12 ring-people/25",
};
const catIcon: Record<CategoryId, string> = {
  req: "bg-req/20",
  feel: "bg-feel/20",
  food: "bg-food/20",
  place: "bg-place/20",
  people: "bg-people/20",
};
const catActive: Record<CategoryId, string> = {
  req: "bg-req text-white",
  feel: "bg-feel text-white",
  food: "bg-food text-white",
  place: "bg-place text-white",
  people: "bg-people text-white",
};

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "pt-BR";
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

function Index() {
  const [active, setActive] = useState<CategoryId>("req");
  const [phrase, setPhrase] = useState<Card[]>([]);

  const addCard = useCallback((card: Card) => {
    speak(card.word.toLowerCase());
    setPhrase((p) => [...p, card]);
  }, []);

  const visible = cards.filter((c) => c.cat === active);

  return (
    <div className="min-h-screen bg-sand text-ink font-body">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#9db4d8] via-[#d8c3ad] to-[#c9a9b3]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 sm:py-7">
        <header className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-[min(1vw,14px)] bg-req/15 ring-1 ring-black/5">
              <span className="font-display text-lg font-semibold text-req">C</span>
            </div>
            <div className="leading-none">
              <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-balance leading-none">
                ComunicaTEA
              </p>
              <p className="mt-1 text-sm text-ink/55">Prancha de comunicação</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-md ring-1 ring-black/5 px-4 py-2 text-sm">
            <span className="size-2 rounded-full bg-food" />
            <span className="font-medium">Acessível · AA+</span>
          </div>
        </header>

        <section
          aria-label="Frase"
          className="rounded-[22px] bg-white/45 backdrop-blur-md ring-1 ring-black/5 shadow-sm p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
              Minha frase
            </h1>
            <span className="text-sm text-ink/50">
              {phrase.length} {phrase.length === 1 ? "cartão" : "cartões"}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 min-h-[72px] items-center">
            {phrase.length === 0 ? (
              <p className="text-sm text-ink/45">Toque num cartão para começar a frase.</p>
            ) : (
              phrase.map((card, i) => (
                <button
                  key={`${card.id}-${i}`}
                  type="button"
                  onClick={() => setPhrase((p) => p.filter((_, idx) => idx !== i))}
                  aria-label={`Remover ${card.word}`}
                  className={`flex shrink-0 items-center gap-3 rounded-[14px] ring-1 pl-3 pr-4 py-2 ${catPhrase[card.cat]}`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid size-12 place-items-center rounded-[10px] text-2xl ${catIcon[card.cat]}`}
                  >
                    {card.emoji}
                  </span>
                  <span className="leading-none text-left">
                    <span className="block font-display text-lg font-semibold">{card.word}</span>
                    <span className="block text-xs text-ink/50 mt-1">
                      {categories.find((c) => c.id === card.cat)?.label}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => speak(phrase.map((c) => c.word.toLowerCase()).join(" "))}
              disabled={phrase.length === 0}
              className="flex-1 flex items-center justify-center gap-3 rounded-[14px] bg-req text-white py-4 text-lg font-display font-semibold ring-1 ring-inset ring-white/15 active:translate-y-[2px] disabled:opacity-45"
            >
              <span aria-hidden="true" className="shrink-0">
                🔊
              </span>{" "}
              Falar
            </button>
            <button
              type="button"
              onClick={() => setPhrase([])}
              disabled={phrase.length === 0}
              className="flex items-center justify-center gap-2 rounded-[14px] bg-white/50 backdrop-blur ring-1 ring-black/10 px-6 py-4 text-base font-semibold text-ink/70 active:translate-y-[2px] disabled:opacity-45"
            >
              <span aria-hidden="true" className="shrink-0">
                🗑️
              </span>{" "}
              Apagar
            </button>
          </div>
        </section>

        <nav aria-label="Categorias" className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              aria-pressed={active === cat.id}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                active === cat.id
                  ? catActive[cat.id]
                  : "bg-white/40 backdrop-blur ring-1 ring-black/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <section aria-label="Cartões" className="mt-4 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-4">
          {visible.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => addCard(card)}
              className="flex flex-col items-center gap-3 rounded-[20px] bg-white/50 backdrop-blur-md ring-1 ring-black/5 p-4 sm:p-5 aspect-[4/5] transition-transform duration-[180ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] active:translate-y-[5px] active:scale-[0.99]"
            >
              <span
                aria-hidden="true"
                className={`flex-1 w-full grid place-items-center rounded-[14px] outline-1 -outline-offset-1 outline-black/5 text-5xl sm:text-6xl ${catBg[card.cat]}`}
              >
                {card.emoji}
              </span>
              <span className="font-display text-lg sm:text-xl font-semibold tracking-tight">
                {card.word}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${catChip[card.cat]}`}>
                {categories.find((c) => c.id === card.cat)?.label}
              </span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
