import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Get auth token from request headers
        const authHeader = request.headers.get('Authorization');
        
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
        
        const response = await fetch(`${API_BASE_URL}/api/v1/events/my-registered-events`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
        });

        // If backend returns empty array (200 OK), that's valid - return it
        if (response.status === 200) {
            const data = await response.json();
            // Empty array is a valid response when user has no registered events
            return NextResponse.json(data);
        }

        // Only treat non-200 status codes as errors
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
            errorData,
            { status: response.status }
        );
    } catch (error) {
        console.error('Error fetching registered events from backend:', error);
        return NextResponse.json(
            { error: 'Failed to fetch registered events from backend' },
            { status: 500 }
        );
    }
}
