import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        // Get auth token from request headers
        const authHeader = request.headers.get('Authorization');
        
        const response = await fetch(`${API_BASE_URL}/api/v1/getEventList/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader }),
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: 'Event not found' },
                    { status: 404 }
                );
            }
            throw new Error(`Backend API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching event from backend:', error);
        return NextResponse.json(
            { error: 'Failed to fetch event from backend' },
            { status: 500 }
        );
    }
}
