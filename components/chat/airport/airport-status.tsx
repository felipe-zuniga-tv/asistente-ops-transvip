import Image from "next/image";

export default function AirportStatus({ services }: { services: any[] }) {

    if (!services || services.length === 0)
        return (
            <span>No hay móviles en esta zona iluminada</span>
    )

    return (
        <div className="flex flex-row gap-2 w-full text-slate-700">
            
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
                ))
            }
        </div>
    )
}