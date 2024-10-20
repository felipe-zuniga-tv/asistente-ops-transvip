export const Routes = Object.freeze({
    HOME: '/',
    LOGIN: '/',
    CONTROL: '/control',
    CHAT: '/chat',
    START: '/chat',
    QR_GEN: '/qr',
    AIRPORT: '/airport'
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

export const NavbarLinks = [
    {
        label: 'Inicio',
        href: Routes.HOME
    },
    {
        label: 'Jarvip',
        href: Routes.CHAT
    },
    {
        label: 'QR',
        href: Routes.QR_GEN
    },
];