import { Suspense } from "react";
import { notFound } from "next/navigation";
import { InspectionsList } from "@/components/vehicle/inspection/inspections-list";
import { getVehicleInspections } from "@/lib/services/vehicle/inspection";
import { getInspectionForms } from "@/lib/services/vehicle/inspection-forms";
import SuspenseLoading from "@/components/ui/suspense";

interface InspectionsPageProps {
    searchParams: {
        vehicle?: string;
    };
}

export const metadata = {
    title: "Inspecciones de Vehículo | Transvip",
    description: "Lista de inspecciones de vehículos",
};

export default async function InspectionsPage({ searchParams }: InspectionsPageProps) {
    if (!searchParams.vehicle) {
        return notFound();
    }

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <InspectionsContainer vehicleNumber={parseInt(searchParams.vehicle)} />
        </Suspense>
    );
}

async function InspectionsContainer({ vehicleNumber }: { vehicleNumber: number }) {
    const [inspections, forms] = await Promise.all([
        getVehicleInspections(vehicleNumber),
        getInspectionForms(),
    ]);

    // Filter out forms that are not active or already have a completed inspection
    const availableForms = forms.filter(
        (form) =>
            form.is_active &&
            !inspections.some(
                (inspection) =>
                    inspection.form_id === form.id && inspection.status === "completed"
            )
    );

    return (
        <InspectionsList
            vehicleNumber={vehicleNumber}
            inspections={inspections}
            availableForms={availableForms}
        />
    );
} 