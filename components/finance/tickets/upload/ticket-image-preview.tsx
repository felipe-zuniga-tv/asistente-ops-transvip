import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TicketImagePreviewProps {
  imageUrl: string
  onRemove?: () => void
  height?: string
  showRemoveButton?: boolean
}

export function TicketImagePreview({ 
  imageUrl, 
  onRemove, 
  height = "300px",
  showRemoveButton = true 
}: TicketImagePreviewProps) {
  return (
    <div className={`relative aspect-[4/3] w-auto max-h-[${height}] mx-auto`}>
      <Image
        src={imageUrl}
        alt="Ticket preview"
        fill
        className={`rounded-lg object-contain w-auto h-[${height}]`}
      />
      {showRemoveButton && onRemove && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 