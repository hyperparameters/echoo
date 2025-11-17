import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const webhookUrl = process.env.NEXT_PUBLIC_OPENSERV_WEBHOOK_URL
    const apiKey = process.env.NEXT_PUBLIC_OPENSERV_API_KEY

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Missing OpenServ webhook URL' },
        { status: 500 }
      )
    }

    // Transform payload for OpenServ workflow
    // Workflows expect: { message: string, metadata: {...} }
    // Not: { messages: [{role, content}], metadata: {...} }
    const workflowPayload = {
      message: body.messages?.[0]?.content || '',
      metadata: body.metadata || {}
    }

    // Call OpenServ Platform Workflow Webhook from server-side
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (apiKey) {
      headers['x-openserv-key'] = apiKey
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(workflowPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenServ API error:', response.status, errorText)
      return NextResponse.json(
        { error: `OpenServ API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Agent API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

