import Link from "next/link"
import { Menu } from "lucide-react"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { HeaderLinks } from "@/utils/routes"
import { Button } from "../button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LogoutButton from "@/components/auth/logout"

export default function SheetNavigation() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-600 text-white">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                        <TransvipLogo colored={false} size={120} />
                        <span className="sr-only">Transvip</span>
                    </Link>
                    { HeaderLinks.map((item, index) => 
                        <Link key={`${item.label}_${index + 1}`}
                            href={item.href}
                            className={index === 0 ? 'text-white underline hover:text-foreground' : 'text-white'}>
                            {item.label}
                        </Link>
                    )}
                    <LogoutButton />
                </nav>
            </SheetContent>
        </Sheet>
    )
}