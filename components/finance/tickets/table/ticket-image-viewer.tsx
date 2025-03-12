import { Button, SimpleDialog } from "@/components/ui"
import { Search } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// Create a reusable image viewer component
export default function TicketImageViewer({ imageUrl }: { imageUrl: string }) {
    const [isOpen, setIsOpen] = useState(false)
    
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)
    
    return (
        <>
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleOpen}
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Ver ticket</span>
            </Button>
            
            <SimpleDialog 
                isOpen={isOpen} 
                onClose={handleClose}
                className="sm:max-w-md flex flex-col items-center justify-center p-4"
            >
                <div className="overflow-hidden mt-4">
                    <Image 
                        src={imageUrl}
                        alt="Ticket de estacionamiento" 
                        className="h-[420px] w-auto object-contain"
                        width={420}
                        height={420}
                    />
                </div>
            </SimpleDialog>
        </>
    )
}