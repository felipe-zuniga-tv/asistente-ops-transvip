'use client'

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip"
import { Check, Copy } from "lucide-react"
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
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="default" 
                            size="icon" 
                            onClick={handleCopy} 
                            className="absolute border top-3 right-3 bg-white hover:bg-gray-100 text-slate-900"
                        >
                            {isCopied ? <Check className="text-emerald-500 w-3 h-3" /> : <Copy className="w-3 h-3" />}
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