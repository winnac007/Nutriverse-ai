"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Leaf, Utensils, Search, BarChart2, User, ListFilter, Plus } from "lucide-react";
import { motion } from "framer-motion";

// Mock data matching the ZenPlate UI
const MOCK_GROCERIES = [
  {
    category: "Vegetables",
    count: 7,
    items: [
      { name: "Spinach", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100" },
      { name: "Tomato", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100" },
      { name: "Cucumber", img: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=100" },
      { name: "Carrot", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100" }
    ],
    plus: 3
  },
  {
    category: "Grains & Pulses",
    count: 6,
    items: [
      { name: "Brown Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100" },
      { name: "Moong Dal", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100" },
      { name: "Quinoa", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100" }
    ],
    plus: 3
  },
  {
    category: "Spices & Others",
    count: 9,
    items: [
      { name: "Turmeric", img: "https://images.unsplash.com/photo-1615486171448-4e12e105e608?w=100" },
      { name: "Cumin", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100" },
      { name: "Flax Seeds", img: "https://images.unsplash.com/photo-1508061461528-98e3b123683a?w=100" }
    ],
    plus: 6
  }
];

export default function GroceryList() {
  const [loading, setLoading] = useState(true);

  // Simulating load for UI consistency
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="bg-[#FAF3E6] min-h-screen pb-32 pt-6">
      <div className="px-6">
        {/* Header - Image 8 */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-serif text-3xl text-[#3A2618]">Grocery List</h1>
            <p className="text-[#3A2618]/50 text-sm mt-1">This Week</p>
          </div>
          <button className="text-[#3A2618] mt-2">
            <ListFilter className="size-5" />
          </button>
        </header>

        {/* Categories - Image 8 */}
        <div className="space-y-8">
          {loading ? (
            <div className="animate-pulse space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between"><div className="h-4 w-24 bg-[#D9C39A]/40 rounded" /><div className="h-4 w-12 bg-[#D9C39A]/40 rounded" /></div>
                  <div className="flex gap-4"><div className="size-16 bg-[#D9C39A]/40 rounded-full" /><div className="size-16 bg-[#D9C39A]/40 rounded-full" /><div className="size-16 bg-[#D9C39A]/40 rounded-full" /></div>
                </div>
              ))}
            </div>
          ) : (
            MOCK_GROCERIES.map((section, idx) => (
              <motion.section 
                key={section.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-[#3A2618] text-sm">{section.category}</h2>
                  <span className="text-xs text-[#3A2618]/40 font-medium">{section.count} items</span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-[4.5rem]">
                      <div className="size-16 rounded-full overflow-hidden border border-[#D9C39A]/40 bg-white shadow-sm flex items-center justify-center">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover mix-blend-multiply opacity-90"
                        />
                      </div>
                      <span className="text-[10px] text-[#3A2618]/70 text-center font-medium leading-tight">
                        {item.name}
                      </span>
                    </div>
                  ))}
                  
                  {/* +X Badge */}
                  <div className="flex flex-col items-center gap-2 shrink-0 w-[4.5rem]">
                    <div className="size-16 rounded-full bg-white border border-[#D9C39A]/40 shadow-sm flex items-center justify-center">
                      <span className="font-serif text-[#3A2618]/40 text-lg">+{section.plus}</span>
                    </div>
                  </div>
                </div>
              </motion.section>
            ))
          )}
        </div>

        {/* Add Item Button - Image 8 */}
        <div className="mt-12">
          <button className="w-full bg-[#004D40] text-white rounded-full py-5 text-sm font-bold shadow-xl shadow-[#004D40]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Add Item
          </button>
        </div>
      </div>

      {/* Bottom Nav Sync */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 bg-white border border-[#D9C39A]/40 rounded-full shadow-lg shadow-[#3A2618]/5 flex items-center justify-around px-4 z-50">
        <Link href="/app" className="p-3 text-[#3A2618]/30"><Leaf className="size-6" /></Link>
        <Link href="/app/daily-plan" className="p-3 text-[#3A2618]/30 hover:text-[#3A2618]"><Utensils className="size-6" /></Link>
        <button className="size-12 rounded-full bg-[#004D40] text-white flex items-center justify-center shadow-lg shadow-[#004D40]/20 -translate-y-4">
          <Search className="size-6" />
        </button>
        <Link href="/app/progress" className="p-3 text-[#3A2618]/30 hover:text-[#3A2618]"><BarChart2 className="size-6" /></Link>
        <Link href="/app/profile" className="p-3 text-[#3A2618]/30 hover:text-[#3A2618]"><User className="size-6" /></Link>
      </nav>
    </div>
  );
}
