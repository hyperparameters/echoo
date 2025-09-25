"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { PromptInputBox } from "@/components/prompt-input-box";
import { PlatformTrendsComponent } from "@/components/chat/PlatformTrendsComponent";
import { PostSuggestionsComponent } from "@/components/chat/PostSuggestionsComponent";

interface N8nChatProps {
  webhookUrl: string;
  userName?: string;
  className?: string;
}

interface N8nMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  customComponent?: "platform_trends" | "post_suggestions" | null;
  customData?: any;
}

export function N8nChat({ webhookUrl, userName, className }: N8nChatProps) {
  const [messages, setMessages] = useState<N8nMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to detect and parse custom JSON responses
  const parseCustomResponse = (response: any) => {
    try {
      // Check if response has the expected structure
      if (response && typeof response === "object") {
        // Check for platform trends response
        if (
          response?.output?.platform_trends &&
          Array.isArray(response?.output?.platform_trends)
        ) {
          return {
            customComponent: "platform_trends" as const,
            customData: response?.output,
          };
        }

        // Check for post suggestions response
        if (
          response?.output?.post_suggestions &&
          Array.isArray(response?.output?.post_suggestions)
        ) {
          return {
            customComponent: "post_suggestions" as const,
            customData: response?.output,
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

  // Initialize session ID
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (userName && messages.length === 0) {
      const welcomeMessage: N8nMessage = {
        id: "welcome",
        type: "ai",
        content: `Hi ${userName}! I'm your AI growth strategist. I can help you with content ideas, posting schedules, and growth strategies. What would you like to work on today?`,
        timestamp: new Date(),
        suggestions: [
          "Analyze my recent posts",
          "Suggest posting times",
          "Content ideas for this week",
          "Growth strategy tips",
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [userName, messages.length]);

  const sendMessageToN8n = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    const userMessage: N8nMessage = {
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

    try {
      const payload = {
        action: "sendMessage",
        chatInput: content,
        sessionId: sessionId,
        metadata: {
          user_id: 2,
          files: files
            ? files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
            : [],
          timestamp: new Date().toISOString(),
        },
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if this is a custom JSON response
      const customResponse = parseCustomResponse(data);

      const aiMessage: N8nMessage = {
        id: `ai_${Date.now()}`,
        type: "ai",
        content:
          customResponse?.normalResponse ||
          (customResponse ? "Here's your personalized content:" : null) ||
          data.response ||
          data.output ||
          "I received your message but couldn't process it properly.",
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        customComponent: customResponse?.customComponent,
        customData: customResponse?.customData,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to n8n:", error);

      // Fallback response
      const errorMessage: N8nMessage = {
        id: `error_${Date.now()}`,
        type: "ai",
        content:
          "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        suggestions: ["Try again", "Check connection"],
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessageToN8n(suggestion);
  };

  return (
    <div
      ref={chatContainerRef}
      className={`flex flex-col min-h-[calc(100vh-80px)] ${className || ""}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 flex items-center justify-center">
            <Logo variant="icon" width={56} height={56} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Echoo AI Assistant
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Your personal growth strategist
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.type === "user" ? "order-2" : "order-1"
              }`}
            >
              <Card
                className={`${
                  message.type === "user"
                    ? "bg-brand-gradient text-white border-none"
                    : "glass-card border-border/50"
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>

                  {/* Custom Component Rendering */}
                  {message.type === "ai" &&
                    message.customComponent &&
                    message.customData && (
                      <div className="mt-4">
                        {message.customComponent === "platform_trends" && (
                          <PlatformTrendsComponent data={message.customData} />
                        )}
                        {message.customComponent === "post_suggestions" && (
                          <PostSuggestionsComponent data={message.customData} />
                        )}
                      </div>
                    )}

                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user"
                        ? "text-white/70"
                        : "text-muted-foreground"
                    }`}
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
                        className="cursor-pointer border-border hover:border-brand-primary hover:bg-brand-primary/10 mr-2 mb-2 text-foreground hover:text-brand-primary"
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
          onSend={sendMessageToN8n}
          isLoading={isTyping}
          placeholder="Ask me anything about growing your influence..."
        />
      </div>
    </div>
  );
}
