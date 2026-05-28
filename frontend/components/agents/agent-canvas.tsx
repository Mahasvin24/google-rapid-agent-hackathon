"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Background,
  BackgroundVariant,
  type Node,
  type NodeMouseHandler,
  type OnInit,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AgentNode, type AgentNodeData } from "@/components/agents/agent-node";
import { FlowingEdge } from "@/components/agents/flowing-edge";
import { useAgentFlow } from "@/components/agents/agent-flow-provider";
import { layoutEdges } from "@/lib/agent-flow";

const nodeTypes = { agent: AgentNode };
const edgeTypes = { flowing: FlowingEdge };

function AgentCanvasInner() {
  const router = useRouter();
  const {
    nodes,
    onNodesChange,
    edges: seedEdges,
    viewport,
    setViewport,
    needsFitView,
    markFitViewDone,
  } = useAgentFlow();

  const edges = useMemo(() => layoutEdges(nodes, seedEdges), [nodes, seedEdges]);

  const onInit: OnInit<Node<AgentNodeData>> = useCallback(
    (instance) => {
      if (needsFitView) {
        instance.fitView({ padding: 0.35 });
        setViewport(instance.getViewport());
        markFitViewDone();
      }
    },
    [needsFitView, markFitViewDone, setViewport]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (node.data.role === "qna") {
        router.push("/chat");
      }
    },
    [router]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      viewport={viewport}
      onViewportChange={setViewport}
      onNodeClick={onNodeClick}
      onInit={onInit}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={0.25}
      maxZoom={1.75}
      panOnScroll={false}
      zoomOnScroll
      zoomOnPinch
      panOnDrag
      nodesDraggable
      nodeDragThreshold={2}
      nodesConnectable={false}
      selectNodesOnDrag={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
      className="agent-canvas h-full w-full"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={22}
        size={2}
        color="rgba(255, 255, 255, 0.28)"
      />
    </ReactFlow>
  );
}

export function AgentCanvas() {
  return (
    <div className="relative h-full min-h-0 min-w-0 flex-1">
      <ReactFlowProvider>
        <div className="h-full w-full">
          <AgentCanvasInner />
        </div>
      </ReactFlowProvider>
    </div>
  );
}
