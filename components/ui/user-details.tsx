import { getSession } from "@/lib/core/auth"
import { Session } from '@/lib/core/types/chat'

export default async function UserDetails() {
    const session = (await getSession()) as Session | null; // Define the session type

    if (!session) return null;

    return (
        <div className="flex flex-row items-center gap-1 text-black text-sm">
            <span className="font-bold">Usuario:</span>
            <span>{session.user.full_name}</span>
            <span className="hidden md:block">({session.user.email})</span>
        </div>
    );
}