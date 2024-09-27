import { cn } from "@/lib/utils";
import { TransvipLogo } from "@/components/transvip/transvip-logo";
import { QrCodeIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Routes } from "@/utils/routes";

export default function SidebarOptions({ className }) {
  return (
    <aside className={
      cn("hidden inset-y fixed left-0 z-20 xs:flex h-full flex-col border-r bg-transvip/80",
        className
      )}>
      <div className="p-2 h-[56px] flex items-center">
        <TransvipLogo logoOnly={true} size={30} />
      </div>
      <nav className="grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={Routes.QR_GEN} className="w-full">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-muted"
                aria-label="Generar QR"
              >
                <QrCodeIcon className="size-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Generar Código QR
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  )
}