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

// Note: We don't forward webhook responses as callbacks.
// The OpenServ platform will send the final result via the callback URL
// configured in the workflow (REST API agent node).

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_OPENSERV_API_URL || 'https://api.openserv.ai';
  const webhookUrl = process.env.NEXT_PUBLIC_OPENSERV_WEBHOOK_URL;
  const authToken = req.headers.get('authorization');
  const openservKey = req.headers.get('x-openserv-key');

  // Parse the request body
  let body: any;
  let callbackUrl: string | null = null;
  let agentId: string | null = null;

  try {
    body = await req.json();
    callbackUrl = body.metadata?.callback_url || null;
    agentId = body.agentId || process.env.OPENSERV_AGENT_ID;
    console.log('Request body parsed, callback URL:', callbackUrl || 'none');
  } catch (e) {
    console.error('Error parsing request body:', e);
    return getErrorResponse(new Error('Invalid request body'), 400);
  }

  let targetUrl: string;
  if (webhookUrl) {
    targetUrl = webhookUrl;
    console.log('Using Webhook URL for target:', targetUrl);
  } else {
    // Direct agent API endpoint doesn't exist - agents are called by the platform via workflows
    // If no webhook URL, we need to use a workflow that calls the agent
    return getErrorResponse(
      new Error('OPENSERV_WEBHOOK_URL is required. Agents are called via workflows, not direct API endpoints. Please configure a workflow in OpenServ platform that calls your registered agent.'),
      400
    );
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

    console.log('Request headers:', JSON.stringify(headers, null, 2));
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

      // Don't forward webhook response as callback - OpenServ platform will send callback separately
      // The webhook response is just an acknowledgment, not the final result

      return new NextResponse(text, {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders
      });
    }

    // For JSON responses
    const responseData = await response.json();

    // Don't forward webhook response as callback - OpenServ platform will send callback separately
    // The webhook response is just an acknowledgment, not the final result
    // The actual agent result will come via the callback URL configured in the workflow

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
