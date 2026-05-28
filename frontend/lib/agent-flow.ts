import type { Edge, Node } from "@xyflow/react";
import type { AgentNodeData } from "@/components/agents/agent-node";

export type AgentStatus = "active" | "waiting" | "completed";

export type HandleSide = "top" | "right" | "bottom" | "left";

export const AGENT_NODE_WIDTH = 272;
export const AGENT_NODE_HEIGHT = 220;

const HANDLE_SIDES: HandleSide[] = ["top", "right", "bottom", "left"];

function getAnchor(
  position: { x: number; y: number },
  side: HandleSide,
  width = AGENT_NODE_WIDTH,
  height = AGENT_NODE_HEIGHT
) {
  switch (side) {
    case "top":
      return { x: position.x + width / 2, y: position.y };
    case "right":
      return { x: position.x + width, y: position.y + height / 2 };
    case "bottom":
      return { x: position.x + width / 2, y: position.y + height };
    case "left":
      return { x: position.x, y: position.y + height / 2 };
  }
}

function distance(
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/** Pick source/target handles that minimize connection length. */
export function getOptimalHandles(
  sourcePosition: { x: number; y: number },
  targetPosition: { x: number; y: number }
): { sourceHandle: HandleSide; targetHandle: HandleSide } {
  let best: { sourceHandle: HandleSide; targetHandle: HandleSide } = {
    sourceHandle: "right",
    targetHandle: "left",
  };
  let bestDist = Infinity;

  for (const sourceHandle of HANDLE_SIDES) {
    const sourceAnchor = getAnchor(sourcePosition, sourceHandle);
    for (const targetHandle of HANDLE_SIDES) {
      const targetAnchor = getAnchor(targetPosition, targetHandle);
      const dist = distance(sourceAnchor, targetAnchor);
      if (dist < bestDist) {
        bestDist = dist;
        best = { sourceHandle, targetHandle };
      }
    }
  }

  return best;
}

/**
 * Animate flow toward active agents. No flow into waiting targets.
 * Completed agents still emit flow to downstream nodes.
 */
export function shouldAnimateEdge(
  sourceStatus: AgentStatus,
  targetStatus: AgentStatus
): boolean {
  if (sourceStatus === "waiting") return false;
  if (sourceStatus === "completed") return true;
  return targetStatus === "active";
}

export type FlowingEdgeData = {
  animated: boolean;
};

export function layoutEdges(
  nodes: Node<AgentNodeData>[],
  edges: Edge[]
): Edge<FlowingEdgeData>[] {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  return edges.map((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);

    if (!source || !target) {
      return { ...edge, data: { animated: false } };
    }

    const { sourceHandle, targetHandle } = getOptimalHandles(
      source.position,
      target.position
    );

    const animated = shouldAnimateEdge(
      source.data.status,
      target.data.status
    );

    return {
      ...edge,
      sourceHandle,
      targetHandle,
      data: { animated },
    };
  });
}
