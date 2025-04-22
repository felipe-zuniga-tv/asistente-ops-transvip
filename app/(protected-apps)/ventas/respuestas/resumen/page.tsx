"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui"
import { Skeleton } from "@/components/ui/skeleton"

// Define the expected structure of the data returned by the API
interface DailyStat {
  response_date: string; // API returns formatted date
  response_count: number; // Assuming the API returns 'response_count'
}

const chartConfig = {
  responses: {
    label: "Respuestas",
  },
  de_de_responses: {
    label: "DE (de)",
    color: "hsl(var(--chart-1))", // Example color
  },
  en_us_responses: {
    label: "EN (us)",
    color: "hsl(var(--chart-2))", // Example color
  },
  es_cl_responses: {
    label: "ES (cl)",
    color: "hsl(var(--chart-3))", // Example color
  },
  pt_br_responses: {
    label: "PT (br)",
    color: "hsl(var(--chart-4))", // Example color
  },
} satisfies ChartConfig

export default function ResumenPage() {
  const [chartData, setChartData] = useState<DailyStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDailyStats() {
      try {
        setIsLoading(true)
        setError(null)
        // Fetch data from the API route
        const response = await fetch("/api/ventas/respuestas/resumen")

        if (!response.ok) {
          // Attempt to read error message from response body
          let errorMessage = `Error HTTP: ${response.status}`
          try {
            const errorData = await response.json()
            if (errorData && errorData.error) {
              errorMessage = errorData.error
            }
          } catch (jsonError) {
            // Ignore if response body is not valid JSON
            console.error("Failed to parse error response JSON:", jsonError)
          }
          throw new Error(errorMessage)
        }

        const data: DailyStat[] = await response.json()

        console.log("data from API", data)

        // Data is already formatted by the API route
        setChartData(data || [])
      } catch (err: any) {
        setError(`Error al cargar estadísticas: ${err.message}`)
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDailyStats()
  }, []) // Removed supabase from dependencies

  return (
    <Card className="w-full max-w-full mx-auto">
      <CardHeader>
        <CardTitle>Resumen Diario de Respuestas</CardTitle>
        <CardDescription>
          Número de respuestas recibidas por día (últimos días)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : chartData.length === 0 ? (
          <p className="text-center text-muted-foreground">No hay datos para mostrar.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <Legend />
              <XAxis
                dataKey="creation_date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="de_de_responses"
                fill="var(--color-de_de_responses)"
                stackId="a"
              >
                {/* Optional: Keep LabelList if needed per bar, or remove if Legend is sufficient */}
                {/* <LabelList
                  position="top"
                  offset={5}
                  className="fill-foreground"
                  fontSize={12}
                /> */}
              </Bar>
              <Bar
                dataKey="en_us_responses"
                fill="var(--color-en_us_responses)"
                stackId="a"
              >
                {/* <LabelList
                  position="top"
                  offset={5}
                  className="fill-foreground"
                  fontSize={12}
                /> */}
              </Bar>
              <Bar
                dataKey="es_cl_responses"
                fill="var(--color-es_cl_responses)"
                stackId="a"
              >
                {/* <LabelList
                  position="top"
                  offset={5}
                  className="fill-foreground"
                  fontSize={12}
                /> */}
              </Bar>
              <Bar
                dataKey="pt_br_responses"
                fill="var(--color-pt_br_responses)"
                stackId="a"
              >
                {/* <LabelList
                  position="top"
                  offset={5}
                  className="fill-foreground"
                  fontSize={12}
                /> */}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* Example Footer - adjust as needed */}
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Mostrando el total de respuestas diarias.
        </div>
      </CardFooter>
    </Card>
  )
}
