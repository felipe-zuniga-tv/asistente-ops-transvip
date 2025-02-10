"use client";

import { useState, useTransition } from "react";
import { OperationsForm } from "@/lib/types/vehicle/forms";
import { OperationsFormDialog } from "./dialogs/operations-form-dialog";
import { useRouter } from "next/navigation";
import { ConfigCardContainer } from "@/components/tables/config-card-container";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./form-table/columns";
import { updateOperationsForm } from "@/lib/services/forms";
import { useToast } from "@/hooks/use-toast";
import { OperationsFormEditDialog } from "./dialogs/operations-form-edit-dialog";

interface OperationsFormsListProps {
    data: OperationsForm[];
}

export function OperationsFormsConfiguration({ data }: OperationsFormsListProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingForm, setEditingForm] = useState<OperationsForm | null>(null);

    const handleView = (formId: string) => {
        router.push(`/forms/config/${formId}`);
    };

    const handleToggleStatus = async (form: OperationsForm) => {
        startTransition(async () => {
            try {
                await updateOperationsForm(form.id, {
                    is_active: !form.is_active
                });
                toast({
                    title: "Estado actualizado",
                    description: `El formulario ha sido ${form.is_active ? 'desactivado' : 'activado'} exitosamente.`,
                });
                router.refresh();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Ha ocurrido un error al actualizar el estado del formulario.",
                    variant: "destructive",
                });
            }
        });
    };

    const handleEdit = (form: OperationsForm) => {
        setEditingForm(form);
        setIsEditOpen(true);
    };

    const filterOptions = [
        {
            columnId: "is_active",
            options: [
                { label: "Activo", value: "true" },
                { label: "Inactivo", value: "false" },
            ],
            placeholder: "Filtrar por estado",
        },
    ];

    return (
        <ConfigCardContainer title="Formularios Transvip"
            onAdd={() => setOpen(true)}
            className="max-w-full"
        >
            <DataTable
                data={data}
                columns={columns({ handleView, onToggleStatus: handleToggleStatus, onEdit: handleEdit })}
                searchPlaceholder="Buscar formulario..."
                searchColumnId="title"
                filterOptions={filterOptions}
                enableSearch={true}
            />

            <OperationsFormDialog
                open={open}
                onOpenChange={setOpen}
            />

            {isEditOpen && editingForm && (
                <OperationsFormEditDialog
                    editingForm={editingForm}
                    onClose={() => { setIsEditOpen(false); setEditingForm(null); }}
                    onEditSuccess={() => router.refresh()}
                />
            )}
        </ConfigCardContainer>
    );
} 