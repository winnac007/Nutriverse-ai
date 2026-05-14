"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { ArrowLeft, Leaf, Utensils, Search, BarChart2, User, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function Progress() {
  const { user } = useAuth();
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    if (user?.id) {
      api.get("/health/weight").then(r => setWeightHistory(r.data)).catch(() => {});
      api.get("/nutrition/week").then(r => setWeekData(r.data)).catch(() => {});
    }
  }, [user?.id]);

  const mockGlucose = [
    { time: "08:00", val: 90 }, { time: "10:00", val: 110 }, 
    { time: "12:00", val: 105 }, { time: "14:00", val: 125 }, 
    { time: "16:00", val: 100 }, { time: "18:00", val: 115 }
  ];

  const mockEnergy = [
    { day: "M", val: 6 }, { day: "T", val: 8 }, { day: "W", val: 7 },
    { day: "T", val: 9 }, { day: "F", val: 8 }, { day: "S", val: 10 }, { day: "S", val: 9 }
  ];

  return (
    <div className="bg-[#FAF3E6] min-h-screen pb-32 pt-6">
      <div className="px-6">
        {/* Header - Image 7 */}
        <header className="flex items-center gap-4 mb-8">
          <Link href="/app" className="text-[#3A2618]"><ArrowLeft className="size-5" /></Link>
          <h1 className="font-serif text-2xl text-[#3A2618]">Your Progress</h1>
        </header>

        {/* Tabs - Image 7 */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {["Overview", "Nutrition", "Habits", "Snacks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? "bg-[#004D40] text-white" 
                  : "bg-transparent text-[#3A2618]/40 hover:text-[#3A2618]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Glucose Stability - Image 7 */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#D9C39A]/40 rounded-[2rem] p-6 shadow-sm"
          >
            <h2 className="font-serif text-lg text-[#3A2618] mb-6">Glucose Stability</h2>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockGlucose}>
                  <Line type="monotone" dataKey="val" stroke="#004D40" strokeWidth={3} dot={{ r: 4, fill: "#004D40", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#3A2618]/30 mt-4">
              <span>Stable</span>
              <span className="text-[#004D40]">Excellent</span>
            </div>
          </motion.section>

          {/* Energy Levels - Image 7 */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white border border-[#D9C39A]/40 rounded-[2rem] p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-lg text-[#3A2618]">Energy Levels</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-[#004D40]">Good</span>
            </div>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockEnergy}>
                  <Bar dataKey="val" radius={[4, 4, 4, 4]} barSize={12}>
                    {mockEnergy.map((entry, index) => (
                      <Cell key={index} fill={entry.val >= 8 ? "#004D40" : "#004D4040"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          {/* Mindful Eating - Image 7 */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white border border-[#D9C39A]/40 rounded-[2rem] p-6 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Circle className="size-5 text-[#004D40]" strokeWidth={3} />
              <h2 className="font-serif text-lg text-[#3A2618]">Mindful Eating</h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3A2618]/40">On Track</span>
          </motion.section>
        </div>
      </div>

      {/* Bottom Nav Sync */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 bg-white border border-[#D9C39A]/40 rounded-full shadow-lg shadow-[#3A2618]/5 flex items-center justify-around px-4 z-50">
        <Link href="/app" className="p-3 text-[#3A2618]/30"><Leaf className="size-6" /></Link>
        <Link href="/app/daily-plan" className="p-3 text-[#3A2618]/30 hover:text-[#3A2618]"><Utensils className="size-6" /></Link>
        <button className="size-12 rounded-full bg-[#004D40] text-white flex items-center justify-center shadow-lg shadow-[#004D40]/20 -translate-y-4">
          <Search className="size-6" />
        </button>
        <Link href="/app/progress" className="p-3 text-[#004D40]"><BarChart2 className="size-6" /></Link>
        <Link href="/app/profile" className="p-3 text-[#3A2618]/30 hover:text-[#3A2618]"><User className="size-6" /></Link>
      </nav>
    </div>
  );
}
