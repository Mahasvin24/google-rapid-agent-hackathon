import type { Edge, Node } from "@xyflow/react";
import type { AgentNodeData } from "@/components/agents/agent-node";

/** Default canvas layout — orchestrator on top, workers in a spaced row below. */
const LAYOUT = {
  orchestrator: { x: 520, y: 48 },
  rowY: 400,
  approvalY: 720,
  columnX: [48, 408, 768, 1128] as const,
};

export const initialNodes: Node<AgentNodeData>[] = [
  {
    id: "orchestrator",
    type: "agent",
    position: LAYOUT.orchestrator,
    data: {
      name: "Orchestrator",
      role: "orchestrator",
      status: "active",
      currentTask: "route_incident_workflow",
      tasks: [
        "ingest_incident_schema",
        "route_incident_workflow",
        "coordinate_approvals",
      ],
    },
  },
  {
    id: "chat",
    type: "agent",
    position: { x: LAYOUT.columnX[0], y: LAYOUT.rowY },
    data: {
      name: "Incident Chat",
      role: "qna",
      status: "active",
      currentTask: "stream_status_updates",
      tasks: [
        "stream_status_updates",
        "answer_status_questions",
        "clarify_blast_radius",
        "summarize_for_engineer",
      ],
    },
  },
  {
    id: "observability",
    type: "agent",
    position: { x: LAYOUT.columnX[1], y: LAYOUT.rowY },
    data: {
      name: "Observability",
      role: "observability",
      integration: "Dynatrace MCP",
      status: "completed",
      tasks: [
        "ingest_pagerduty_alert",
        "map_blast_radius",
        "attach_trace_evidence",
      ],
    },
  },
  {
    id: "remediation",
    type: "agent",
    position: { x: LAYOUT.columnX[2], y: LAYOUT.rowY },
    data: {
      name: "Remediation",
      role: "remediation",
      status: "active",
      currentTask: "propose_root_cause",
      tasks: [
        "propose_root_cause",
        "draft_rollback_plan",
        "draft_patch_plan",
      ],
    },
  },
  {
    id: "gitlab",
    type: "agent",
    position: { x: LAYOUT.columnX[3], y: LAYOUT.rowY },
    data: {
      name: "GitLab",
      role: "gitlab",
      integration: "GitLab MCP",
      status: "waiting",
      currentTask: "await_remediation_plan",
      tasks: ["open_incident_issue", "draft_merge_request", "link_runbooks"],
    },
  },
  {
    id: "approval",
    type: "agent",
    position: { x: LAYOUT.columnX[1], y: LAYOUT.approvalY },
    data: {
      name: "Human Approval",
      role: "approval",
      status: "waiting",
      currentTask: "await_risky_action_plan",
      tasks: [
        "review_rollback_plan",
        "approve_or_reject_patch",
        "audit_decision_trail",
      ],
    },
  },
];

export const initialEdges: Edge[] = [
  { id: "orch-chat", source: "orchestrator", target: "chat", type: "flowing" },
  {
    id: "orch-obs",
    source: "orchestrator",
    target: "observability",
    type: "flowing",
  },
  {
    id: "orch-rem",
    source: "orchestrator",
    target: "remediation",
    type: "flowing",
  },
  {
    id: "orch-gitlab",
    source: "orchestrator",
    target: "gitlab",
    type: "flowing",
  },
  {
    id: "obs-rem",
    source: "observability",
    target: "remediation",
    type: "flowing",
  },
  {
    id: "rem-gitlab",
    source: "remediation",
    target: "gitlab",
    type: "flowing",
  },
  {
    id: "rem-approval",
    source: "remediation",
    target: "approval",
    type: "flowing",
  },
  {
    id: "gitlab-approval",
    source: "gitlab",
    target: "approval",
    type: "flowing",
  },
  {
    id: "orch-approval",
    source: "orchestrator",
    target: "approval",
    type: "flowing",
  },
  { id: "chat-orch", source: "chat", target: "orchestrator", type: "flowing" },
  {
    id: "chat-obs",
    source: "chat",
    target: "observability",
    type: "flowing",
  },
];
