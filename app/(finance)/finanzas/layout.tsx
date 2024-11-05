export default async function FinanzasLayout({ children } : { children : React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-transparent bg-cover bg-center overflow-auto items-center">
            { children }
        </div>
    )
}