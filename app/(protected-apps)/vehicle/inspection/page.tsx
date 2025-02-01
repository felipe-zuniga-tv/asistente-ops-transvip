import { Suspense } from "react";
import { notFound } from "next/navigation";
import { InspectionForm } from "@/components/vehicle/inspection/inspection-form";
import { getInspectionForm } from "@/lib/services/vehicle/inspection-forms";
import { createInspection } from "@/lib/services/vehicle/inspection";
import SuspenseLoading from "@/components/ui/suspense";

interface InspectionPageProps {
    searchParams: {
        vehicle?: string;
        form?: string;
    };
}

export const metadata = {
    title: "Inspección de Vehículo | Transvip",
    description: "Realiza una inspección de vehículo en Transvip",
};

export default async function InspectionPage({ searchParams }: InspectionPageProps) {
    if (!searchParams.vehicle || !searchParams.form) {
        return notFound();
    }

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <InspectionContainer
                vehicleNumber={parseInt(searchParams.vehicle)}
                formId={searchParams.form}
            />
        </Suspense>
    );
}

async function InspectionContainer({ vehicleNumber, formId }: { vehicleNumber: number; formId: string }) {
    const form = await getInspectionForm(formId);
    if (!form) return notFound();

    // Create a new inspection
    const inspection = await createInspection({
        vehicle_number: vehicleNumber,
        form_id: formId,
    });

    // Transform answers array into a record for easier access
    const answers = form.sections.reduce<Record<string, { id?: string; value: string }>>((acc, section) => {
        section.questions.forEach((question) => {
            acc[question.id] = { value: "" };
        });
        return acc;
    }, {});

    return (
        <InspectionForm
            inspectionId={inspection.id}
            sections={form.sections}
            answers={answers}
        />
    );
} 