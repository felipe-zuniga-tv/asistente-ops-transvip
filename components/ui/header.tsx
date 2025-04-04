import LogoutButton from "@/components/auth/logout";
import { cn } from '@/lib/utils/ui';
import UserDetails from "./user-details";

export default async function Header({ className = "", children }: { className?: string, children? : React.ReactNode }) {
    return (
        <header className={cn("sticky top-0 z-40 flex h-[56px] items-center justify-between gap-1 bg-background px-2 pl-1", className)}>
            <div>{ children }</div>
            <div className="ml-auto flex gap-4 items-center">
                <UserDetails />
                <LogoutButton />
            </div>
        </header>
    )
}