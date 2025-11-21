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

    // Pass through the payload as-is to the workflow
    // Frontend sends: { messages: [{role, content}], metadata: {...} }
    // Workflow and agent expect the same format
    const workflowPayload = body
    
    console.log('📤 Sending to workflow:', JSON.stringify({
      messages: workflowPayload.messages,
      metadata: {
        ...workflowPayload.metadata,
        auth_token: workflowPayload.metadata?.auth_token ? '✅ Present' : '❌ Missing'
      }
    }, null, 2))

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
    
    // Transform OpenServ workflow response to match frontend expectations
    // Agent capabilities return JSON strings like: { "success": true, "profile": {...} }
    // Frontend expects: { choices: [{ message: { content, tool_calls: [{function: {result: {...}}}] } }] }

    console.log('📦 Raw workflow response:', JSON.stringify(data, null, 2))

    // Parse agent output if it's a JSON string
    let agentOutput = data
    if (typeof data === 'string') {
      try {
        agentOutput = JSON.parse(data)
      } catch {
        agentOutput = { message: data }
      }
    }

    // Check if data is already in the correct format (choices array)
    if (agentOutput.choices && Array.isArray(agentOutput.choices)) {
      console.log('✅ Response already in correct format')
      return NextResponse.json(agentOutput)
    }

    // Transform agent response to frontend format
    const transformedResponse = {
      choices: [{
        message: {
          content: agentOutput.message || agentOutput.response || 'I received your message.',
          tool_calls: [{
            function: {
              result: agentOutput
            }
          }]
        }
      }]
    }

    console.log('✅ Transformed to frontend format')
    return NextResponse.json(transformedResponse)
  } catch (error: any) {
    console.error('Agent API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

