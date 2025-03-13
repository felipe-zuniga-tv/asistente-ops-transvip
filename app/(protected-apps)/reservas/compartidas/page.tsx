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
import { IBookingInfoOutput } from "@/lib/core/types";
import { BookingCard, SharedServiceSummary } from "@/components/chat/search/booking-search";
import { Switch } from "@/components/ui/switch";
import { ResetButton } from "@/components/ui/buttons";
import { CardTitleContent } from "@/components/ui/card-title-content";
import { getBookingInfo } from "@/lib/services/booking";

export default function SharedBookingsPage() {
    const [bookingId, setBookingId] = useState<string>("");
    const [bookingInfo, setBookingInfo] = useState<IBookingInfoOutput[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    function handleReset() {
        setBookingId("");
        setBookingInfo(null);
    }

    async function handleSearch() {
        if (!bookingId) return;

        setIsLoading(true);
        try {
            const response = await getBookingInfo(Number(bookingId), true);
            setBookingInfo(response ? response : [])

        } catch (error) {
            console.error("Error fetching booking:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-col md:flex-row gap-2 justify-between items-center">
                    <CardTitleContent title="Reservas Compartidas" />
                    <ResetButton handleReset={handleReset} />
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
                                <span className="font-semibold ml-2">Total: {bookingInfo.length} {bookingInfo.length === 1 ? 'reserva' : 'reservas'}</span>
                                <SharedServiceSummary result={bookingInfo} />
                            </div>
                        </div>
                    )}

                    {bookingInfo && bookingInfo.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            No hay resultados
                        </div>
                    )}

                    {bookingInfo && bookingInfo.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={showDetails}
                                onCheckedChange={setShowDetails}
                                id="show-details"
                            />
                            <label
                                htmlFor="show-details"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Mostrar detalles
                            </label>
                        </div>
                    )}

                    {bookingInfo && bookingInfo.length > 0 && showDetails && (
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
    );
}
