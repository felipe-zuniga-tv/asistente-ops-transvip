export default function UserDetails({ session } : { session: any }) {
    if (!session) return null

    return (
        <div className="hidden md:block">
            <div className="flex flex-row gap-1 text-black text-sm xl:text-base">
                <span className="font-bold">Usuario:</span>
                <span>{ session.user.full_name }</span>
                <span>({ session.user.email })</span>
            </div>
        </div> 
    )
}