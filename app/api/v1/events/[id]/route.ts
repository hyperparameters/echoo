import { NextResponse } from 'next/server';
import { dummyEvents } from '@/lib/api/dummy-events';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    const event = dummyEvents.find((e) => e.id === id);

    if (!event) {
        return NextResponse.json(
            { error: 'Event not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(event);
}
