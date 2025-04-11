import { cn } from '@/utils/ui'

export default function SuspenseLoading({ text, className = "" } : {
    text? : string
    className?: string
}) {
    return (
        <div className={cn('top-1/2 h-[400px] flex flex-col gap-3 justify-center items-center p-16 rounded-md', className)}>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
            <p className="text-lg text-black">{text || 'Cargando...'}</p>
        </div>
    )
}
