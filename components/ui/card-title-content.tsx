import { TransvipLogo } from "@/components/transvip/transvip-logo";

export function CardTitleContent({ title }: { title: string }) {
    return (
        <div className="flex flex-row items-center gap-2">
            <TransvipLogo size={20} />
            <span>{ title || 'Transvip'}</span>
        </div>
    )
}