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

  const getDisplayUsername = () => {
    // If backend has a username and it's NOT a privy ID, use it
    if (backendUser?.username && !backendUser.username.startsWith('did:privy:')) {
      return backendUser.username;
    }
    // Fallback to email address from Privy
    if (privyUser?.email?.address) {
      return privyUser.email.address.split('@')[0];
    }
    // Fallback to "User"
    return "User";
  };
  const userName = getDisplayUsername();
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
