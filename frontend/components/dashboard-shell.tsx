import { AgentFlowProvider } from "@/components/agents/agent-flow-provider";
import { AppSidebar } from "@/components/app-sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AgentFlowProvider>
      <div className="dark flex h-dvh w-full overflow-hidden bg-background text-foreground">
        <AppSidebar />
        {children}
      </div>
    </AgentFlowProvider>
  );
}
