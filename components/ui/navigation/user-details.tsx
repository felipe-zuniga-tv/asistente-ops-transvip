import { getSession } from "@/lib/auth"
import { Session } from '@/lib/types/chat'

export default async function UserDetails() {
    const session = (await getSession()) as Session | null; // Define the session type

    if (!session) return null;

    return (
        <div className="hidden md:block">
            <div className="flex flex-row gap-1 text-black text-xs xl:text-base">
                <span className="font-bold">Usuario:</span>
                <span>{session.user.fullName}</span>
                <span className="hidden lg:block">({session.user.email})</span>
            </div>
        </div>
    );
}