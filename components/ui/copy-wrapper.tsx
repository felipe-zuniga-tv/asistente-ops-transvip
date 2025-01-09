'use client'

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import useClipboard from "@/hooks/use-copy-to-clipboard"
import { ReactNode } from "react"

interface CopyWrapperProps {
    children: ReactNode
    content: string
    className?: string
}

export function CopyWrapper({ children, content, className = "" }: CopyWrapperProps) {
    const { copyToClipboard, isCopied } = useClipboard()

    function handleCopy() {
        copyToClipboard(content)
    }

    return (
        <div className={`relative ${className}`}>
            {children}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="default" 
                            size="icon" 
                            onClick={handleCopy} 
                            className="absolute top-3 right-3 bg-slate-600 hover:bg-slate-500 w-8 h-8"
                        >
                            {isCopied ? <CheckIcon className="w-3 h-3" /> : <ClipboardIcon className="w-3 h-3" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {isCopied ? 'Copiado!' : 'Copiar'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}