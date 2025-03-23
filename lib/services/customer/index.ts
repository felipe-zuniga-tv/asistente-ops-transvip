const CUSTOMER_SIGNUP_API_ROUTE = '/api/customers/signup'
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
        device_type: 2, // web
        device_token: "-",
        lang: 1, // 1 - spanish, 0 - english
        // app_version: "-",
        timezone: deviceTimezoneOffset.toString()
    }

    const response = await fetch(CUSTOMER_SIGNUP_API_ROUTE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Language': 'es'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to create customer account: ${response.statusText}`);
    }

    const data = await response.json();
    console.log({ response: data })
    
    return data;
} 