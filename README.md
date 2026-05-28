# Incident-to-PR Agent

A hackathon demo for orchestrating production incidents into GitLab workflows. The UI shows a live multi-agent diagram and an incident chat surface where you can follow status updates and ask questions.

## Features

### Agent diagram (`/`)

Interactive React Flow canvas with six agents wired into an incident-to-PR pipeline:

| Agent | Role |
|-------|------|
| **Orchestrator** | Routes the incident workflow and coordinates other agents |
| **Incident Chat** | Q&A and status updates for engineers (opens chat UI) |
| **Observability** | Dynatrace MCP — alerts, blast radius, trace evidence |
| **Remediation** | Root cause, rollback, and patch planning |
| **GitLab** | GitLab MCP — issues, merge requests, runbooks |
| **Human Approval** | Sign-off for risky actions |

- Drag nodes to rearrange the layout; node positions and zoom/pan persist when you navigate away and back (state lives in `AgentFlowProvider` for the session).
- Animated edges reflect agent activity.
- Click **Incident Chat** on the canvas to open the chat page.

### Incident chat (`/chat`)

Question-and-answer agent that:

- Streams proactive status updates on a timer.
- Answers questions about status, blast radius, remediation, approvals, GitLab, and observability (mocked responses for the demo).
- Shows typed replies with a short “typing” delay.

Open via the **Messages** icon in the left sidebar, or from the **Incident Chat** node on the diagram.

### Navigation

| Route | Description |
|-------|-------------|
| `/` | Agent diagram |
| `/chat` | Incident chat |

Sidebar: **Agent diagram** (network icon), **Incident chat** (messages icon).

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **@xyflow/react** — agent canvas
- **shadcn/ui** + **Tailwind CSS 4**
- **TypeScript**

There is no backend yet; chat replies and diagram task state are simulated in the frontend.

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## Project structure

```
google-rapid-agent-hackathon/
├── README.md
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   └── (dashboard)/          # shared shell + sidebar
    │       ├── page.tsx          # agent diagram
    │       └── chat/page.tsx     # incident chat
    ├── components/
    │   ├── agents/               # React Flow nodes, edges, canvas, state provider
    │   ├── chat/                 # chat UI and hook
    │   ├── app-sidebar.tsx
    │   └── dashboard-shell.tsx
    └── lib/
        ├── agents.ts             # default nodes, edges, layout
        ├── agent-flow.ts         # edge animation layout
        └── chat-agent.ts         # mock messages and Q&A rules
```

## Default layout

On first load, the orchestrator sits at the top; **Incident Chat**, **Observability**, **Remediation**, and **GitLab** are in a spaced row below; **Human Approval** is on a third row. Layout constants live in `frontend/lib/agents.ts` (`LAYOUT`).

## Extending

- **Real chat API** — Replace mock logic in `components/chat/use-chat-agent.ts` and `lib/chat-agent.ts` with `fetch` to your agent backend.
- **Live agent state** — Drive `lib/agents.ts` node `data.status` / `currentTask` from orchestrator events instead of static seed data.
- **New diagram agent** — Add a node and edges in `lib/agents.ts`, extend `AgentRole` in `components/agents/agent-node.tsx`, and update `roleConfig`.

UI conventions for contributors are in `frontend/AGENTS.md`.
