import { CUSTOMER_SIGNUP_API_URL } from "../config/urls";

const BASE_PASSWORD = 'Contraseña123!'

const DEVICE_TYPE_ENUM = {
    ANDROID: 0,
    IOS: 1,
    WEB: 2,
}

export async function createCustomerAccount(formData: {
    firstName: string;
    lastName: string;
    email: string;
    language: string;
}) {
    const now = new Date();
    const deviceTimezoneOffset = now.getTimezoneOffset();

    // Form Data - Payload
    const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email.toLowerCase(),
        password: BASE_PASSWORD,
        device_type: DEVICE_TYPE_ENUM.WEB,
        device_token: "-",
        lang: formData.language === 'en-US' ? 0 : 1,
        timezone: deviceTimezoneOffset.toString()
    }

    const formDataPayload = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
        formDataPayload.append(key, value.toString());
    });

    const response = await fetch(CUSTOMER_SIGNUP_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Language': 'es'
        },
        body: formDataPayload.toString()
    });
    
    if (!response.ok) {
        throw new Error(`Failed to create customer account: ${response.statusText}`);
    }

    const data = await response.json();
    console.log({ response: data })
    
    return data;
} 