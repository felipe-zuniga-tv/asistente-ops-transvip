import { cn } from "@/lib/utils";
import { TransvipLogo } from "@/components/transvip/transvip-logo";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { SquareTerminal } from "lucide-react";

export default function SidebarOptions({ className }) {
  return (
    <aside className={
      cn("hidden inset-y fixed left-0 z-20 xs:flex h-full flex-col border-r bg-transvip/80",
        className
      )}>
      <div className="p-2 h-[56px] flex items-center">
        <TransvipLogo logoOnly={true} size={30} />
      </div>
      {/* <nav className="hidden grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg bg-muted"
                  aria-label="Playground"
                >
                  <SquareTerminal className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Playground
              </TooltipContent>
            </Tooltip>
          </nav> */}
    </aside>
  )
}