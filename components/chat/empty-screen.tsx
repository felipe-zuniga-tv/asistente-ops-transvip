import { TransvipLogo } from "../transvip/transvip-logo";

export function EmptyScreen({ session }: { session: any }) {
    return (
        <div className="messages-list">
            <div className="chat-message assistant">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col lg:flex-row gap-1">
                        <span className="font-semibold">¡Hola, {session.user.full_name}!</span>
                        <span className="font-normal">Soy Jarvip, tu asistente.</span>
                    </div>
                    <span className="mt-2 font-bold">¿Con qué puedo ayudarte hoy?</span>
                </div>
                <div className="flex flex-row gap-2 justify-end items-center text-xs">
                    <TransvipLogo logoOnly={true} colored={false} size={20} />
                </div>
            </div>
        </div>
    )
}