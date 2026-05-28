"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useNodesState,
  type Node,
  type OnNodesChange,
  type Viewport,
} from "@xyflow/react";
import type { AgentNodeData } from "@/components/agents/agent-node";
import { initialEdges, initialNodes } from "@/lib/agents";

type AgentFlowContextValue = {
  nodes: Node<AgentNodeData>[];
  onNodesChange: OnNodesChange<Node<AgentNodeData>>;
  edges: typeof initialEdges;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  needsFitView: boolean;
  markFitViewDone: () => void;
};

const AgentFlowContext = createContext<AgentFlowContextValue | null>(null);

export function AgentFlowProvider({ children }: { children: ReactNode }) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [needsFitView, setNeedsFitView] = useState(true);

  const markFitViewDone = useCallback(() => {
    setNeedsFitView(false);
  }, []);

  const value = useMemo(
    () => ({
      nodes,
      onNodesChange,
      edges: initialEdges,
      viewport,
      setViewport,
      needsFitView,
      markFitViewDone,
    }),
    [nodes, onNodesChange, viewport, needsFitView, markFitViewDone]
  );

  return (
    <AgentFlowContext.Provider value={value}>
      {children}
    </AgentFlowContext.Provider>
  );
}

export function useAgentFlow() {
  const ctx = useContext(AgentFlowContext);
  if (!ctx) {
    throw new Error("useAgentFlow must be used within AgentFlowProvider");
  }
  return ctx;
}
