import React from "react"

export const metadata = {
    title: "Administración | Transvip",
    description: "Panel de administración de Transvip",
};

export const revalidate = 60

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
} 