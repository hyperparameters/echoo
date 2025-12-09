import { NextResponse } from 'next/server';
import { dummyEvents } from '@/lib/api/dummy-events';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(dummyEvents);
}
