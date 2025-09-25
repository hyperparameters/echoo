# Chat Custom Components

This directory contains custom components for rendering specialized JSON responses in the N8nChat component.

## Components

### PlatformTrendsComponent

Renders platform trends data with:

- Platform-specific icons and styling
- Organized trend cards with titles and descriptions
- Personalized recommendations section
- Responsive grid layout

### PostSuggestionsComponent

Renders post suggestions with:

- Image display with fallback
- Copy-to-clipboard functionality for captions and hashtags
- Interactive hashtag badges
- Action buttons (Like, Share, Save)

## Supported JSON Response Types

### 1. Platform Trends Response

```json
{
  "output": {
    "platform_trends": [
      {
        "platform": "Instagram",
        "trends": [
          {
            "title": "Instagram Reels Boom",
            "description": "Short-form video is dominating..."
          }
        ]
      }
    ],
    "personalized_trends": [
      {
        "title": "Leverage Short-Form Video",
        "description": "Since short-form video is trending..."
      }
    ]
  }
}
```

### 2. Post Suggestions Response

```json
{
  "output": {
    "post_suggestions": [
      {
        "image_link": "https://example.com/image.jpg",
        "image_id": "48",
        "generated_caption": "Your caption here...",
        "generated_hashtags": "#hashtag1 #hashtag2 #hashtag3"
      }
    ]
  }
}
```

## Usage

The N8nChat component automatically detects these JSON response types and renders the appropriate custom component. No additional configuration is required.

## Features

- **Automatic Detection**: The chat component automatically detects and parses JSON responses
- **Fallback Support**: If JSON parsing fails, it falls back to regular text rendering
- **Interactive Elements**: Copy buttons, clickable hashtags, and action buttons
- **Responsive Design**: Components adapt to different screen sizes
- **Error Handling**: Graceful fallbacks for missing images or malformed data
