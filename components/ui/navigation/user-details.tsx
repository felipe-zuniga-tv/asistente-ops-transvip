import { getSession } from "@/lib/auth";

export default async function UserDetails() {
    const session = await getSession() as any;

    if (!session) return null

    return (
        <div className="hidden md:block">
            <div className="flex flex-row gap-1 text-black text-xs xl:text-base">
                <span className="font-bold">Usuario:</span>
                <span>{ session.user.full_name }</span>
                <span className="hidden lg:block">({ session.user.email })</span>
            </div>
        </div> 
    )
}