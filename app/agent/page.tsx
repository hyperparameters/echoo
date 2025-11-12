"use client";

import { AppLayout } from "@/components/app-layout";
import { N8nChat } from "@/components/n8n-chat";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api/auth";

export default function AgentPage() {
  const { user: privyUser, authenticated } = usePrivy();
  const [backendUser, setBackendUser] = useState<any>(null);

  useEffect(() => {
    if (authenticated) {
      authApi.getProfile()
        .then(setBackendUser)
        .catch(console.error);
    }
  }, [authenticated]);

  const userName = backendUser?.username || privyUser?.email?.address?.split('@')[0] || "User";
  const userId = backendUser?.id;

  const webhookUrl =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "YOUR_N8N_WEBHOOK_URL";

  return (
    <AppLayout>
      <N8nChat webhookUrl={webhookUrl} userName={userName} user_id={userId} />
    </AppLayout>
  );
}
