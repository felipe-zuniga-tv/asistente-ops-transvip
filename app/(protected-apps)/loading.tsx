export default function Loading() {
    return (
        <div className="top-1/2 h-svh flex flex-col gap-3 justify-center items-center p-16 rounded-md">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
            <p className="text-lg text-black">Cargando las cosas...</p>
        </div>
    )
}