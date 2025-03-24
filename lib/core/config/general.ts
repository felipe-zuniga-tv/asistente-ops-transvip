export const config = {
    COOKIES: {
        TOKEN_JWT_SECRET: "secret_key_transvip",
        COOKIE_KEY: "TRANSVIP_ACCESS_TOKEN",
        DRIVER_COOKIE_KEY: "DRIVER_SESSION",
    },
    API: {
        NEXT_PUBLIC_API_BASE_URL: "https://liveapi.transvip.cl",
        NEXT_PUBLIC_API_ADMIN_LOGIN_ROUTE: "admin_login",
        NEXT_PUBLIC_API_ADMIN_IDENTITY: "getAllAdminsNew",
        GET_VEHICLE_STATUS: "get_driver_on_route_search",
        GET_VEHICLE_DETAIL: "get_all_cars",
        SEARCH_DRIVER: "get_all_drivers",
        GET_DRIVER_PROFILE: "get_driver_info",
        GET_DRIVER_RATINGS: "get_driver_ratingFilteres",
        GET_BOOKING_DETAIL: "get_bookings",
        GET_BOOKING_BY_ID: "search_booking_by_id", // Permite buscar por paquete
        GET_BOOKING_INFO_FULL: "get_booking_info",
        GET_ZONA_ILUMINADA_CITY: "get_illuminated_zones_for_branch",
        GET_ZONA_ILUMINADA_SERVICES: "get_illuminated_zone_services",
        GET_STATUS_AIRPORT_CITY: "view_illuminated_zone_data_admin",
    }
}