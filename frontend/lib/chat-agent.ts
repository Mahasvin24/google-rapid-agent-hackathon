export type ChatMessageKind = "update" | "answer" | "question";

export type ChatMessage = {
  id: string;
  role: "agent" | "user";
  kind: ChatMessageKind;
  content: string;
  timestamp: Date;
};

export const CHAT_AGENT_NAME = "Incident Chat";

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "agent",
    kind: "update",
    content:
      "Incident **INC-2847** opened from PagerDuty — elevated error rate on `checkout-api` (us-east-1). Orchestrator started the workflow.",
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: "init-2",
    role: "agent",
    kind: "update",
    content:
      "Observability finished Dynatrace correlation: blast radius spans **checkout-api**, **payment-gateway**, and **inventory-svc**. Trace evidence attached.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "init-3",
    role: "agent",
    kind: "update",
    content:
      "Remediation is drafting a root-cause hypothesis (connection pool exhaustion after deploy `v2.14.1`). GitLab agent is on standby for the MR.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "init-4",
    role: "agent",
    kind: "answer",
    content:
      "Ask me about incident status, blast radius, remediation plans, or approvals — I'll summarize what the other agents are doing.",
    timestamp: new Date(Date.now() - 1000 * 30),
  },
];

const PERIODIC_UPDATES = [
  "Orchestrator routed a new signal: latency p99 on `payment-gateway` crossed 2.4s (threshold 1.5s).",
  "Remediation updated root cause: Hikari pool `maximumPoolSize` mismatch after config change in `v2.14.1`.",
  "Human Approval is waiting — rollback plan ready for review once remediation finalizes the patch draft.",
  "GitLab agent queued `draft_merge_request` — will open MR #4821 after remediation approves the patch plan.",
  "Observability attached 12 trace IDs to the incident timeline; filter by `service:checkout-api` in Dynatrace.",
];

let updateIndex = 0;

export function nextPeriodicUpdate(): string {
  const message = PERIODIC_UPDATES[updateIndex % PERIODIC_UPDATES.length];
  updateIndex += 1;
  return message;
}

type ResponseRule = {
  match: RegExp;
  reply: string;
};

const RESPONSE_RULES: ResponseRule[] = [
  {
    match: /\b(status|progress|where|what.?s happening)\b/i,
    reply:
      "Workflow status: **Observability** completed evidence collection. **Remediation** is active on `propose_root_cause`. **GitLab** is waiting for the patch plan. **Human Approval** is blocked until remediation submits a risky-action plan.",
  },
  {
    match: /\b(blast|radius|impact|affected|services)\b/i,
    reply:
      "Blast radius (Dynatrace): **checkout-api** (primary), **payment-gateway**, **inventory-svc**. Customer-facing checkout failures began ~18 min ago; internal admin tools are unaffected.",
  },
  {
    match: /\b(remediation|fix|patch|rollback|root.?cause)\b/i,
    reply:
      "Remediation hypothesis: connection pool exhaustion post-deploy `v2.14.1`. Proposed actions: (1) rollback deploy, or (2) patch pool config + staged rollout. Rollback plan is drafted; patch plan is in progress.",
  },
  {
    match: /\b(approval|approve|human|sign.?off)\b/i,
    reply:
      "Human Approval is **waiting** on `await_risky_action_plan`. Once remediation submits the patch, you'll get a sign-off request for rollback vs. forward-fix.",
  },
  {
    match: /\b(gitlab|mr|merge|issue|pr)\b/i,
    reply:
      "GitLab agent will open incident issue **INC-2847** and draft MR **#4821** after remediation finalizes. Runbooks will be linked from the observability evidence pack.",
  },
  {
    match: /\b(dynatrace|trace|observability|evidence)\b/i,
    reply:
      "Observability completed: PagerDuty alert ingested, blast radius mapped, 12 traces attached. Search Dynatrace with `entity:checkout-api` and incident tag `INC-2847`.",
  },
  {
    match: /\b(hello|hi|hey)\b/i,
    reply:
      "Hi — I'm your incident chat agent. I relay updates from the orchestrator and can answer questions about this workflow. What would you like to know?",
  },
];

const DEFAULT_REPLY =
  "I don't have live backend data yet, but based on the current workflow: observability is done, remediation is analyzing the deploy, and GitLab/approval are waiting downstream. Try asking about **status**, **blast radius**, **remediation**, or **approvals**.";

export function answerUserQuestion(question: string): string {
  const trimmed = question.trim();
  if (!trimmed) return "Send a question and I'll summarize the incident workflow for you.";

  for (const rule of RESPONSE_RULES) {
    if (rule.match.test(trimmed)) return rule.reply;
  }
  return DEFAULT_REPLY;
}

export function createMessage(
  partial: Omit<ChatMessage, "id" | "timestamp"> & { id?: string }
): ChatMessage {
  return {
    id: partial.id ?? crypto.randomUUID(),
    timestamp: new Date(),
    ...partial,
  };
}
