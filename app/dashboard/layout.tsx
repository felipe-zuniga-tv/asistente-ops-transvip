"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, LogOut, Settings, User, Bell, SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import SystemTools from "@/components/chat/panel/tools"
import UserDetails from "@/components/ui/navigation/user-details"
import LogoutButton from "@/components/auth/logout"
import NavbarLayout from "@/components/ui/navigation/layout-navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return (
        <div className="flex flex-col h-screen">
            {/* Top Navbar */}
            <header className="bg-white text-slate-900 p-4 flex justify-between items-center">
                <div className="flex flex-row gap-2 items-center text-xl font-semibold mr-4">
                    <TransvipLogo logoOnly={true} colored={true} size={18} className="rounded-lg p-2 w-8 bg-transvip" />
                    <span className="hidden lg:block">Operaciones</span>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" className="relative h-8 w-8 rounded-full text-slate-900">
                                <Avatar className="shadow-md">
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                                    <AvatarFallback>FZ</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Felipe Zúñiga</p>
                                    <p className="text-xs leading-none text-muted-foreground">felipe.zuniga@transvip.cl</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className={cn('bg-secondary text-secondary-foreground',
                    isSidebarOpen ? "w-1/5" : "w-16",
                    'transition-all duration-300 ease-in-out flex flex-col')}>
                    <Button variant="ghost" className="self-end p-2 m-2" onClick={toggleSidebar}>
                        {isSidebarOpen ? 
                            (<ChevronLeft className="h-6 w-6" />) :
                            (<ChevronRight className="h-6 w-6" />)
                        }
                    </Button>
                    { isSidebarOpen && (
                        <nav className="flex-1 px-4 space-y-2">
                            <h2 className="text-lg font-semibold mb-4">Herramientas</h2>
                            <Button variant="ghost" className="w-full justify-start">
                                Dashboard
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                Analytics
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                Reports
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                Settings
                            </Button>
                        </nav>
                    )}
                </aside>

                {/* Content area */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}