import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { TransvipLogo } from '@/components/features/transvip/transvip-logo'
import Link from 'next/link'
import { ClipboardCheck, Search } from 'lucide-react'

const seguridadLinks = [
    {
        icon: <Search className="size-6 shrink-0" />,
        title: 'Formulario de Autoinspección Vehicular',
        href: 'https://mydatascope.com/public_form?language=es&share_token=1fabfde959f9646c6a4789d86dfefd95', // Replace with actual path
    },
    {
        icon: <ClipboardCheck className="size-6 shrink-0" />,
        title: 'Carta de Exclusión de Responsabilidad',
        href: 'https://mydatascope.com/shared_forms?share_token=7c6a759045f4d8d429fd8038218046dc&language=es', // Replace with actual path
    },
    // Add more links as needed
]

export default function SeguridadPage() {
    return (
        <Card>
            <CardHeader className="border-b pb-6 flex flex-row justify-center items-center gap-2 space-y-0">
                <CardTitle className="text-2xl font-bold flex flex-col gap-2 items-center justify-center">
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <TransvipLogo size={20} />
                        <span className="text-2xl font-bold">Seguridad Transvip</span>
                    </div>
                    <span className="text-muted-foreground text-center text-sm font-normal max-w-[90%]">
                        Accesos directos a formularios y recursos de seguridad.
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 py-6">
                <div className="w-full flex flex-col gap-6">
                    {seguridadLinks.map((link) => (
                        <Link key={link.href} href={link.href} target="_blank" className="block transition-transform hover:scale-[1.02] min-h-28">
                            <Card className="h-full hover:bg-transvip/80 hover:text-white transition-colors">
                                <CardHeader className="text-center w-full h-full flex items-center justify-center p-4 sm:p-6">
                                    <div className="font-medium flex flex-col items-center text-center gap-2 sm:flex-row sm:text-left sm:gap-3 w-full">
                                        <div className="w-10 h-10 flex items-center justify-center shrink-0">{link.icon}</div>
                                        <span className="text-base sm:text-lg">{link.title}</span>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="bg-gray-200 rounded-b-lg p-0">
                <div className="w-full flex items-center justify-center text-sm text-black p-3">
                    © {new Date().getFullYear()} · Transvip
                </div>
            </CardFooter>
        </Card>
    )
}
