import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/lib/utils";
import React from "react";

export const CollapsibleSection = React.memo(({ title, isOpen, onToggle, children }: {
    title: string
    isOpen: boolean
    onToggle: () => void
    children: React.ReactElement
}) => {
    return (
        <Collapsible 
            open={isOpen} 
            onOpenChange={onToggle} 
            className={cn(isOpen ? 'bg-transparent' : 'bg-white hover:bg-gray-100 rounded-md')}
        >
            <CollapsibleTrigger className="w-full flex justify-between items-center pr-2">
                <span className={cn('font-bold titles-font p-2.5', isOpen ? 'mb-1' : 'mb-0')}>{ title }</span>
                { isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" /> }
            </CollapsibleTrigger>
            <CollapsibleContent>
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
});