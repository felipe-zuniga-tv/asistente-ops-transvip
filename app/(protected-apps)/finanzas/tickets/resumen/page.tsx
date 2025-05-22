"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    Skeleton,
    Button,
} from "@/components/ui";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend as RechartsLegend } from "recharts";
import { TrendingUp, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

// Define the expected structure of the data returned by the API
interface TicketSummaryStat {
	fleet_id: string | number; // Adjust type based on your fleet_id
	approved_count: number;
	rejected_count: number;
}

const chartConfig = {
	approved: {
		label: "Aprobados",
		color: "hsl(var(--chart-2))", // Greenish
	},
	rejected: {
		label: "Rechazados",
		color: "hsl(var(--chart-1))", // Reddish
	},
} satisfies ChartConfig;

export default function ResumenTicketsPage() {
	const [chartData, setChartData] = useState<TicketSummaryStat[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Extract fetch logic into a reusable function
	async function fetchTicketSummary() {
		try {
			setIsLoading(true);
			setError(null);
			// Fetch data from the API route (needs to be created)
			const response = await fetch("/api/finanzas/tickets/resumen");

			if (!response.ok) {
				let errorMessage = `Error HTTP: ${response.status}`;
				try {
					const errorData = await response.json();
					if (errorData && errorData.error) {
						errorMessage = errorData.error;
					}
				} catch (jsonError) {
					console.error("Failed to parse error response JSON:", jsonError);
				}
				throw new Error(errorMessage);
			}

			const data: TicketSummaryStat[] = await response.json();

			console.log("Ticket summary data from API:", data);

			setChartData(data || []);
		} catch (err: any) {
			setError(`Error al cargar resumen de tickets: ${err.message}`);
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchTicketSummary(); // Call the function on initial load
	}, []); // Empty dependency array means this runs once on mount

	return (
		<Card className="w-full max-w-full mx-auto">
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							Resumen de Tickets por Flota (Aprobados/Rechazados)
							<TrendingUp className="inline-block h-4 w-4" />
						</div>
						<Button
							variant="outline"
							size="icon"
							onClick={fetchTicketSummary}
							disabled={isLoading}
							aria-label="Recargar datos"
						>
							<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
						</Button>
					</div>
				</CardTitle>
				<CardDescription>
					Número de tickets aprobados y rechazados agrupados por flota.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{ isLoading ? (
					<Skeleton className="h-[350px] w-full" />
				) : error ? (
					<div className="text-red-600">{error}</div>
				) : chartData.length === 0 ? (
					<p className="text-center text-muted-foreground">No hay datos para mostrar.</p>
				) : (
					<ChartContainer config={chartConfig} className="h-[360px] w-full">
						<BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 15 }}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="fleet_id"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								stroke="#888888"
								fontSize={12}
								label={{ value: "Flota", position: 'insideBottom', offset: -10, dy: 10, fill:"#888888", fontSize: 12 }} // Add X-axis label
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickMargin={10}
								label={{ value: 'Cantidad Tickets', angle: -90, position: 'insideLeft', offset: 10, fill:"#888888", fontSize: 12 }} // Add Y-axis label
							/>
							<ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
							<RechartsLegend verticalAlign="top" align="right" />
							<Bar dataKey="approved_count" name={chartConfig.approved.label} fill="var(--color-approved)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="rejected_count" name={chartConfig.rejected.label} fill="var(--color-rejected)" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
