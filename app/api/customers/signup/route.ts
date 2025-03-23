import { NextResponse } from 'next/server';
import { postJSONRequest } from '@/lib/services/utils/helpers';
import { CUSTOMER_SIGNUP_API_URL } from '@/lib/services/config/urls';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const result = await postJSONRequest(CUSTOMER_SIGNUP_API_URL, data);

        if (!result) {
            return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}