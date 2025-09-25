# n8n Chat Integration Setup Guide

## Overview

This guide will help you set up the n8n chat integration for your Echoo app. The integration maintains your existing UI design while connecting to n8n workflows for AI-powered responses.

## Prerequisites

1. An n8n instance (cloud or self-hosted)
2. A workflow with a Chat Trigger node
3. Your domain added to the Chat Trigger's CORS settings

## Step 1: Create n8n Workflow

1. **Create a new workflow** in your n8n instance
2. **Add a Chat Trigger node** as the first node
3. **Configure the Chat Trigger node:**
   - Add your domain to the "Allowed Origins (CORS)" field
   - Enable "Streaming response" if you want real-time responses
   - Set the response mode to "Streaming" or "Standard"

## Step 2: Configure the Workflow

Your workflow should handle the following payload structure:

```json
{
  "action": "sendMessage",
  "chatInput": "User's message content",
  "sessionId": "unique_session_id",
  "metadata": {
    "files": [],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Replace with your actual n8n webhook URL
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://yourname.app.n8n.cloud/webhook/your-webhook-id
```

## Step 4: Test the Integration

1. Start your development server: `pnpm dev`
2. Navigate to the agent page
3. Send a test message
4. Check the n8n workflow execution logs

## Workflow Response Format

Your n8n workflow should return a response in this format:

```json
{
  "response": "AI response text",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
```

## Features Included

✅ **Maintains existing UI design** - All your current styling is preserved
✅ **Session management** - Each chat session has a unique ID
✅ **File upload support** - Metadata about uploaded files is sent to n8n
✅ **Suggestion chips** - AI can provide clickable suggestions
✅ **Typing indicators** - Shows when AI is processing
✅ **Error handling** - Graceful fallback for connection issues
✅ **Auto-scroll** - Messages automatically scroll to bottom

## Customization

The chat component accepts these props:

- `webhookUrl`: Your n8n webhook URL
- `userName`: User's name for personalization
- `className`: Additional CSS classes

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your domain is added to the Chat Trigger's CORS settings
2. **404 Errors**: Verify your webhook URL is correct
3. **No Response**: Check that your workflow is active and the Chat Trigger is properly configured

### Debug Mode:

Check the browser console for detailed error messages and network requests.

## Next Steps

1. Set up your n8n workflow with AI nodes
2. Configure the webhook URL in your environment variables
3. Test the integration
4. Customize the AI responses based on your use case

For more information about n8n workflows, visit the [n8n documentation](https://docs.n8n.io/).
