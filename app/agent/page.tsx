"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import { PromptInputBox } from "@/components/prompt-input-box";
import { Logo } from "@/components/logo";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("echooUser");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.fullName);

        // Initialize with welcome message
        const welcomeMessage: Message = {
          id: 1,
          type: "ai",
          content: `Hi ${user.fullName}! I'm your AI growth strategist. I can help you with content ideas, posting schedules, and growth strategies. What would you like to work on today?`,
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
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content:
        files && files.length > 0
          ? `${content} [${files.length} file(s) attached]`
          : content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();

    if (
      lowerInput.includes("content ideas") ||
      lowerInput.includes("content")
    ) {
      return {
        content:
          "Based on your interests in Fashion and Travel, here are some trending content ideas:\n\n• Outfit transitions in different cities\n• Local fashion finds while traveling\n• Behind-the-scenes of photoshoots\n• Style guides for different destinations\n\nThese types of posts typically get 40% more engagement than regular posts!",
        suggestions: [
          "Show me posting schedule",
          "Analyze my engagement",
          "More travel content ideas",
        ],
      };
    } else if (
      lowerInput.includes("posting times") ||
      lowerInput.includes("schedule")
    ) {
      return {
        content:
          "Based on your audience analysis, here are your optimal posting times:\n\n📅 Best Days: Tuesday, Thursday, Sunday\n⏰ Peak Hours: 7-9 AM, 12-2 PM, 7-9 PM\n🌍 Your audience is most active in IST timezone\n\nPosting during these windows can increase your reach by up to 60%!",
        suggestions: [
          "Create posting calendar",
          "Analyze my audience",
          "Content performance tips",
        ],
      };
    } else if (lowerInput.includes("analyze") || lowerInput.includes("posts")) {
      return {
        content:
          "I've analyzed your recent posts! Here's what I found:\n\n📈 Top performing content: Travel + Fashion combo\n💡 Engagement rate: 4.2% (above average!)\n🎯 Best hashtags: #fashiontravel #ootd #wanderlust\n\nYour sunset posts get 3x more likes than indoor shots. Consider more golden hour content!",
        suggestions: [
          "Hashtag recommendations",
          "Content calendar",
          "Engagement tips",
        ],
      };
    } else {
      return {
        content:
          "I'd be happy to help you with that! As your AI growth strategist, I can assist with:\n\n• Content strategy and ideas\n• Optimal posting schedules\n• Hashtag recommendations\n• Engagement analysis\n• Growth tactics\n\nWhat specific area would you like to focus on?",
        suggestions: [
          "Content ideas",
          "Posting schedule",
          "Growth tips",
          "Hashtag strategy",
        ],
      };
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col">
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
              {message.type === "ai" && message.suggestions && (
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
          onSend={handleSendMessage}
          isLoading={isTyping}
          placeholder="Ask me anything about growing your influence..."
        />
      </div>

      <BottomNavigation currentTab="agent" />
    </div>
  );
}
