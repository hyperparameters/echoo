import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Get auth token from request headers
        const authHeader = request.headers.get('Authorization');
        
        const response = await fetch(`${API_BASE_URL}/api/v1/getEventList`, {
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader }),
            },
        });

        // If backend returns empty array (200 OK), that's valid - return it
        if (response.status === 200) {
            const data = await response.json();
            // Empty array is a valid response when no events exist
            return NextResponse.json(data);
        }

        // Only treat non-200 status codes as errors
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
            errorData,
            { status: response.status }
        );
    } catch (error) {
        console.error('Error fetching events from backend:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events from backend' },
            { status: 500 }
        );
    }
}
