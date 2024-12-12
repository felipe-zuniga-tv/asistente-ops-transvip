'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { IBookingInfoOutput } from "@/lib/chat/types";
import { BookingCard, SharedServiceSummary } from "@/components/chat/search/booking-search";

export default function SharedBookingsPage() {
    const [bookingId, setBookingId] = useState<string>("");
    const [bookingInfo, setBookingInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    function handleReset() {
        setBookingId("");
        setBookingInfo(null);
    }

    async function handleSearch() {
        if (!bookingId) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/bookings/shared', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch booking');
            }

            const { data } = await response.json();
            setBookingInfo(data);
        } catch (error) {
            console.error("Error fetching booking:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-4 p-2 md:p-0">
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row gap-2 justify-between items-center">
                        <div className="flex flex-row items-center gap-2">
                            <span className="text-lg font-bold">Reservas Compartidas</span>
                        </div>
                        <Button
                            variant="default"
                            onClick={handleReset}
                            className="text-sm"
                        >
                            Comenzar de nuevo
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <Input
                                id="booking_number"
                                type="text"
                                value={bookingId}
                                onChange={(e) => setBookingId(e.target.value)}
                                placeholder="Ingresa el número de paquete"
                                className="bg-gray-50"
                            />
                            <Button
                                variant={"default"}
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="w-[130px] mx-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
                            >
                                {isLoading ? "Buscando..." : "Buscar"}
                            </Button>
                        </div>

                        {bookingInfo && bookingInfo.length > 0 && (
                            <div className="p-2 bg-gray-100 rounded-md">
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold ml-2">Total: {bookingInfo.length} reservas</span>
                                    <SharedServiceSummary result={bookingInfo} />
                                </div>
                            </div>
                        )}

                        {bookingInfo && bookingInfo.length > 0 && (
                            <div className="p-2 bg-gray-100 rounded-md h-[600px] overflow-y-auto">
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold ml-2">Detalle</span>
                                    <div className="flex flex-col gap-4">
                                        {bookingInfo.map((booking: IBookingInfoOutput) => (
                                            <BookingCard
                                                key={booking.booking.id}
                                                result={booking}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
