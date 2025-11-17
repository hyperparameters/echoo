"use client";

import { AppLayout } from "@/components/app-layout";
import { AgentChat } from "@/components/agent-chat";
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

  // OpenServ Platform API configuration
  const agentUrl =
    process.env.NEXT_PUBLIC_OPENSERV_API_URL || "https://api.openserv.ai";
  const agentId = process.env.NEXT_PUBLIC_OPENSERV_AGENT_ID;
  const openservApiKey = process.env.NEXT_PUBLIC_OPENSERV_API_KEY;

  return (
    <AppLayout>
      <AgentChat 
        agentUrl={agentUrl} 
        userName={userName} 
        user_id={userId}
        agentId={agentId}
        openservApiKey={openservApiKey}
      />
    </AppLayout>
  );
}
