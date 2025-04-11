export const statusMap = {
    pending_review: { label: "Pendiente", variant: "warning", className: "bg-yellow-100 text-black hover:bg-yellow-200 hover:text-black" },
    auto_approved: { label: "Aprobado (Auto)", variant: "success", className: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" },
    auto_rejected: { label: "Rechazado (Auto)", variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800" },
    admin_approved: { label: "Aprobado (Admin)", variant: "success", className: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" },
    admin_rejected: { label: "Rechazado (Admin)", variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800" },
} as const

export type TicketStatus = keyof typeof statusMap; 