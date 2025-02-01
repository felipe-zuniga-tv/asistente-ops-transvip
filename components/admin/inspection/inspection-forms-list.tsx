"use client";

import { useState } from "react";
import { InspectionForm } from "@/lib/types/vehicle/inspection";
import { InspectionFormDialog } from "./inspection-form-dialog";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dates";
import { ConfigCardContainer } from "@/components/tables/config-card-container";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface InspectionFormsListProps {
    data: InspectionForm[];
}

export function InspectionFormsList({ data }: InspectionFormsListProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleView = (formId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/admin/inspection-config/${formId}`);
    };

    return (
        <>
            <ConfigCardContainer
                title="Formularios Transvip"
                onAdd={() => setOpen(true)}
            >
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                                <TableHead className="text-center">Fecha de Creación</TableHead>
                                <TableHead className="w-[100px] text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((form) => (
                                <TableRow
                                    key={form.id}
                                    className="cursor-pointer hover:bg-gray-50 text-xs"

                                >
                                    <TableCell>{form.title}</TableCell>
                                    <TableCell>{form.description}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={form.is_active ? "default" : "secondary"} className={form.is_active ? "bg-green-500" : "bg-red-500"}>
                                            {form.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{formatDate(form.created_at)}</TableCell>
                                    <TableCell className="flex justify-center">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={(e) => handleView(form.id, e)}
                                            className="h-8 w-8"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ConfigCardContainer>

            <InspectionFormDialog
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
} 