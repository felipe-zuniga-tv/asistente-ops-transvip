import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ToolsButton({ item, handleClick, label, className }: {
    item: any
    handleClick: any
    label: string
    className?: string
}) {
    return (
        <Button variant={'outline'} 
            className={cn('tools-btn', className || "")}
            onClick={() => handleClick({ item })}>
            { label }
        </Button>
    )
}