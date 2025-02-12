import { CUSTOMER_SIGNUP_API_URL } from "@/lib/services/config/urls";
import { postJSONRequest } from "@/lib/services/utils/helpers";

const BASE_PASSWORD = 'Contraseña123!'

// TODO: Add the fixed token (and add it to the payload and .env file)

export async function createCustomerAccount(formData: {
    firstName: string;
    lastName: string;
    email: string;
    language: string;
}) {
    const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email.toLowerCase(),
        password: BASE_PASSWORD,
        device_token: "-",
        device_type: 1,
        lang: formData.language === 'es' ? 2 : 1,
        app_version: "-",
        timezone: "180"
    }

    const result = await postJSONRequest(CUSTOMER_SIGNUP_API_URL, payload)
    return result
} 