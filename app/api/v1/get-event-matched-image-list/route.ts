import { NextResponse } from 'next/server';
import { getEventMatchedImages } from '@/lib/api/dummy-events';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id');

    if (!event_id) {
        return NextResponse.json(
            { error: 'Event ID is required' },
            { status: 400 }
        );
    }

    const matchedImages = getEventMatchedImages(parseInt(event_id));

    return NextResponse.json(matchedImages);
}
