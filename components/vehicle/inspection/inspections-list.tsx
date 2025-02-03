"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { OperationsFormResponses, OperationsForm } from "@/lib/types/vehicle/forms";
import { formatDate } from "@/utils/dates";

interface InspectionsListProps {
    vehicleNumber: number;
    inspections: (OperationsFormResponses & { form: OperationsForm })[];
    availableForms: OperationsForm[];
}

export function InspectionsList({ vehicleNumber, inspections, availableForms }: InspectionsListProps) {
    const router = useRouter();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Inspecciones</h2>
                <div className="flex gap-2">
                    {availableForms.map((form) => (
                        <Button
                            key={form.id}
                            onClick={() =>
                                router.push(
                                    `/vehicle/inspection?vehicle=${vehicleNumber}&form=${form.id}`
                                )
                            }
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            {form.title}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inspections.map((inspection) => (
                    <Card key={inspection.id}>
                        <CardHeader>
                            <CardTitle>{inspection.form.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`h-2 w-2 rounded-full ${
                                            inspection.status === "completed"
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                        }`}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        {inspection.status === "completed"
                                            ? "Completada"
                                            : "En progreso"}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {formatDate(inspection.created_at)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 