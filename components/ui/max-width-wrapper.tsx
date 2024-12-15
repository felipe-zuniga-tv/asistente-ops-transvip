export default function MaxWidthWrapper({ children } : { children : React.ReactNode }) {
    return (
        <div className="w-full max-w-4xl mx-auto mt-4 p-2 md:p-4">
            { children }
        </div>
    )
}