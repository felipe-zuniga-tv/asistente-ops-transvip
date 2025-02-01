import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: string | Date) {
    return format(new Date(date), "PPp", { locale: es });
} 