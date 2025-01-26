import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Administración | Transvip",
    description: "Panel de administración de Transvip",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto py-6">
            {children}
        </div>
    );
} 