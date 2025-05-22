import { Suspense } from "react"
import { DriversDataTable } from "@/components/features/drivers/table"
import { searchDrivers } from "@/lib/features/driver"
import SuspenseLoading from "@/components/ui/suspense"

export default async function DriversPage() {
    // Fetch full list of drivers; adjust limit as needed.
    const drivers = (await searchDrivers({ limit: 25, offset: 0 })) || []

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <DriversDataTable data={drivers} />
        </Suspense>
    )
}
