import Image from "next/image"
import * as whatsappLogo from '../../public/images/whatsapp-logo.png'

export const WhatsappIcon = () => {
    return (
        <Image src={whatsappLogo} height={100} width={100}
            className="h-4 w-4 text-white object-cover" alt={"Logo Whatsapp"} />
    )
}