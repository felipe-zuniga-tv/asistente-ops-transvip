'use client'

import { ArrowDownRight, ArrowDownRightFromCircle, RotateCw } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

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

        // Hide QR code after 5 seconds
        setTimeout(() => {
            setIsQrVisible(false);
        }, 5000);
    };

    const handleStartOver = () => {
        setBookingNumber('');
        setErrorMessage('');
        setQrCodeUrl(null);
        setIsQrVisible(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow-lg flex flex-col gap-6 px-6 pb-4">
            <div className="flex flex-col gap-2 md:gap-4 justify-center items-center px-6 md:px-8 pt-6 md:pt-8">
                <Image src="/images/transvip-logo-only-color.png"
                    alt="Transvip Logo"
                    height={80}
                    width={80}
                    className="h-8 w-8 md:h-10 md:w-10" />
                <div id="welcome-title" className="text-lg md:text-2xl font-bold text-gray-800">Genera tu código QR</div>
            </div>

            <div className='flex justify-center items-center gap-4'>
                <input
                    type="text"
                    value={bookingNumber}
                    onChange={(e) => setBookingNumber(e.target.value)}
                    placeholder="Ingresa el número de reserva"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    onClick={generateQRCode}
                    className="mx-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 min-w-fit"
                >
                    Generar QR
                </button>
            </div>

            <div className='flex justify-start'>
                <Button variant="default" onClick={handleStartOver}
                    className="px-4 py-2 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 transition duration-300 min-w-fit"
                >
                    Empezar de nuevo
                    <RotateCw className='ml-2 h-4 w-4' />
                </Button>
            </div>

            { errorMessage && <div className='text-center text-red-500'>{ errorMessage }</div>}

            {isQrVisible && qrCodeUrl && (
                <div className="my-6 mx-auto">
                    <Image height={400} width={400} src={qrCodeUrl} alt='Código QR Generado' className="mx-auto" />
                </div>
            )}
        </div>
    );
};