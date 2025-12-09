import { NextResponse } from 'next/server';
import { getRegisteredEvents } from '@/lib/api/dummy-events';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(getRegisteredEvents());
}
