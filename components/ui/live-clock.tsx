'use client'

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const everyXseconds = 1

export function LiveClock({ className }: { className?: string }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString('es-CL'));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('es-CL'));
        }, 1000 * everyXseconds);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn("text-slate-900 text-lg p-2 px-4 bg-white rounded-lg flex flex-row items-center gap-3", className || '')}>
            <Clock className='h-4 w-4' /> {time}
        </div>
    );
}