import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const event_id = searchParams.get('event_id');
        const page = searchParams.get('page') || '0';
        const page_size = searchParams.get('page_size') || '10';

        if (!event_id) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        // Get auth token from request headers
        const authHeader = request.headers.get('Authorization');
        
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${API_BASE_URL}/api/v1/events/get-event-matched-image-list?event_id=${event_id}&page=${page}&page_size=${page_size}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching matched images from backend:', error);
        return NextResponse.json(
            { error: 'Failed to fetch matched images from backend' },
            { status: 500 }
        );
    }
}
