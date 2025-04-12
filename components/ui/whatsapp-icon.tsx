import { cn } from "@/utils/ui"
import Image from "next/image"

export const WhatsappIcon = ({ className = "" }: { className?: string }) => {
    return (
      <Image src={'/images/whatsapp-logo.png'} height={100} width={100}
        className={cn("h-4 w-4 text-white object-cover", className)} alt={"Logo Whatsapp"} />
    )
  } 