'use client'

import { useEffect, useState } from 'react';

const everyXseconds = 10

export function LiveClock() {
    const [time, setTime] = useState(new Date().toLocaleTimeString('es-CL'));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('es-CL'));
        }, 1000 * everyXseconds);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-slate-900 text-lg p-2 px-4 bg-white rounded-lg">
            {time}
        </div>
    );
}