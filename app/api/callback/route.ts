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
    console.log('📥 POST Callback received');
    const { id, output } = await request.json();

    if (!id) {
      console.error('❌ Callback missing ID');
      return NextResponse.json(
        { error: 'Missing id in callback' }, 
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`📥 Callback received for ID: ${id}`, { output: output ? 'data received' : 'no data' });

    // Store callback data
    callbacks.set(id, output || { status: 'received', timestamp: new Date().toISOString() });

    // Auto-cleanup after 5 minutes
    setTimeout(() => {
      callbacks.delete(id);
      console.log(`🧹 Cleaned up callback for ID: ${id}`);
    }, 5 * 60 * 1000);

    return NextResponse.json({ 
      ok: true, 
      id,
      message: 'Callback received',
      timestamp: new Date().toISOString()
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

// Helper to log all stored callback IDs
function logStoredCallbackIds() {
  const ids = Array.from(callbacks.keys());
  console.log('📋 Currently stored callback IDs:', ids.length > 0 ? ids : 'None');
  return ids;
}

export async function GET(request: Request) {
  console.log('🔍 GET Callback request received');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    console.error('❌ Missing ID in callback GET request');
    return NextResponse.json(
      { 
        error: 'Missing id parameter',
        availableCallbacks: logStoredCallbackIds()
      }, 
      { status: 400, headers: corsHeaders }
    );
  }

  console.log(`🔍 Looking up callback for ID: ${id}`);
  logStoredCallbackIds();
  
  const output = callbacks.get(id);
  
  if (output) {
    console.log(`✅ Found callback data for ID: ${id}`);
    return NextResponse.json({
      ok: true,
      id,
      data: output,
      timestamp: new Date().toISOString(),
      storedAt: output.timestamp || 'unknown'
    }, { 
      status: 200,
      headers: corsHeaders
    });
  }

  // If we get here, no callback data was found
  console.log(`❌ No callback data found for ID: ${id}`);
  return NextResponse.json(
    { 
      ok: false, 
      message: 'Callback not found yet',
      id,
      timestamp: new Date().toISOString()
    }, 
    { 
      status: 404,
      headers: corsHeaders
    }
  );
}
