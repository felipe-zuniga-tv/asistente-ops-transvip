import { createClient } from "@/lib/supabase/server"; // Assuming server setup is here
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient(); // Create server client

  try {
    // Call the PostgreSQL function
    const { data, error: rpcError } = await supabase.rpc(
      "get_daily_response_stats"
    );

    if (rpcError) {
      console.error("Error fetching daily response stats:", rpcError);
      // Throwing the error to be caught below
      throw new Error(rpcError.message || "Failed to fetch daily stats");
    }
    
    // Format the date for better display
    const formattedData = (data as any[]).map((item) => ({
      ...item,
      // Example formatting: Keep only date part if it includes time
      response_date: new Date(item.response_date).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
      }),
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: `Error interno del servidor: ${error.message}` },
      { status: 500 }
    );
  }
} 