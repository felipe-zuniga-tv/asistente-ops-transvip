import { cn } from "@/lib/utils"

export default function SuspenseLoading({ text, className = "" } : {
    text? : string
    className?: string
}) {
    return (
        <div className={cn('min-h-screen flex justify-center items-center animate-pulse text-xl text-white p-16 rounded-md', className)}>
            {text || 'Cargando...'}
        </div>
    )
}
