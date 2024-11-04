import Link from 'next/link';
import { airportTools } from '@/lib/transvip/config';

export default function AirportStartPage() {
    return (
        <div className='bg-gray-200/80 p-8 min-h-screen text-center'>
            <span className='text-xl font-bold'>Herramientas Aeropuerto</span>
            <div className='p-8 bg-white rounded-md grid grid-cols-1 md:grid-cols-3 grid-flow-row gap-4 items-start justify-start overflow-auto mt-8'>
                {airportTools.filter(t => t.active).map((tool) => (
                    <Link key={tool.href} href={tool.href} className='min-h-fit'>
                        <div className="p-12 rounded-md bg-slate-700 hover:bg-slate-500 text-white shadow-md text-xl text-center h-full">
                            {tool.name}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}