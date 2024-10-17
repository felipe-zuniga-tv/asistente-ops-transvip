export default function SuspenseLoading({ text } : { text? : string }) {
    return (
        <div className='min-h-screen flex justify-center items-center animate-pulse text-xl'>
            {text || 'Cargando...'}
        </div>
    )
}
