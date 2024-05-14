import { TransvipLogo } from "@/components/transvip/transvip-logo";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/navigation/header";
import Navbar from "@/components/ui/navigation/navbar";
import { Bell } from "lucide-react";

export default function DashboardLayout({ children }) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden md:block">
                <div className="flex h-full min-h-screen flex-col gap-4 bg-gray-200">
                    <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-transvip">
                        <TransvipLogo colored={false} size={100} />
                        <Button variant="outline" size="icon" className=" ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </div>
                    <div className="flex-1 sticky">
                        <Navbar />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}