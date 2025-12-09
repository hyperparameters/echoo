import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-openserv-key',
};

// Helper function to create error responses
function getErrorResponse(error: Error, status: number = 500) {
  return NextResponse.json(
    { error: error.message || 'Internal Server Error' },
    { status, headers: corsHeaders }
  );
}

// Add a custom fetch with timeout and better error handling
async function fetchWithTimeout(url: string, options: any = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

// Forward response to callback URL
async function forwardToCallback(callbackUrl: string, data: any) {
  try {
    console.log(`📤 Forwarding to callback: ${callbackUrl}`);
    const response = await fetch(callbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output: data }),
    });
    if (!response.ok) {
      console.error(`Callback failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error in callback forwarding:', error);
  }
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const targetUrl = process.env.NEXT_PUBLIC_OPENSERV_API_URL || 'https://api.openserv.ai';
  const authToken = req.headers.get('authorization');
  const openservKey = req.headers.get('x-openserv-key');

  // Parse the request body to get the callback URL
  let body: any;
  let callbackUrl: string | null = null;

  try {
    body = await req.json();
    callbackUrl = body.metadata?.callback_url || null;
    console.log('Request body parsed, callback URL:', callbackUrl || 'none');
  } catch (e) {
    console.error('Error parsing request body:', e);
    return getErrorResponse(new Error('Invalid request body'), 400);
  }

  // Mock response removed as per user request
  /*
  if (process.env.NODE_ENV === 'development') {
     // ... mock logic removed ...
  }
  */

  try {
    console.log('Forwarding request to:', targetUrl);

    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': authToken }),
      ...(openservKey && { 'x-openserv-key': openservKey }),
    };

    console.log('Request headers:', headers);
    console.log('Request body:', JSON.stringify(body, null, 2));

    const response = await fetchWithTimeout(
      targetUrl,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      }
    );

    console.log('Received response with status:', response.status);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!isJson) {
      const text = await response.text();
      console.log('Non-JSON response:', text);

      if (callbackUrl) {
        await forwardToCallback(callbackUrl, { text });
      }

      return new NextResponse(text, {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders
      });
    }

    // For JSON responses
    const responseData = await response.json();

    // Forward to callback if specified
    if (callbackUrl) {
      await forwardToCallback(callbackUrl, responseData);
    }

    return NextResponse.json(responseData, {
      status: response.status,
      headers: corsHeaders
    });

  } catch (error: any) {
    console.error('Proxy error details:', {
      name: error.name,
      message: error.message,
      code: (error as any).code,
      cause: (error as any).cause,
      stack: error.stack
    });

    // Handle specific error cases with more detailed messages
    if (error.name === 'TimeoutError' || error.code === 'ETIMEDOUT' || error.message.includes('timed out')) {
      return getErrorResponse(
        new Error('The request to the API server timed out. The server might be under heavy load or experiencing issues.'),
        504
      );
    }

    if (error.name === 'HostNotFoundError' || error.code === 'ENOTFOUND') {
      return getErrorResponse(
        new Error(`Could not resolve the API server hostname (${new URL(targetUrl).hostname}). Please check your network connection and DNS settings.`),
        502
      );
    }

    if (error.name === 'ConnectionRefusedError' || error.code === 'ECONNREFUSED') {
      return getErrorResponse(
        new Error('The API server refused the connection. It might be down or not accepting connections.'),
        503
      );
    }

    // Handle fetch-specific errors
    if (error.type === 'system' && error.errno === 'ETIMEDOUT') {
      return getErrorResponse(
        new Error('Network request timed out. Please check your internet connection and try again.'),
        504
      );
    }

    // For any other error, provide a generic but helpful message
    return getErrorResponse(
      new Error(`Failed to connect to the API: ${error.message || 'Unknown error'}`),
      (error as any).status || 500
    );
  }
}
