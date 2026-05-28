"use client";

import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import type { FlowingEdgeData } from "@/lib/agent-flow";

export function FlowingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const animated = data?.animated ?? false;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      <BaseEdge
        id={`${id}-bg`}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: "oklch(1 0 0 / 0.12)",
          strokeWidth: 2,
          strokeDasharray: "6 8",
        }}
      />
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: animated
            ? "oklch(0.78 0.12 250)"
            : "oklch(1 0 0 / 0.22)",
          strokeWidth: 2,
          strokeDasharray: animated ? "8 10" : "4 10",
          strokeLinecap: "round",
        }}
        className={animated ? "agent-flow-edge" : undefined}
      />
      {animated && (
        <>
          <circle r="3" fill="oklch(0.85 0.15 250)" className="agent-flow-packet">
            <animateMotion dur="2.2s" repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle
            r="3"
            fill="oklch(0.85 0.15 250)"
            className="agent-flow-packet agent-flow-packet--delay"
          >
            <animateMotion
              dur="2.2s"
              repeatCount="indefinite"
              path={edgePath}
              begin="1.1s"
            />
          </circle>
        </>
      )}
    </>
  );
}
