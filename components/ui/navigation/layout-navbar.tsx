import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../drawer"
import { Button } from "../button"
import { SettingsIcon } from "lucide-react"
import SystemTools from "@/components/chat/panel/tools"
import UserDetails from "./user-details"
import LogoutButton from "@/components/auth/logout"

export default async function NavbarLayout() {
    return (
        <header className="sticky top-0 z-10 flex h-[56px] items-center gap-1 bg-background p-4">
            <div className="flex flex-row gap-2 items-center text-xl font-semibold mr-4">
                <TransvipLogo logoOnly={true} colored={true} size={18} className="rounded-lg p-2 w-8 bg-transvip" />
                <span className="hidden lg:block">Operaciones</span>
            </div>
            <Drawer>
                <DrawerTrigger asChild className="block xs:hidden">
                    <Button variant="outline" size="icon" className="lg:hidden w-12 bg-slate-800 hover:bg-slate-700">
                        <SettingsIcon className="size-4 text-white" />
                        <span className="sr-only">Herramientas</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80vh]">
                    <DrawerHeader>
                        <DrawerTitle><span>Herramientas</span></DrawerTitle>
                    </DrawerHeader>
                    <div className="grid w-full items-start gap-4 border p-4 rounded-xl">
                        <SystemTools session={null} />
                    </div>
                </DrawerContent>
            </Drawer>
            <div className="ml-auto flex gap-4 items-center">
                <UserDetails />
                <LogoutButton className="ml-auto" />
            </div>
        </header>
    )
}