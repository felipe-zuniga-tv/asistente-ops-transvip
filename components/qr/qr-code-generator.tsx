'use client'

import { RotateCw } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { TransvipLogo } from '../transvip/transvip-logo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

interface QRCodeGeneratorProps { }

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = () => {
    const [bookingNumber, setBookingNumber] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isQrVisible, setIsQrVisible] = useState<boolean>(false);

    const generateQRCode = () => {
        setErrorMessage('');

        if (!bookingNumber) {
            setErrorMessage('Ingresa un número de reserva');
            return;
        }

        const qrData = encodeURIComponent(`{"booking_id":${bookingNumber},"url":"www.transvip.cl/"}`);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${qrData}`;
        setQrCodeUrl(qrUrl);
        setIsQrVisible(true);
    }

    const handleStartOver = () => {
        setBookingNumber('')
        setErrorMessage('')
        setQrCodeUrl(null)
        setIsQrVisible(false)
    }

    return (
        <Card className="max-w-2xl mx-auto bg-white shadow p-4">
            <CardHeader className='mb-4'>
                <CardTitle>
                    <div className="flex flex-row items-center gap-4">
                        <TransvipLogo colored={true} size={30} />
                        <div id="welcome-title" className="text-lg md:text-2xl font-bold text-gray-800">Genera tu código QR</div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col sm:flex-row justify-center items-center gap-4'>
                    <input type="text"
                        value={bookingNumber}
                        onChange={(e) => setBookingNumber(e.target.value)}
                        placeholder="Ingresa el número de reserva"
                        className="w-full p-2 pl-4 text-base lg:text-lg border border-gray-300 rounded-md"
                    />
                    <Button variant={"default"} onClick={generateQRCode}
                        className="h-10 mx-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 w-[120px] sm:min-w-fit"
                    >
                        Generar QR
                    </Button>
                </div>

                {isQrVisible && qrCodeUrl && (
                    <div className="my-6 mx-auto">
                        <Image height={450} width={450} src={qrCodeUrl} alt='Código QR Generado' className="mx-auto" />
                    </div>
                )}

                {errorMessage && <div className='text-center text-red-500'>{errorMessage}</div>}
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Button variant="default" onClick={handleStartOver}
                    className="px-4 py-2 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 transition duration-300 min-w-fit"
                >
                    Empezar de nuevo
                    <RotateCw className='ml-2 h-4 w-4' />
                </Button>
            </CardFooter>

        </Card>
    );
};