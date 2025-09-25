"use client";

import { AppLayout } from "@/components/app-layout";
import { N8nChat } from "@/components/n8n-chat";
import { useAuth } from "@/stores/authStore";

export default function AgentPage() {
  const { user } = useAuth();
  const userName = user?.username || "User";

  const webhookUrl =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "YOUR_N8N_WEBHOOK_URL";

  return (
    <AppLayout>
      <N8nChat webhookUrl={webhookUrl} userName={userName} />
    </AppLayout>
  );
}
