"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { PromptInputBox } from "@/components/prompt-input-box";
import { PostSuggestionsComponent } from "@/components/chat/PostSuggestionsComponent";
import { TrendsComponent } from "@/components/chat/TrendsComponent";
import { EventSelectionComponent } from "@/components/chat/EventSelectionComponent";
import { Plus, MessageSquare, Calendar } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { eventsApi } from "@/lib/api/events";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentChatProps {
  agentUrl: string; // Now expects OpenServ Platform API URL
  userName?: string;
  className?: string;
  user_id: number | undefined;
  agentId?: string; // OpenServ Agent ID
  openservApiKey?: string; // OpenServ API Key
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  customComponent?: "post_suggestions" | "trends" | "event_selection" | null;
  customData?: any;
}

export function AgentChat({
  agentUrl,
  userName,
  className,
  user_id,
  agentId,
  openservApiKey,
}: AgentChatProps) {
  const { getAccessToken } = usePrivy();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // localStorage keys
  const SESSION_KEY = "echoo_chat_session_id";
  const MESSAGES_KEY = "echoo_chat_messages";
  const SELECTED_EVENT_KEY = "echoo_selected_event_id";

  // Fetch registered events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user_id) return;
      
      try {
        setIsLoadingEvents(true);
        const events = await eventsApi.getRegisteredEvents();
        // Map events to a consistent structure (RegisteredEventResponse uses event_id, event_name)
        const mappedEvents = events.map((e: any) => ({
          id: e.event_id || e.id,
          name: e.event_name || e.name,
          description: e.event_description || e.description,
          location: e.event_location || e.location,
          start_date: e.event_date || e.start_date,
          end_date: e.end_date,
          category: e.event_category || e.category
        })).filter((e: any) => e.id != null);
        
        setRegisteredEvents(mappedEvents);
        
        // Restore selected event from localStorage
        const savedEventId = localStorage.getItem(SELECTED_EVENT_KEY);
        if (savedEventId && mappedEvents.some((e: any) => String(e.id) === savedEventId)) {
          setSelectedEventId(savedEventId);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
        setRegisteredEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [user_id]);

  // Helper function to detect and parse custom JSON responses
  const parseCustomResponse = (response: any) => {
    try {
      // Parse if response is a JSON string (agent capabilities return strings)
      let data = response;
      if (typeof response === "string") {
        try {
          data = JSON.parse(response);
        } catch {
          return null;
        }
      }

      // Check if data has the expected structure
      if (data && typeof data === "object") {
        let output = data?.output || data;

        // Handle nested structure like { foo: { profile: {...}, success: true } }
        if (output?.foo && typeof output.foo === 'object') {
          output = output.foo;
        }

        // Check for post suggestions response
        if (output?.post_suggestions && Array.isArray(output?.post_suggestions)) {
          return {
            customComponent: "post_suggestions" as const,
            customData: output,
          };
        }

        // Check for trends response
        if (output?.platform_trends || output?.personalized_trends) {
          return {
            customComponent: "trends" as const,
            customData: output,
          };
        }

        // Check for event selection response
        if (output?.events_for_selection && Array.isArray(output?.events_for_selection)) {
          return {
            customComponent: "event_selection" as const,
            customData: output,
          };
        }

        // Check for normal response format: { "output": "{\"response\": \"message\"}" }
        if (response?.output && typeof response?.output === "string") {
          try {
            const parsedOutput = JSON.parse(response.output);
            if (
              parsedOutput?.response &&
              typeof parsedOutput.response === "string"
            ) {
              return {
                customComponent: null,
                customData: null,
                normalResponse: parsedOutput.response,
              };
            }
          } catch (parseError) {
            // If parsing fails, treat as regular string response
            return {
              customComponent: null,
              customData: null,
              normalResponse: response.output,
            };
          }
        }

        // Check if output is a string directly
        if (output && typeof output === "string") {
          try {
            // Try parsing as JSON string
            const parsed = JSON.parse(output);
            if (parsed?.response) {
              return {
                customComponent: null,
                customData: null,
                normalResponse: parsed.response,
              };
            }
          } catch {
            // Not JSON, return as-is
            return {
              customComponent: null,
              customData: null,
              normalResponse: output,
            };
          }
        }

        // Check for direct response field
        if (output?.response && typeof output.response === "string") {
          return {
            customComponent: null,
            customData: null,
            normalResponse: output.response,
          };
        }

        // Check for message field
        if (output?.message && typeof output.message === "string") {
          return {
            customComponent: null,
            customData: null,
            normalResponse: output.message,
          };
        }

        if (response?.response && typeof response?.response === "string") {
          return null;
        }
      }

      // Check if it's an array with the expected structure
      if (Array.isArray(response) && response.length > 0) {
        const firstItem = response[0];
        if (firstItem && typeof firstItem === "object" && firstItem.output) {
          return parseCustomResponse(firstItem.output);
        }
      }

      return null;
    } catch (error) {
      console.error("Error parsing custom response:", error);
      return null;
    }
  };

  // Helper functions for localStorage
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const loadFromLocalStorage = (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return null;
    }
  };

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(MESSAGES_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  // Initialize session ID and load messages from localStorage
  useEffect(() => {
    const savedSessionId = loadFromLocalStorage(SESSION_KEY);
    const savedMessages = loadFromLocalStorage(MESSAGES_KEY);

    if (savedSessionId && savedMessages) {
      // Restore existing session
      setSessionId(savedSessionId);
      setMessages(
        savedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    } else {
      // Create new session
      const newSessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setSessionId(newSessionId);
      saveToLocalStorage(SESSION_KEY, newSessionId);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveToLocalStorage(MESSAGES_KEY, messages);
    }
  }, [messages]);

  // Initialize with welcome message only if no messages exist
  useEffect(() => {
    if (userName && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "ai",
        content: `Hi ${userName}! I'm Echoo, your AI assistant for discovering and sharing event photos. I can help you find AI-matched photos from events you attended, create engaging captions, and build content strategies. What would you like to explore?`,
        timestamp: new Date(),
        suggestions: [
          "Suggest a post for my last event",
          "What's trending on Instagram?",
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [userName, messages.length]);

  // Get callback configuration from environment variables
  const CALLBACK_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_CALLBACK_TIMEOUT || '60000');
  const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_CALLBACK_POLL_INTERVAL || '1000');
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const sendMessageToAgent = async (content: string, files?: File[], extraParams?: { eventId?: string }) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Auto-detect if this is a post suggestion request and use selected event
    const isPostSuggestion = content.toLowerCase().includes("suggest a post") || 
                            content.toLowerCase().includes("create a post") ||
                            content.toLowerCase().includes("generate post");
    
    // Use selected event if it's a post suggestion and no eventId is explicitly provided
    const eventIdToUse = extraParams?.eventId || (isPostSuggestion && selectedEventId ? selectedEventId : undefined);
    
    if (eventIdToUse) {
      console.log('[AgentChat] Using event context:', eventIdToUse);
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: "user",
      content:
        files && files.length > 0
          ? `${content} [${files.length} file(s) attached]`
          : content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Generate a unique ID for this request
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Get Privy access token
      const authToken = await getAccessToken();

      if (!authToken) {
        throw new Error("No authentication token available");
      }

      // Prepare payload for OpenServ Agent SDK
      const payload = {
        agentId,
        type: 'respond-chat-message',
        messages: [...messages, userMessage].map(msg => ({
          author: msg.type === 'user' ? 'user' : 'assistant',
          message: msg.content
        })),
        metadata: {
          user_id: user_id,
          auth_token: await getAccessToken(),
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          callback_url: `${APP_URL}/api/callback?id=${requestId}`,
          ...(eventIdToUse && { eventId: eventIdToUse })
        },
        // Pass eventId as args for the capability
        ...(eventIdToUse && { 
          args: { 
            eventId: eventIdToUse,
            userId: user_id?.toString() || "1",
            chatInput: content
          } 
        })
      };

      // Call OpenServ API through our proxy
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          ...(openservApiKey && { 'x-openserv-key': openservApiKey })
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`
        );
      }

      // Start polling for the callback
      const callbackData = await new Promise<any>((resolve, reject) => {
        const startTime = Date.now();

        const checkCallback = async () => {
          try {
            const checkResponse = await fetch(`/api/callback?id=${requestId}`);
            if (checkResponse.ok) {
              const data = await checkResponse.json();
              if (data.output) {
                resolve(data.output);
                return;
              }
            }

            // Check if timed out
            if (Date.now() - startTime > CALLBACK_TIMEOUT) {
              reject(new Error(`Timeout after ${CALLBACK_TIMEOUT / 1000}s waiting for response`));
              return;
            }

            // Poll again after configured interval
            setTimeout(checkCallback, POLL_INTERVAL);
          } catch (err) {
            reject(err);
          }
        };

        // Start polling
        checkCallback();
      });

      // Process the callback data
      console.log('[AgentChat] Raw callback data:', callbackData);
      const customResponse = parseCustomResponse({ output: callbackData });
      console.log('[AgentChat] Parsed response:', customResponse);

      // Determine what to display
      let displayContent: string;
      if (customResponse?.normalResponse) {
        displayContent = customResponse.normalResponse;
      } else if (customResponse?.customComponent) {
        // Custom component will handle display
        displayContent = "Here's your response:";
      } else if (typeof callbackData === 'string') {
        displayContent = callbackData;
      } else if (callbackData && typeof callbackData === 'object') {
        // Try to extract a meaningful message from the object
        displayContent = callbackData.message || callbackData.response || JSON.stringify(callbackData, null, 2);
      } else {
        displayContent = "I've processed your request.";
      }

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: "ai",
        content: displayContent,
        timestamp: new Date(),
        suggestions: [],
        customComponent: customResponse?.customComponent,
        customData: customResponse?.customData,
      };

      console.log('[AgentChat] Adding message:', aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in agent communication:", error);

      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: "ai",
        content: `I'm having trouble processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        suggestions: ["Try again", "Check connection"],
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    // If it's the "Suggest a post for my last event" suggestion, check if event is selected
    if (suggestion === "Suggest a post for my last event" || suggestion.toLowerCase().includes("suggest a post")) {
      if (!selectedEventId) {
        // No event selected, show error message
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          type: "ai",
          content: "Please select an event from the dropdown above before generating post suggestions.",
          timestamp: new Date(),
          suggestions: [],
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }
      
      // Event is selected, send directly to agent with eventId
      sendMessageToAgent(suggestion, undefined, { eventId: selectedEventId });
    } else {
      // For other suggestions, send directly to agent
      sendMessageToAgent(suggestion);
    }
  };

  const handleEventSelect = (eventId: string) => {
    console.log('[AgentChat] Event selected:', eventId);
    setSelectedEventId(eventId);
    localStorage.setItem(SELECTED_EVENT_KEY, eventId);
    
    // Show confirmation message
    const selectedEvent = registeredEvents.find((e: any) => String(e.id) === eventId);
    if (selectedEvent) {
      const confirmationMessage: ChatMessage = {
        id: `event_selected_${Date.now()}`,
        type: "ai",
        content: `✅ Event context set to: **${selectedEvent.name}**\n\nAll post suggestions will now use photos and context from this event.`,
        timestamp: new Date(),
        suggestions: [],
      };
      setMessages((prev) => [...prev, confirmationMessage]);
    }
  };

  const startNewChat = () => {
    // Clear localStorage
    clearLocalStorage();

    // Create new session ID
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setSessionId(newSessionId);
    saveToLocalStorage(SESSION_KEY, newSessionId);

    // Clear messages
    setMessages([]);

    // The welcome message will be added automatically by the useEffect
  };

  return (
    <div
      ref={chatContainerRef}
      className={`flex flex-col min-h-[calc(100vh-80px)] ${className || ""}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary/30 to-brand-accent/30 flex items-center justify-center">
              <Logo variant="icon" width={56} height={56} className="text-white" />
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-white">
                  Echoo AI Assistant
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Online</span>
                </div>
              </div>
              {/* Event Selection Dropdown */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Select
                  value={selectedEventId}
                  onValueChange={handleEventSelect}
                  disabled={isLoadingEvents || registeredEvents.length === 0}
                >
                  <SelectTrigger className="w-[200px] border-white/20 bg-black/50 text-white hover:bg-white/10">
                    <SelectValue placeholder={isLoadingEvents ? "Loading events..." : registeredEvents.length === 0 ? "No events" : "Select event"} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20 text-white">
                    {registeredEvents
                      .filter((event: any) => event && event.id != null)
                      .map((event: any) => (
                        <SelectItem 
                          key={event.id} 
                          value={String(event.id)}
                          className="text-white hover:bg-white/10 focus:bg-white/10"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{event.name || 'Unnamed Event'}</span>
                            {event.location && (
                              <span className="text-xs text-gray-400">{event.location}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button
            onClick={startNewChat}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-white/20 hover:border-white/40 bg-black/50 hover:bg-white/10 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Transform your photos into viral social media posts
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-black">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"
                }`}
            >
              <Card
                className={`${message.type === "user"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none"
                  : "bg-gray-900/80 border-white/10 backdrop-blur-sm"
                  }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-line text-white">
                    {message.content}
                  </p>

                  {/* Custom Component Rendering */}
                  {message.type === "ai" &&
                    message.customComponent &&
                    message.customData && (
                      <div className="mt-4">
                        {message.customComponent === "post_suggestions" && (
                          <PostSuggestionsComponent data={message.customData} />
                        )}
                        {message.customComponent === "trends" && (
                          <TrendsComponent data={message.customData} />
                        )}
                        {message.customComponent === "event_selection" && (
                          <EventSelectionComponent 
                            data={message.customData} 
                            onEventSelect={(eventId) => {
                              // Send a message with the selected eventId
                              sendMessageToAgent(`Suggest a post for event ${eventId}`, undefined, { eventId });
                            }}
                            isLoading={isTyping}
                          />
                        )}
                      </div>
                    )}

                  <p
                    className="text-xs mt-2 text-gray-400"
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              {message.type === "ai" &&
                message.suggestions &&
                message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer border-white/20 hover:border-white/40 hover:bg-white/10 mr-2 mb-2 text-white hover:text-white transition-colors duration-200"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <Card className="glass-card border-border/50">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-brand-accent rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50">
        <PromptInputBox
          onSend={sendMessageToAgent}
          isLoading={isTyping}
          placeholder="Ask me anything about your event photos..."
        />
      </div>
    </div>
  );
}
