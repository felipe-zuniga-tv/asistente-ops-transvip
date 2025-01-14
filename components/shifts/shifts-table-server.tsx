import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from 'react'
import SuspenseLoading from "../ui/suspense";
import { ShiftsTableContent } from "./shifts-table-content";

interface Shift {
	id: number;
	created_timestamp: string;
	start_time: string;
	end_time: string;
	user_id: string;
	status: string;
	// Add other shift fields as needed
}

export async function ShiftsTable() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	const { data: shifts, error } = await supabase
		.from('shifts')
		.select(`*`)
		.order('created_timestamp', { ascending: false })
		.returns<Shift[]>();

	if (error) {
		// Handle error appropriately, e.g., log it or return a fallback UI
		return <div>No se pudo obtener los turnos</div>;
	}

	return (
		<div className="rounded-md border">
			<Suspense fallback={<SuspenseLoading />}>
				<ShiftsTableContent shifts={shifts} />
			</Suspense>
		</div>
	);
}