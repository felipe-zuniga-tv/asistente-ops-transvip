export const Routes = Object.freeze({
    HOME: '/',
    LOGIN: '/',
    CONTROL: '/control',
    CHAT: '/chat',
    START: '/chat',
    QR_GEN: '/qr',
    AIRPORT: {
        HOME: '/aeropuerto',
        ZI: '/aeropuerto/zi',
        ZI_SCL: '/aeropuerto/zi/scl',
        ZI_ANF: '/aeropuerto/zi/anf',
        ZI_CJC: '/aeropuerto/zi/cjc',
    },
    BOOKINGS: {
        SHARED: '/reservas/compartidas',
    },
    FINANCE: {
        TICKETS: '/finanzas/tickets',
    },
    DATA: {
        HOME: '/data',
        GEOFENCES: '/data/geofences',
    },
    TEXT: {
        WRITE: '/write',
    },
    ROUTE: {
        MAIN: '/ruteo'
    },
    FEEDBACK: {
        GOOGLE_FORMS: 'https://forms.gle/qeiBzwNhUwD5WcLt8'
    }
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
        label: 'Chatbot',
        href: Routes.CHAT
    },
    {
        label: 'Código QR',
        href: Routes.QR_GEN
    },
];