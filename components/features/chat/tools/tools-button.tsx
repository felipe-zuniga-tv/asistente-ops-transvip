import { Button } from "@/components/ui";
import { cn } from '@/utils/ui';

export default function ToolsButton({ item, handleClick, label, className }: {
    item: any
    handleClick: any
    label: string
    className?: string
}) {
    return (
        <Button variant={'outline'} size={"sm"}
            className={cn('tools-btn', className || "")}
            onClick={() => handleClick({ item })}>
            { label }
        </Button>
    )
}