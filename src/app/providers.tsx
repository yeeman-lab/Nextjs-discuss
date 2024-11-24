"use client";

import { SessionProvider } from "next-auth/react";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "./AppInsights";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <SessionProvider>{children}</SessionProvider>
    </AppInsightsContext.Provider>
  );
}
