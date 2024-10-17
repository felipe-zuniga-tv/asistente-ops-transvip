import Protected from "@/components/protected/protected-content";

export default async function AirportLayout({ children } : { children : React.ReactNode }) {
    return (
        <Protected>
            <div className="flex min-h-screen w-full flex-col bg-desert bg-cover bg-center overflow-auto">
                { children }
            </div>
        </Protected>
    )
}