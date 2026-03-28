import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// SQL to create dedicated quotes table (optional - run in Supabase SQL editor):
// CREATE TABLE public.quotes (
//   id uuid default uuid_generate_v4() primary key,
//   name text not null,
//   email text not null,
//   phone text,
//   city text,
//   contact_method text default 'email',
//   message text,
//   trade_in boolean default false,
//   trade_in_details text,
//   configuration_id uuid references public.configurations(id),
//   motorcycle_name text,
//   total_price decimal(10,2),
//   config_data jsonb default '{}',
//   status text default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
//   created_at timestamptz default now()
// );
// ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Anyone can insert quotes" ON public.quotes FOR INSERT WITH CHECK (true);
// CREATE POLICY "Auth users can view quotes" ON public.quotes FOR SELECT USING (auth.uid() IS NOT NULL);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      city,
      contactMethod,
      message,
      tradeIn,
      tradeInDetails,
      configurationId,
      motorcycleName,
      totalPrice,
      configData,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Store quote request in analytics_events table
    // This allows us to track quotes without creating a new table
    const { error } = await supabase.from("analytics_events").insert({
      event_type: "inquiry",
      event_data: {
        name,
        email,
        phone,
        city,
        contactMethod,
        message,
        tradeIn,
        tradeInDetails,
        configurationId,
        motorcycleName,
        totalPrice,
        configData,
        status: "new",
      },
    });

    if (error) {
      console.error("Error inserting quote request:", error);
      return NextResponse.json(
        { error: "Failed to submit quote request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quote request submitted successfully",
    });
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
