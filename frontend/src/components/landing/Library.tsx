"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Star, Check, Smartphone, CreditCard, Landmark } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

type Book = {
  id: string;
  title: string;
  desc: string;
  price: string;
  priceValue: number;
  priceOrig: string;
  priceNote: string;
  readTime: string;
  level: string;
  coverClass: string;
  brandColor: string;
  titleColor: string;
  tagline: string;
  isFree: boolean;
  inside: string[];
};

const BOOKS: Book[] = [
  {
    id: "mindful",
    title: "The Mindful Eating Handbook",
    desc: "Build awareness, tune into hunger cues, and develop a calmer relationship with food.",
    price: "Free",
    priceValue: 0,
    priceOrig: "₹199",
    priceNote: "Yours always, no card needed",
    readTime: "48 min read",
    level: "Beginner",
    coverClass: "bg-espresso text-ivory",
    brandColor: "text-ivory/40",
    titleColor: "text-ivory",
    tagline: "A gentle guide to building awareness around food.",
    isFree: true,
    inside: [
      "How to tune into real hunger vs. emotional hunger",
      "The 5 mindful eating principles explained simply",
      "A 7-day awareness journal template",
      "How to eat slowly — and actually enjoy it",
      "Building a calmer relationship with food"
    ],
  },
  {
    id: "decode",
    title: "Decode Your Plate",
    desc: "Learn how to build balanced meals that support your condition, goals, and lifestyle.",
    price: "₹299",
    priceValue: 299,
    priceOrig: "₹499",
    priceNote: "Early access price — save ₹200",
    readTime: "36 min read",
    level: "Beginner",
    coverClass: "bg-[#E8E3D7] text-espresso border border-espresso/5",
    brandColor: "text-espresso/40",
    titleColor: "text-espresso",
    tagline: "Understand what your plate needs for your body and your goals.",
    isFree: false,
    inside: [
      "What your plate's macros are actually doing for you",
      "Condition-specific meal building — PCOS, diabetes, thyroid",
      "Portion sizes without obsessive measuring",
      "The swap library: healthier versions of everyday meals",
      "Regional Indian meal templates"
    ],
  },
  {
    id: "kitchen",
    title: "The Zenplato Kitchen Guide",
    desc: "Your go-to guide for smart swaps, pantry essentials, and effortless healthy cooking.",
    price: "₹199",
    priceValue: 199,
    priceOrig: "₹349",
    priceNote: "Early access price — save ₹150",
    readTime: "30 min read",
    level: "Beginner",
    coverClass: "bg-[#E8E3D7] text-espresso border border-espresso/5",
    brandColor: "text-espresso/40",
    titleColor: "text-espresso",
    tagline: "Smart swaps, pantry essentials & tools for everyday wellness.",
    isFree: false,
    inside: [
      "The 20 pantry essentials every healthy kitchen needs",
      "Smart ingredient swaps for common unhealthy staples",
      "Tools worth buying vs. overhyped gadgets",
      "How to read food labels without getting confused",
      "Budget-friendly healthy grocery list"
    ],
  },
];

export function Library() {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  return (
    <section id="library" className="bg-ivory py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <AnimatePresence mode="wait">
          {!selectedBookId ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="mb-20">
                <SectionLabel index="VII">The Library</SectionLabel>
                <h2 className="mt-6 max-w-2xl font-serif text-[44px] leading-[1.08] text-espresso md:text-[68px]">
                  Knowledge that changes<br />
                  the way you eat,<br />
                  <span className="italic text-olive">one page at a time.</span>
                </h2>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-espresso/60">
                  From understanding ingredients to mastering mindful meals, every guide is designed to help you build a healthier relationship with food.
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {BOOKS.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    onClick={() => setSelectedBookId(book.id)}
                    className="group cursor-pointer bg-[#F5F1EA] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-espresso/10"
                  >
                    {/* Cover */}
                    <div className={`relative flex h-[260px] flex-col justify-between p-6 ${book.coverClass}`}>
                      <div className={`text-[8px] font-light tracking-[0.22em] uppercase ${book.brandColor}`}>
                        zenplato
                      </div>
                      <h3 className={`font-serif text-[26px] font-light leading-[1.15] ${book.titleColor}`}>
                        {book.title.split(' ').map((word, index) => (
                          <span key={index}>{word}<br /></span>
                        ))}
                      </h3>
                      <div className="flex items-end justify-between gap-4">
                        <p className={`text-[9px] font-light leading-relaxed tracking-wider opacity-60 max-w-[120px]`}>
                          {book.tagline}
                        </p>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 font-serif text-[12px]">
                          Z
                        </div>
                      </div>
                      <div className={`absolute top-4 right-4 rounded-sm px-2.5 py-1 text-[9px] font-medium tracking-widest uppercase ${book.isFree ? "bg-espresso text-ivory" : "bg-olive text-ivory"}`}>
                        {book.price}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <h4 className="font-serif text-[20px] text-espresso leading-tight mb-3">
                        {book.title}
                      </h4>
                      <p className="text-[13px] leading-relaxed text-espresso/60 font-light mb-5">
                        {book.desc}
                      </p>
                      <div className="flex gap-4 mb-5">
                        <div className="flex items-center gap-1.5 text-[11px] text-espresso/60 font-light">
                          <Clock className="w-3 h-3 opacity-60" /> {book.readTime}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-espresso/60 font-light">
                          <Star className="w-3 h-3 opacity-60" /> {book.level}
                        </div>
                      </div>
                      <div className="h-px w-full bg-espresso/10 mb-4" />
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium tracking-wide text-espresso">Preview Guide</span>
                        <ArrowRight className="w-4 h-4 text-espresso/40 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Free Clinical Guides CTA */}
              <div className="mt-16 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #232118 0%, #3D3A2F 50%, #232118 100%)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-0">
                  <div className="p-10 md:p-14">
                    <p className="text-[9px] font-medium tracking-[0.28em] uppercase mb-4 text-olive">
                      Free · App Members Only
                    </p>
                    <h3 className="font-serif text-[32px] md:text-[40px] leading-[1.1] text-white font-light mb-5">
                      Clinical Health<br />
                      <span className="italic text-olive">Guides</span>
                    </h3>
                    <p className="text-[13px] leading-relaxed font-light mb-8 text-ivory/50">
                      Free, AI-generated condition guides for PCOS, Diabetes, Thyroid, Gut Health, Anti-Inflammatory, and Menopause — with recipes, protocols, and food rules tailored to your profile.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["PCOS", "Diabetes", "Thyroid", "Gut Health", "Menopause", "Anti-Inflammatory"].map((c) => (
                        <span key={c} className="px-3 py-1.5 rounded-full text-[10px] tracking-wide font-medium bg-olive/10 text-olive border border-olive/20">{c}</span>
                      ))}
                    </div>
                    <a
                      href="/auth?mode=login&next=/onboarding"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-medium tracking-[0.18em] uppercase transition-all bg-olive text-white hover:bg-olive/90"
                    >
                      Sign in to read free →
                    </a>
                  </div>
                  <div className="hidden md:flex items-center justify-center p-14">
                    <div className="grid grid-cols-2 gap-3 w-full max-w-[240px]">
                      {[
                        { label: "PCOS Guide", ch: "16 chapters" },
                        { label: "Diabetes", ch: "16 chapters" },
                        { label: "Thyroid", ch: "16 chapters" },
                        { label: "Gut Health", ch: "16 chapters" },
                      ].map((b) => (
                        <div key={b.label} className="rounded-xl p-4 flex flex-col gap-2 bg-white/5 border border-white/10">
                          <div className="text-[8px] tracking-widest uppercase font-light text-white/30">zenplato</div>
                          <div className="font-serif text-[13px] text-white leading-tight">{b.label}</div>
                          <div className="text-[9px] text-olive">{b.ch}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Strip */}
              <div className="relative mt-32 border-y border-espresso/10 bg-[#E8E3D9] py-20 px-6 text-center overflow-hidden">
                <div className="pointer-events-none absolute left-10 top-5 font-serif text-[120px] text-olive opacity-10 leading-none">"</div>
                <div className="pointer-events-none absolute right-10 bottom-0 font-serif text-[120px] text-olive opacity-10 leading-none rotate-180">"</div>
                <p className="relative z-10 mx-auto max-w-3xl font-serif text-[26px] leading-[1.45] text-espresso md:text-[34px] font-light">
                  The goal isn't to eat perfectly. The goal is to understand your food well enough that healthy choices become <span className="italic text-olive">effortless.</span>
                </p>
                <div className="mt-8 mx-auto h-px w-10 bg-espresso/30" />
              </div>

              {/* Founding Reader */}
              <div className="mt-32">
                <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-16 overflow-hidden rounded-lg bg-[#232118] p-12 md:p-24">
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-20 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 20 C120 20,150 40,160 70 C170 100,160 130,140 150 C120 170,80 170,60 150 C40 130,30 100,40 70 C50 40,80 20,100 20Z" fill="#5A6A3A" />
                    </svg>
                  </div>
                  
                  <div>
                    <div className="mb-6 text-[10px] font-medium tracking-[0.25em] uppercase text-olive/80">
                      Early Access
                    </div>
                    <h3 className="font-serif text-[40px] leading-[1.1] text-ivory md:text-[54px] font-light">
                      Become a<br />
                      <span className="text-olive">Founding Reader</span>
                    </h3>
                  </div>
                  
                  <div>
                    <p className="mb-10 text-[14px] leading-relaxed text-ivory/60 font-light">
                      Join early access and receive exclusive Zenplato guides, recipes, and educational content before public release. Founding members get early pricing and a hand in shaping the platform.
                    </p>
                    <div className="mb-8 h-px w-10 bg-olive/40" />
                    <button className="inline-flex items-center gap-4 bg-ivory px-8 py-4 text-[11px] font-medium tracking-[0.18em] uppercase text-espresso transition-colors hover:bg-[#DDD7CC]">
                      Join Early Access <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <BookDetail 
              book={BOOKS.find(b => b.id === selectedBookId)!} 
              onBack={() => setSelectedBookId(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function BookDetail({ book, onBack }: { book: Book; onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("upi");
  const [success, setSuccess] = useState(false);
  const [formData, setState] = useState({
    fname: "",
    lname: "",
    email: "",
    focus: "",
    conditions: [] as string[],
    food: "",
    cooking: ""
  });

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto py-10 text-center"
      >
        <div className="w-20 h-20 bg-olive rounded-full flex items-center justify-center mx-auto mb-8 text-white">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-[40px] leading-tight text-espresso mb-4">
          Your guide<br /><span className="italic text-olive">is on its way.</span>
        </h2>
        <p className="text-espresso/60 leading-relaxed mb-10 max-w-sm mx-auto">
          Check your inbox at <strong>{formData.email || "your email"}</strong>. Your PDF will arrive within 2 minutes. Check spam if you don't see it.
        </p>
        <button className="inline-flex items-center gap-3 bg-espresso text-ivory px-10 py-5 rounded-full text-[12px] font-medium tracking-[0.18em] uppercase hover:bg-espresso/90 transition-all">
          Download Now <ArrowRight className="w-4 h-4" />
        </button>
        <p className="mt-8 text-[12px] text-espresso/40">
          You can also access all your guides from your Zenplato account.
        </p>
        <button onClick={onBack} className="mt-12 text-espresso/60 hover:text-espresso text-[11px] underline underline-offset-4 tracking-widest uppercase">
          Back to Library
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase text-espresso/50 hover:text-espresso mb-12 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to The Library
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left: Book Info */}
        <div className="sticky top-10">
          <div className={`relative flex h-[420px] max-w-[320px] flex-col justify-between p-8 shadow-2xl ${book.coverClass}`}>
             <div className={`text-[9px] font-light tracking-[0.28em] uppercase ${book.brandColor}`}>
                zenplato
              </div>
              <h3 className={`font-serif text-[38px] font-light leading-[1.1] ${book.titleColor}`}>
                {book.title}
              </h3>
              <div className={`text-[10px] font-light tracking-[0.1em] uppercase opacity-35 ${book.titleColor}`}>
                zenplato guide
              </div>
          </div>

          <div className="mt-12 flex gap-10">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-espresso/40 mb-1">Read Time</p>
              <p className="font-serif text-xl text-espresso">{book.readTime.split(' ')[0]} min</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-espresso/40 mb-1">Level</p>
              <p className="font-serif text-xl text-espresso">{book.level}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-espresso/40 mb-1">Format</p>
              <p className="font-serif text-xl text-espresso">PDF</p>
            </div>
          </div>

          <div className="mt-10 flex items-baseline gap-4">
            <span className="font-serif text-[44px] text-espresso">{book.price}</span>
            {!book.isFree && <span className="text-xl text-espresso/30 line-through font-serif">{book.priceOrig}</span>}
          </div>
          <p className={`text-[12px] font-medium tracking-wide ${book.isFree ? "text-olive" : "text-olive/80"}`}>
            {book.priceNote}
          </p>

          <div className="mt-12 pt-12 border-t border-espresso/10">
            <p className="text-[11px] tracking-[0.2em] uppercase text-espresso/50 mb-6">What's Inside</p>
            <ul className="space-y-4">
              {book.inside.map((item, i) => (
                <li key={i} className="flex gap-4 text-[14px] text-espresso/70 leading-relaxed font-light">
                  <span className="text-olive font-serif text-lg leading-none">—</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white/40 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] border border-espresso/5 shadow-xl">
          <h2 className="font-serif text-[36px] md:text-[44px] leading-tight text-espresso mb-4">
            Get your<br /><span className="italic text-olive">{book.isFree ? "free guide." : "guide."}</span>
          </h2>
          <p className="text-espresso/60 text-[14px] leading-relaxed mb-10 font-light">
            {book.isFree 
              ? "Fill in your details and answer a few quick questions. Your PDF will be in your inbox instantly — free, always."
              : "Fill in your details and we'll personalise your guide. Secure payment. Instant PDF download."}
          </p>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] transition-all duration-500 border ${
                  step === s ? "bg-espresso border-espresso text-ivory scale-110 shadow-lg" : 
                  step > s ? "bg-olive border-olive text-ivory" : "bg-transparent border-espresso/20 text-espresso/40"
                }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-px mx-4 transition-colors duration-500 ${step > s ? "bg-olive/40" : "bg-espresso/10"}`} />}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">First Name</label>
                    <input 
                      type="text" placeholder="Priya" 
                      className="w-full bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light"
                      value={formData.fname} onChange={(e) => setState({...formData, fname: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">Last Name</label>
                    <input 
                      type="text" placeholder="Sharma" 
                      className="w-full bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light"
                      value={formData.lname} onChange={(e) => setState({...formData, lname: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">Email Address</label>
                  <input 
                    type="email" placeholder="priya@example.com" 
                    className="w-full bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light"
                    value={formData.email} onChange={(e) => setState({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">Phone Number</label>
                  <div className="flex gap-4 items-end">
                    <select className="bg-transparent border-b border-espresso/20 py-3 text-sm outline-none font-light cursor-pointer">
                      <option>🇮🇳 +91</option>
                      <option>🇺🇸 +1</option>
                      <option>🇬🇧 +44</option>
                    </select>
                    <input 
                      type="tel" placeholder="98765 43210" 
                      className="flex-1 bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <input type="checkbox" className="mt-1 rounded-sm border-espresso/30" defaultChecked />
                  <p className="text-[12px] text-espresso/50 leading-relaxed font-light">
                    I agree to receive my guide and occasional wellness insights from Zenplato. No spam — ever.
                  </p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-4 bg-espresso text-ivory py-5 rounded-xl text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-espresso/90 transition-all shadow-xl shadow-espresso/10"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div className="space-y-5">
                  <p className="font-serif text-lg text-espresso leading-snug">What best describes your current health focus?</p>
                  <div className="flex flex-wrap gap-2">
                    {["Weight management", "Managing a condition", "Better gut health", "More energy", "Preventive health", "General wellness"].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setState({...formData, focus: opt})}
                        className={`px-5 py-3 border text-[12px] transition-all font-light ${formData.focus === opt ? "bg-espresso border-espresso text-ivory" : "border-espresso/10 text-espresso/60 hover:border-espresso/40"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <p className="font-serif text-lg text-espresso leading-snug">
                    Do you have any of these conditions? 
                    <span className="block text-[13px] text-espresso/40 italic font-serif mt-1">(Select all that apply)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["PCOS / PCOD", "Diabetes", "Thyroid", "Hypertension", "Cholesterol", "None"].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => {
                          const exists = formData.conditions.includes(opt);
                          setState({
                            ...formData, 
                            conditions: exists 
                              ? formData.conditions.filter(c => c !== opt) 
                              : [...formData.conditions, opt]
                          });
                        }}
                        className={`px-5 py-3 border text-[12px] transition-all font-light ${formData.conditions.includes(opt) ? "bg-espresso border-espresso text-ivory" : "border-espresso/10 text-espresso/60 hover:border-espresso/40"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <p className="font-serif text-lg text-espresso leading-snug">What's your food preference?</p>
                  <div className="flex flex-wrap gap-2">
                    {["Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Eggetarian"].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setState({...formData, food: opt})}
                        className={`px-5 py-3 border text-[12px] transition-all font-light ${formData.food === opt ? "bg-espresso border-espresso text-ivory" : "border-espresso/10 text-espresso/60 hover:border-espresso/40"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    onClick={() => setStep(3)}
                    className="w-full flex items-center justify-center gap-4 bg-espresso text-ivory py-5 rounded-xl text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-espresso/90 transition-all shadow-xl shadow-espresso/10"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setStep(1)} className="w-full py-4 text-[11px] text-espresso/40 tracking-widest uppercase hover:text-espresso transition-colors">
                    ← Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {book.isFree ? (
                  <div className="bg-[#F5F1EA] border-l-4 border-olive p-6 rounded-r-xl">
                    <p className="text-[13px] text-espresso/80 leading-relaxed font-light">
                      ✓ <strong>This guide is completely free.</strong> No card needed. We'll send it straight to your inbox.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#F5F1EA] border-l-4 border-olive p-6 rounded-r-xl">
                      <p className="text-[13px] text-espresso/80 leading-relaxed font-light mb-1">
                        <strong>{book.title}</strong> — <strong>{book.price}</strong>
                      </p>
                      <p className="text-[12px] text-espresso/40 font-light">One-time payment. Instant PDF download.</p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">Pay With</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "upi", label: "UPI", icon: Smartphone },
                          { id: "card", label: "Card", icon: CreditCard },
                          { id: "bank", label: "Net Bank", icon: Landmark }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setPayMethod(m.id)}
                            className={`flex flex-col items-center justify-center gap-3 p-5 border rounded-xl transition-all ${
                              payMethod === m.id ? "border-espresso bg-espresso text-ivory" : "border-espresso/10 text-espresso/60 hover:border-espresso/20"
                            }`}
                          >
                            <m.icon className="w-6 h-6" />
                            <span className="text-[9px] tracking-widest uppercase">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {payMethod === "upi" && (
                      <div className="space-y-2">
                        <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">UPI ID</label>
                        <input 
                          type="text" placeholder="yourname@upi" 
                          className="w-full bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light"
                        />
                      </div>
                    )}

                    {payMethod === "card" && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">Card Number</label>
                          <input 
                            type="text" placeholder="•••• •••• •••• ••••" 
                            className="w-full bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">Expiry</label>
                            <input type="text" placeholder="MM / YY" className="w-full bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] tracking-[0.2em] uppercase text-espresso/60">CVV</label>
                            <input type="text" placeholder="•••" className="w-full bg-transparent border-b border-espresso/20 py-3 text-sm focus:border-espresso outline-none transition-colors font-light" />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 mt-4">
                  <input type="checkbox" className="mt-1 rounded-sm border-espresso/30" defaultChecked />
                  <p className="text-[12px] text-espresso/50 leading-relaxed font-light">
                    I agree to Zenplato's Terms of Service and understand this is a digital download with no refund once accessed.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    onClick={() => setSuccess(true)}
                    className="w-full flex items-center justify-center gap-4 bg-espresso text-ivory py-5 rounded-xl text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-espresso/90 transition-all shadow-xl shadow-espresso/10"
                  >
                    {book.isFree ? "Send My Free Guide" : "Pay & Download"} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setStep(2)} className="w-full py-4 text-[11px] text-espresso/40 tracking-widest uppercase hover:text-espresso transition-colors">
                    ← Back
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
