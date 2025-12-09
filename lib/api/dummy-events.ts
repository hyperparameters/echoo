import type { EventResponse, RegisteredEventResponse, EventMatchedImageResponse } from './types';

export const dummyEvents: EventResponse[] = [
  {
    id: 1,
    name: "Tech Innovation Summit 2024",
    description: "Join industry leaders and innovators for a day of cutting-edge technology discussions, workshops, and networking opportunities.",
    cover_image_url: "/placeholder.jpg",
    cover_image_height: 400,
    cover_image_width: 800,
    event_date: "2024-12-15T09:00:00Z",
    fotoowl_event_id: 1001,
    fotoowl_event_key: "tech-summit-2024",
    location: "San Francisco Convention Center",
    category: "Technology",
    registered: false,
    created_at: "2024-11-01T10:00:00Z",
    updated_at: "2024-11-15T14:30:00Z"
  },
  {
    id: 2,
    name: "Digital Marketing Masterclass",
    description: "Learn the latest digital marketing strategies from top experts in the field. Perfect for marketers and business owners.",
    cover_image_url: "/placeholder.jpg",
    cover_image_height: 400,
    cover_image_width: 800,
    event_date: "2024-12-20T14:00:00Z",
    fotoowl_event_id: 1002,
    fotoowl_event_key: "marketing-masterclass",
    location: "New York Marriott Marquis",
    category: "Marketing",
    registered: false,
    created_at: "2024-11-05T09:15:00Z",
    updated_at: "2024-11-18T16:45:00Z"
  },
  {
    id: 3,
    name: "AI & Machine Learning Conference",
    description: "Explore the latest advancements in artificial intelligence and machine learning with hands-on workshops and expert panels.",
    cover_image_url: "/placeholder.jpg",
    cover_image_height: 400,
    cover_image_width: 800,
    event_date: "2025-01-10T09:00:00Z",
    fotoowl_event_id: 1003,
    fotoowl_event_key: "ai-ml-conference",
    location: "MIT Campus, Cambridge",
    category: "Technology",
    registered: true,
    created_at: "2024-11-10T11:30:00Z",
    updated_at: "2024-11-20T12:00:00Z"
  },
  {
    id: 4,
    name: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to top venture capitalists and angel investors. Network with entrepreneurs.",
    cover_image_url: "/placeholder.jpg",
    cover_image_height: 400,
    cover_image_width: 800,
    event_date: "2024-12-08T18:00:00Z",
    fotoowl_event_id: 1004,
    fotoowl_event_key: "startup-pitch-night",
    location: "Silicon Valley Innovation Hub",
    category: "Business",
    registered: false,
    created_at: "2024-11-12T13:20:00Z",
    updated_at: "2024-11-22T10:15:00Z"
  },
  {
    id: 5,
    name: "Creative Design Workshop",
    description: "Unleash your creativity in this hands-on design workshop covering UI/UX, graphic design, and creative thinking.",
    cover_image_url: "/placeholder.jpg",
    cover_image_height: 400,
    cover_image_width: 800,
    event_date: "2024-12-12T10:00:00Z",
    fotoowl_event_id: 1005,
    fotoowl_event_key: "design-workshop",
    location: "Design District, Los Angeles",
    category: "Design",
    registered: true,
    created_at: "2024-11-08T15:45:00Z",
    updated_at: "2024-11-19T09:30:00Z"
  },
  {
    id: 6,
    name: "Sustainable Business Forum",
    description: "Discover how businesses can implement sustainable practices while maintaining profitability and growth.",
    cover_image_url: "/placeholder.jpg",
    cover_image_height: 400,
    cover_image_width: 800,
    event_date: "2025-01-15T13:00:00Z",
    fotoowl_event_id: 1006,
    fotoowl_event_key: "sustainable-business",
    location: "Green Business Center, Seattle",
    category: "Sustainability",
    registered: false,
    created_at: "2024-11-14T08:00:00Z",
    updated_at: "2024-11-21T14:20:00Z"
  }
];

// Dummy registered events data
export const dummyRegisteredEvents: RegisteredEventResponse[] = [
  {
    registration_id: 1,
    request_id: 1001,
    request_key: "req-tech-summit-001",
    redirect_url: "https://fotoowl.example.com/redirect/tech-summit-001",
    registration_created_at: "2024-11-15T10:30:00Z",
    event_id: 3,
    event_name: "AI & Machine Learning Conference",
    event_description: "Explore the latest advancements in artificial intelligence and machine learning with hands-on workshops and expert panels.",
    event_cover_image_url: "/placeholder.jpg",
    event_cover_image_height: 400,
    event_cover_image_width: 800,
    event_location: "MIT Campus, Cambridge",
    event_category: "Technology",
    event_date: "2025-01-10T09:00:00Z",
    fotoowl_event_id: 1003,
    fotoowl_event_key: "ai-ml-conference"
  },
  {
    registration_id: 2,
    request_id: 1002,
    request_key: "req-design-workshop-002",
    redirect_url: "https://fotoowl.example.com/redirect/design-workshop-002",
    registration_created_at: "2024-11-18T14:15:00Z",
    event_id: 5,
    event_name: "Creative Design Workshop",
    event_description: "Unleash your creativity in this hands-on design workshop covering UI/UX, graphic design, and creative thinking.",
    event_cover_image_url: "/placeholder.jpg",
    event_cover_image_height: 400,
    event_cover_image_width: 800,
    event_location: "Design District, Los Angeles",
    event_category: "Design",
    event_date: "2024-12-12T10:00:00Z",
    fotoowl_event_id: 1005,
    fotoowl_event_key: "design-workshop"
  }
];

// In-memory storage for dynamic registered events (for testing registration functionality)
let dynamicRegisteredEvents: RegisteredEventResponse[] = [...dummyRegisteredEvents];

export const addRegisteredEvent = (eventId: number, event: EventResponse): RegisteredEventResponse => {
  const newRegisteredEvent: RegisteredEventResponse = {
    registration_id: dynamicRegisteredEvents.length + 1,
    request_id: 2000 + dynamicRegisteredEvents.length + 1,
    request_key: `req-dynamic-${Date.now()}`,
    redirect_url: `https://fotoowl.example.com/redirect/event-${eventId}`,
    registration_created_at: new Date().toISOString(),
    event_id: event.id,
    event_name: event.name,
    event_description: event.description || "",
    event_cover_image_url: event.cover_image_url || "/placeholder.jpg",
    event_cover_image_height: event.cover_image_height,
    event_cover_image_width: event.cover_image_width,
    event_location: event.location,
    event_category: event.category,
    event_date: event.event_date || "",
    fotoowl_event_id: event.fotoowl_event_id || 0,
    fotoowl_event_key: event.fotoowl_event_key || ""
  };
  
  dynamicRegisteredEvents.push(newRegisteredEvent);
  return newRegisteredEvent;
};

export const getRegisteredEvents = (): RegisteredEventResponse[] => {
  return dynamicRegisteredEvents;
};

// Dummy matched images data for gallery functionality
export const dummyMatchedImages: EventMatchedImageResponse[] = [
  {
    id: 1,
    name: "tech-summit-001.jpg",
    user_id: 1,
    fotoowl_image_id: 1001,
    fotoowl_url: "https://fotoowl.example.com/images/1001",
    filecoin_url: "https://filecoin.example.com/ipfs/QmTech1",
    filecoin_cid: "QmTech1",
    size: 2048576,
    height: 1080,
    width: 1920,
    description: "Keynote speaker at Tech Innovation Summit",
    image_encoding: "jpeg",
    event_id: 1,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-15T10:30:00Z",
    updated_at: "2024-11-15T10:30:00Z"
  },
  {
    id: 2,
    name: "tech-summit-002.jpg",
    user_id: 2,
    fotoowl_image_id: 1002,
    fotoowl_url: "https://fotoowl.example.com/images/1002",
    filecoin_url: "https://filecoin.example.com/ipfs/QmTech2",
    filecoin_cid: "QmTech2",
    size: 1536000,
    height: 1350,
    width: 1080,
    description: "Networking session during Tech Summit",
    image_encoding: "jpeg",
    event_id: 1,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-15T11:15:00Z",
    updated_at: "2024-11-15T11:15:00Z"
  },
  {
    id: 3,
    name: "marketing-workshop-001.jpg",
    user_id: 1,
    fotoowl_image_id: 1003,
    fotoowl_url: "https://fotoowl.example.com/images/1003",
    filecoin_url: "https://filecoin.example.com/ipfs/QmMarket1",
    filecoin_cid: "QmMarket1",
    size: 3072000,
    height: 1200,
    width: 1600,
    description: "Digital marketing presentation slides",
    image_encoding: "jpeg",
    event_id: 2,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-18T14:30:00Z",
    updated_at: "2024-11-18T14:30:00Z"
  },
  {
    id: 4,
    name: "ai-conference-001.jpg",
    user_id: 3,
    fotoowl_image_id: 1004,
    fotoowl_url: "https://fotoowl.example.com/images/1004",
    filecoin_url: "https://filecoin.example.com/ipfs/QmAI1",
    filecoin_cid: "QmAI1",
    size: 2560000,
    height: 1080,
    width: 1920,
    description: "AI workshop hands-on session",
    image_encoding: "jpeg",
    event_id: 3,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-20T09:45:00Z",
    updated_at: "2024-11-20T09:45:00Z"
  },
  {
    id: 5,
    name: "ai-conference-002.jpg",
    user_id: 4,
    fotoowl_image_id: 1005,
    fotoowl_url: "https://fotoowl.example.com/images/1005",
    filecoin_url: "https://filecoin.example.com/ipfs/QmAI2",
    filecoin_cid: "QmAI2",
    size: 1800000,
    height: 1350,
    width: 1080,
    description: "Panel discussion on machine learning ethics",
    image_encoding: "jpeg",
    event_id: 3,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-20T11:20:00Z",
    updated_at: "2024-11-20T11:20:00Z"
  },
  {
    id: 6,
    name: "ai-conference-003.jpg",
    user_id: 5,
    fotoowl_image_id: 1006,
    fotoowl_url: "https://fotoowl.example.com/images/1006",
    filecoin_url: "https://filecoin.example.com/ipfs/QmAI3",
    filecoin_cid: "QmAI3",
    size: 2200000,
    height: 1080,
    width: 1920,
    description: "AI demo showcase and exhibition",
    image_encoding: "jpeg",
    event_id: 3,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-20T14:10:00Z",
    updated_at: "2024-11-20T14:10:00Z"
  },
  {
    id: 7,
    name: "design-workshop-001.jpg",
    user_id: 2,
    fotoowl_image_id: 1007,
    fotoowl_url: "https://fotoowl.example.com/images/1007",
    filecoin_url: "https://filecoin.example.com/ipfs/QmDesign1",
    filecoin_cid: "QmDesign1",
    size: 1700000,
    height: 1200,
    width: 1600,
    description: "UI/UX design sketching session",
    image_encoding: "jpeg",
    event_id: 5,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-19T10:00:00Z",
    updated_at: "2024-11-19T10:00:00Z"
  },
  {
    id: 8,
    name: "design-workshop-002.jpg",
    user_id: 1,
    fotoowl_image_id: 1008,
    fotoowl_url: "https://fotoowl.example.com/images/1008",
    filecoin_url: "https://filecoin.example.com/ipfs/QmDesign2",
    filecoin_cid: "QmDesign2",
    size: 1900000,
    height: 1080,
    width: 1920,
    description: "Design critique and feedback session",
    image_encoding: "jpeg",
    event_id: 5,
    image_url: "/placeholder.jpg",
    created_at: "2024-11-19T13:30:00Z",
    updated_at: "2024-11-19T13:30:00Z"
  }
];

// Function to get matched images for a specific event
export const getEventMatchedImages = (eventId: number): EventMatchedImageResponse[] => {
  return dummyMatchedImages.filter(image => image.event_id === eventId);
};
