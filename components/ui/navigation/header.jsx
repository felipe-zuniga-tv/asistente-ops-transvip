import { getSession } from "@/lib/auth";
import LogoutButton from "../../auth/logout";
import SheetNavigation from "./sheet";
import UserDetails from "./user-details";

export default async function Header() {
    const session = await getSession();

    return (
        <header className="bg-slate-700 sticky z-10 top-0 h-16 lg:h-[60px] flex items-center justify-between md:justify-end gap-4 border-0 px-4 md:px-6">
            <SheetNavigation />
            <UserDetails session={session} />
            <LogoutButton className="justify-self-end" />
        </header>
    )
}