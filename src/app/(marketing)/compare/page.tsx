"use client";

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";

interface Motorcycle {
  id: string;
  brand: string;
  name: string;
  category: string;
  base_price: number;
  engine_cc?: number;
  power_hp?: number;
  torque_nm?: number;
  weight_kg?: number;
  top_speed_kmh?: number;
  fuel_capacity_l?: number;
  seat_height_mm?: number;
}

export default function ComparePage() {
  const [motorcycles, setMotorcycles] = React.useState<Motorcycle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [bike1Id, setBike1Id] = React.useState<string>("");
  const [bike2Id, setBike2Id] = React.useState<string>("");

  React.useEffect(() => {
    async function loadMotorcycles() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("motorcycles")
          .select("*")
          .order("brand", { ascending: true });

        if (error) throw error;
        const bikes = (data as Motorcycle[]) || [];
        setMotorcycles(bikes);
        
        // Auto-select first two motorcycles
        if (bikes.length >= 2) {
          setBike1Id(bikes[0].id);
          setBike2Id(bikes[1].id);
        }
      } catch (error) {
        console.error("Error loading motorcycles:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadMotorcycles();
  }, []);

  const bike1 = motorcycles.find((m) => m.id === bike1Id);
  const bike2 = motorcycles.find((m) => m.id === bike2Id);

  const compareRows = [
    { label: "Brand", key: "brand", type: "text" },
    { label: "Category", key: "category", type: "text" },
    { label: "Engine", key: "engine_cc", type: "number", unit: "cc", higher: true },
    { label: "Power", key: "power_hp", type: "number", unit: "hp", higher: true },
    { label: "Torque", key: "torque_nm", type: "number", unit: "Nm", higher: true },
    { label: "Weight", key: "weight_kg", type: "number", unit: "kg", higher: false },
    { label: "Top Speed", key: "top_speed_kmh", type: "number", unit: "km/h", higher: true },
    { label: "Fuel Capacity", key: "fuel_capacity_l", type: "number", unit: "L", higher: true },
    { label: "Seat Height", key: "seat_height_mm", type: "number", unit: "mm", higher: false },
    { label: "Base Price", key: "base_price", type: "price", unit: "$", higher: false },
  ];

  const getBetterValue = (row: typeof compareRows[0], val1: number | string | undefined, val2: number | string | undefined) => {
    if (row.type === "text") return null;
    if (val1 == null || val2 == null) return null;
    if (row.higher) {
      return val1 > val2 ? "bike1" : val2 > val1 ? "bike2" : null;
    } else {
      return val1 < val2 ? "bike1" : val2 < val1 ? "bike2" : null;
    }
  };

  const formatValue = (row: typeof compareRows[0], value: number | string | undefined) => {
    if (value == null) return "—";
    if (row.type === "price") {
      return `$${value.toLocaleString()}`;
    }
    return `${value}${row.unit ? ` ${row.unit}` : ""}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge className="mb-4 border-red-500/30 bg-red-500/15 text-red-500">
            COMPARISON TOOL
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Compare Motorcycles
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-400">
            Find the perfect bike by comparing specifications side by side
          </p>
        </div>

        {/* Motorcycle Selectors */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-400">
              Motorcycle 1
            </label>
            <Select value={bike1Id} onValueChange={(value) => setBike1Id(value as string)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a motorcycle" />
              </SelectTrigger>
              <SelectContent>
                {motorcycles.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.brand} {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-400">
              Motorcycle 2
            </label>
            <Select value={bike2Id} onValueChange={(value) => setBike2Id(value as string)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a motorcycle" />
              </SelectTrigger>
              <SelectContent>
                {motorcycles.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.brand} {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comparison Table */}
        {bike1 && bike2 && (
          <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="p-4 text-left text-sm font-medium text-neutral-400">
                    Specification
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-lg font-bold text-white">
                      {bike1.brand} {bike1.name}
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-lg font-bold text-white">
                      {bike2.brand} {bike2.name}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, idx) => {
                  const val1 = bike1[row.key as keyof Motorcycle];
                  const val2 = bike2[row.key as keyof Motorcycle];
                  const better = getBetterValue(row, val1, val2);

                  return (
                    <tr
                      key={row.key}
                      className={idx % 2 === 0 ? "bg-neutral-900/30" : ""}
                    >
                      <td className="p-4 text-sm font-medium text-neutral-400">
                        {row.label}
                      </td>
                      <td
                        className={`p-4 text-center ${
                          better === "bike1"
                            ? "font-bold text-green-500"
                            : "text-white"
                        }`}
                      >
                        {formatValue(row, val1)}
                      </td>
                      <td
                        className={`p-4 text-center ${
                          better === "bike2"
                            ? "font-bold text-green-500"
                            : "text-white"
                        }`}
                      >
                        {formatValue(row, val2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Price Difference */}
            <div className="border-t border-neutral-800 bg-neutral-900/50 p-4">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-sm text-neutral-400">Price Difference</div>
                  <div className="text-2xl font-bold text-red-500">
                    ${Math.abs(bike1.base_price - bike2.base_price).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 border-t border-neutral-800 p-6 md:grid-cols-2">
              <div className="text-center">
                <Link href={`/configurator?motorcycle=${bike1.id}`}>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Configure {bike1.brand} {bike1.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <Link href={`/configurator?motorcycle=${bike2.id}`}>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Configure {bike2.brand} {bike2.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
