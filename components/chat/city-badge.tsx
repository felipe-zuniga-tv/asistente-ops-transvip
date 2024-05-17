import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function CityBadge({ code, className }: { code?: string, className?: string }) {
    return (
        <Badge variant={"default"} 
            className={cn("py-2", "bg-slate-400 hover:bg-slate-500 text-sm text-white", className)}>
            {code}
        </Badge>
    )
}