"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type NutritionDay = {
  date: string;
  calories: number;
};

const dayLabel = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });

export default function NutritionWeekChart({ data }: { data: NutritionDay[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 2, bottom: 0, left: -24 }}>
        <CartesianGrid stroke="#e5ddcf" vertical={false} />
        <XAxis dataKey="date" tickFormatter={dayLabel} stroke="#8a9487" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#8a9487" fontSize={9} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "#fffcf5", border: "1px solid #dcd2c2", borderRadius: 12, fontSize: 11 }}
          cursor={{ fill: "rgba(93, 118, 88, 0.06)" }}
        />
        <Bar dataKey="calories" name="Calories" fill="#60785a" radius={[7, 7, 2, 2]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
