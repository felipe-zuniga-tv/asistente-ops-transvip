import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TicketResults({ results }: { results: string[] }) {
    if (results.length === 0) return

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>{result}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}