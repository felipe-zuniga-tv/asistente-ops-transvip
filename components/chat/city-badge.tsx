import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function CityBadge({ code, className }: { code?: string, className?: string }) {
    return (
        <Badge variant={"default"} 
            className={cn("py-2", "bg-slate-200 text-sm text-slate-900", className)}>
            {code}
        </Badge>
    )
}