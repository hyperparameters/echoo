"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { N8nChat } from "@/components/n8n-chat";

export default function AgentPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("echooUser");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.fullName);
      }
    }
  }, []);

  // TODO: Replace with your actual n8n webhook URL
  const webhookUrl =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "YOUR_N8N_WEBHOOK_URL";

  return (
    <AppLayout>
      <N8nChat webhookUrl={webhookUrl} userName={userName} />
    </AppLayout>
  );
}
