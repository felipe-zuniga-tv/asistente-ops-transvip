import Link from 'next/link';
import { airportTools } from '@/lib/core/config/airport'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/ui';
import { TransvipLogo } from '@/components/features/transvip/transvip-logo';

export default function AirportStartPage() {
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Aeropuerto</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {airportTools.filter(t => t.active).map((tool) => (
                        <Link key={tool.href} href={tool.href} className='block transition-transform hover:scale-[1.02]'>
                            <Card className={cn(
                                "h-full transition-shadow duration-200",
                                "bg-transvip/50 hover:bg-transvip-dark/50 text-black border-0"
                            )}>
                                <CardHeader>
                                    <CardTitle className="text-center text-xl font-semibold">{tool.name}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}