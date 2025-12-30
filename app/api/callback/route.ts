import { NextResponse } from 'next/server';

// In-memory store for callbacks (in production, use Redis or a database)
const callbacks = new Map<string, any>();

// Enable CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { id, output } = body;

      if (!id) {
      console.error('❌ Callback missing ID:', body);
      return NextResponse.json(
        { error: 'Missing id in callback' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('📥 Callback received:', { id, output: typeof output });

    // Store callback data
    callbacks.set(id, output);

    // Auto-cleanup after 5 minutes
    setTimeout(() => {
      callbacks.delete(id);
    }, 5 * 60 * 1000);

    return NextResponse.json({ 
      ok: true, 
      id,
      message: 'Callback received'
    }, {
      status: 200,
      headers: corsHeaders
    });
  } catch (err: any) {
    console.error('❌ Callback error:', err);
    return NextResponse.json({
      ok: false,
      error: err?.message || 'Unknown error'
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400, headers: corsHeaders });
  }

  const output = callbacks.get(id);

  if (output) {
    // Delete after retrieving (prevent multiple reads) - match demo app pattern
    callbacks.delete(id);
    return NextResponse.json({ ok: true, output }, {
      status: 200,
      headers: corsHeaders
    });
  }

  return NextResponse.json({ ok: false, message: 'Callback not found yet' }, { status: 404, headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}
