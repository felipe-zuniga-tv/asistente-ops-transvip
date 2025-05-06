import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Define the expected structure for the summary data
export interface TicketSummaryData {
  fleet_id: string;
  date: string; // Date in YYYY-MM-DD format
  approved_count: number;
  rejected_count: number;
}

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_ticket_summary');

  if (error) {
    console.error("Error fetching ticket summary:", error);
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    );
  }

  // Ensure data conforms to the expected type, converting counts to numbers
  const typedData: TicketSummaryData[] = (data || []).map((item: TicketSummaryData) => ({
    fleet_id: item.fleet_id,
    date: item.date, // Already a string in YYYY-MM-DD format from DATE()
    approved_count: Number(item.approved_count ?? 0), // Convert BIGINT from DB to number
    rejected_count: Number(item.rejected_count ?? 0), // Convert BIGINT from DB to number
  }));

  console.log("Ticket summary data from RPC:", typedData);

  return NextResponse.json(typedData);
} 