import { NextRequest } from "next/server";

const ADMIN_LOGIN_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_LOGIN_ROUTE}`;

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const response = await fetch(ADMIN_LOGIN_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'content-language': 'es',
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        const { data, message, status } = await response.json();

        return Response.json({ data, message, status })
    } catch (error) {
        console.error('Error fetching data:', error);
        return Response.json({ data: 'Internal Server Error', status: 500 });
    }
}