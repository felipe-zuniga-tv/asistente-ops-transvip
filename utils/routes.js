export const Routes = Object.freeze({
    HOME: '/',
    LOGIN: '/',
    CONTROL: '/control',
    CHAT: '/chat',
    START: '/chat',
})

export const HeaderLinks = [
    {
        label: 'Mi Asistente',
        href: Routes.CHAT
    },
    {
        label: 'Control Flota',
        href: Routes.START
    },
    {
        label: 'Orders',
        href: '#'
    },
    {
        label: 'Products',
        href: '#'
    },
]