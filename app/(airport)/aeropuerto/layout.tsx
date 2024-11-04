export default async function AirportLayout({ children } : { children : React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-desert bg-cover bg-center overflow-auto">
            { children }
        </div>
    )
}