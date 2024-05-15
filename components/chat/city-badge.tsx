import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function CityBadge({ code }: { code?: string }) {
    return (
        <Badge variant={"default"} 
            className={cn("py-2", "bg-slate-900 text-white")}>
            {code}
        </Badge>
    )
}