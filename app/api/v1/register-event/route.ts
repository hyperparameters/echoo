import { NextResponse } from 'next/server';
import { addRegisteredEvent, dummyEvents } from '@/lib/api/dummy-events';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { event_id } = body;

        if (!event_id) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        const event = dummyEvents.find((e) => e.id === event_id);

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        const registeredEvent = addRegisteredEvent(event_id, event);

        return NextResponse.json(registeredEvent);
    } catch (error) {
        console.error('Error registering event:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
