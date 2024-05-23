import { UserIcon } from "lucide-react"
import Image from "next/image"

export default function DriverAvatar({ url, alt } : { 
    url: string, alt: string 
}) {
    return (
        url !== '' ? <Image src={url}
            width={100} height={100}
            className='h-12 w-12 md:h-16 md:w-16 shadow-md object-cover rounded-full' 
            alt={alt}
            />
        : <UserIcon className='size-12 rounded-full shadow-md bg-gray-100 text-black p-2' />           
    )
}