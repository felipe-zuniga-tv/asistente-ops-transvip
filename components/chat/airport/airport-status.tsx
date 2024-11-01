import { Routes } from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";

export default function AirportStatus({ services }: { services: any[] }) {

    if (!services || services.length === 0)
        return (
            <span>No hay móviles en esta zona iluminada</span>
    )

    return (
        <div className="flex flex-col gap-2 items-start justify-start">
            <div className="grid grid-cols-2 gap-2 w-full text-slate-700">
                { services.map(srv => (
                    <div key={srv.name} className="flex grow flex-row items-center gap-4 bg-gray-200 hover:bg-gray-100 rounded-md p-2 px-4">
                        <Image src={srv.vehicle_image}
                            width={40} height={40}
                            className="h-auto w-[20px]"
                            alt={srv.name}
                        />
                        <span className="font-semibold">{ srv.name }</span>
                        <span className="font-normal">{ srv.count }</span>
                    </div>
                ))}
            </div>
            <span>Más detalle <Link href={Routes.AIRPORT.HOME} className="underline">aquí</Link>.</span>
        </div>
    )
}