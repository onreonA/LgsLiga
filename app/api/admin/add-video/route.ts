import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b256c2duY2x5Znp6a3B5c2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUzMzU4MCwiZXhwIjoyMDc1MTA5NTgwfQ.rilmC2SF_ODfoCkMWd-ep38dMlEy2TJ0A94y32w0Xvo"; // Service role key

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, title, video_id, description } = body;

    // Service role ile Supabase client (RLS bypass)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Direkt insert (RLS bypass)
    const { data, error } = await supabase
      .from("daily_videos")
      .insert({
        date,
        title,
        video_id,
        description,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: "Video başarıyla eklendi!",
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
