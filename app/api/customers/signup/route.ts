import { NextResponse } from 'next/server';
import { ADMIN_CUSTOMER_SIGNUP_API_URL } from '@/lib/core/config/urls';

// Access Token for Sales Branches Forms
const ACCESS_TOKEN = process.env.TOKEN_SALES_BRANCHES_FORMS

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        // Form Data - Requested Information
        const data = await request.json()

        // Add missing fields
        data.access_token = ACCESS_TOKEN
        data.domainUrl = 'production'

        // Turn into form data
        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        // Send request to API
        const result = await fetch(ADMIN_CUSTOMER_SIGNUP_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Language': 'es'
            },
            body: formData.toString()
        });

        if (!result) {
            return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
        }

        const response = await result.json();

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
