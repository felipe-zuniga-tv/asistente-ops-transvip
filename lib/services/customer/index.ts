import { CUSTOMER_SIGNUP_API_URL } from "@/lib/services/config/urls";
import { postJSONRequest } from "@/lib/services/utils/helpers";

const BASE_PASSWORD = 'Contraseña123!'

export async function createCustomerAccount(formData: {
    firstName: string;
    lastName: string;
    email: string;
    language: string;
}) {
    const now = new Date();
    const deviceTimezoneOffset = now.getTimezoneOffset();

    const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email.toLowerCase(),
        password: BASE_PASSWORD,
        device_token: "-",
        device_type: 1,
        lang: 2,
        app_version: "-",
        timezone: deviceTimezoneOffset.toString()
    }

    console.log(payload)

    // const result = await postJSONRequest(CUSTOMER_SIGNUP_API_URL, payload)
    const result = null
    return result
} 