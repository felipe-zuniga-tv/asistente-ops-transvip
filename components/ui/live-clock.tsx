'use client'

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const everyXseconds = 1

export function LiveClock() {
    const [time, setTime] = useState(new Date().toLocaleTimeString('es-CL'));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('es-CL'));
        }, 1000 * everyXseconds);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-slate-900 text-lg p-2 px-4 bg-white rounded-lg flex flex-row items-center gap-3">
            <Clock className='h-4 w-4' /> {time}
        </div>
    );
}