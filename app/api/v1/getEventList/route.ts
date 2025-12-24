import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Get auth token from request headers
        const authHeader = request.headers.get('Authorization');
        const url = `${API_BASE_URL}/api/v1/getEventList`;
        
        console.log('[getEventList] Fetching from:', url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    ...(authHeader && { 'Authorization': authHeader }),
                },
                cache: 'no-store', // Disable Next.js caching
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            console.log('[getEventList] Response status:', response.status);
            console.log('[getEventList] Response headers:', Object.fromEntries(response.headers.entries()));

            // If backend returns empty array (200 OK), that's valid - return it
            if (response.status === 200) {
                const text = await response.text();
                console.log('[getEventList] Response text (first 500 chars):', text.substring(0, 500));
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('[getEventList] Failed to parse JSON:', e);
                    return NextResponse.json({ error: 'Invalid JSON response' }, { status: 500 });
                }
                console.log('[getEventList] Parsed data length:', Array.isArray(data) ? data.length : 'not array');
                // Empty array is a valid response when no events exist
                return NextResponse.json(data, {
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });
            }

            // Only treat non-200 status codes as errors
            const errorData = await response.json().catch(() => ({}));
            console.error('[getEventList] Error response:', errorData);
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                console.error('[getEventList] Request timeout');
                return NextResponse.json(
                    { error: 'Backend request timeout' },
                    { status: 504 }
                );
            }
            throw fetchError;
        }
    } catch (error) {
        console.error('[getEventList] Exception:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events from backend' },
            { status: 500 }
        );
    }
}
