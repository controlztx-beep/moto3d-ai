"use client";

import * as React from "react";

if (typeof window !== 'undefined') {
  document.title = "Analytics | MOTO3D AI";
}
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const viewsOverTime = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  views: 110 + Math.round((Math.sin(i / 3) + 1) * 60) + (i % 5) * 7,
}));

const popularModels = [
  { name: "Ninja ZX-6R", value: 45 },
  { name: "MT-07", value: 32 },
  { name: "R 1250 GS", value: 28 },
  { name: "Africa Twin", value: 22 },
  { name: "390 Duke", value: 18 },
  { name: "Scrambler", value: 12 },
];

const categoryData = [
  { name: "Exhaust", value: 28, color: "#0066FF" },
  { name: "Wheels", value: 22, color: "#00A3FF" },
  { name: "Body", value: 18, color: "#00FF88" },
  { name: "Brakes", value: 12, color: "#3B82F6" },
  { name: "Suspension", value: 10, color: "#22C55E" },
  { name: "Other", value: 10, color: "#64748B" },
];

const geo = [
  { country: "Morocco", pct: 34 },
  { country: "France", pct: 22 },
  { country: "USA", pct: 15 },
  { country: "Germany", pct: 12 },
  { country: "UAE", pct: 8 },
  { country: "Other", pct: 9 },
];

export default function AnalyticsPage() {
  const [range, setRange] = React.useState("7");

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Track engagement and performance of your configurations
          </p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(typeof v === "string" ? v : "7")}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue>
              {range === "7"
                ? "Last 7 days"
                : range === "30"
                  ? "Last 30 days"
                  : range === "90"
                    ? "Last 90 days"
                    : "All time"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Views", value: "1,247" },
          { title: "Unique Visitors", value: "892" },
          { title: "Avg. Time on Config", value: "4m 32s" },
          { title: "Share Rate", value: "8.4%" },
        ].map((s) => (
          <Card key={s.title} className="border border-border">
            <CardHeader className="pb-2">
              <CardDescription>{s.title}</CardDescription>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Daily views trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="day" stroke="#8b8b99" tickLine={false} />
                  <YAxis stroke="#8b8b99" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0b0b12",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#0066FF"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Popular Models</CardTitle>
            <CardDescription>Most configured motorcycles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={popularModels} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis type="number" stroke="#8b8b99" tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#8b8b99"
                    width={90}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0b0b12",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="#0066FF" radius={[6, 6, 6, 6]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Part Categories</CardTitle>
            <CardDescription>What users customize most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: "#0b0b12",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {categoryData.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Top countries by traffic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {geo.map((g) => (
              <div key={g.country} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{g.country}</span>
                  <span className="text-muted-foreground">{g.pct}%</span>
                </div>
                <Progress value={g.pct} />
              </div>
            ))}
            <div className="pt-2 text-xs text-muted-foreground">
              <Badge className="mr-2 border-0 bg-primary/10 text-primary">
                Tip
              </Badge>
              Geo data will be powered by analytics events later.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

