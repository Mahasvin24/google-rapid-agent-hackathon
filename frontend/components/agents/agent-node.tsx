"use client";

import { useEffect, useState } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import {
  Activity,
  CheckCircle2,
  Clock,
  GitMerge,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Network,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/lib/agent-flow";

export type { AgentStatus };

export type AgentRole =
  | "orchestrator"
  | "qna"
  | "observability"
  | "remediation"
  | "gitlab"
  | "approval";

export type AgentNodeData = {
  name: string;
  role: AgentRole;
  integration?: string;
  status: AgentStatus;
  currentTask?: string;
  tasks: string[];
};

export type AgentNodeType = Node<AgentNodeData, "agent">;

const HANDLE_POSITIONS = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const;

const roleConfig: Record<
  AgentRole,
  {
    icon: LucideIcon;
    accent: string;
    iconBg: string;
    borderActive: string;
  }
> = {
  orchestrator: {
    icon: Network,
    accent: "text-violet-300",
    iconBg: "bg-violet-500/20",
    borderActive: "border-violet-500/45",
  },
  qna: {
    icon: MessageCircle,
    accent: "text-cyan-300",
    iconBg: "bg-cyan-500/20",
    borderActive: "border-cyan-500/45",
  },
  observability: {
    icon: Activity,
    accent: "text-orange-300",
    iconBg: "bg-orange-500/20",
    borderActive: "border-orange-500/40",
  },
  remediation: {
    icon: Wrench,
    accent: "text-amber-300",
    iconBg: "bg-amber-500/20",
    borderActive: "border-amber-500/45",
  },
  gitlab: {
    icon: GitMerge,
    accent: "text-[#fc6d26]",
    iconBg: "bg-[#fc6d26]/15",
    borderActive: "border-[#fc6d26]/45",
  },
  approval: {
    icon: ShieldCheck,
    accent: "text-rose-300",
    iconBg: "bg-rose-500/20",
    borderActive: "border-rose-500/40",
  },
};

const statusConfig: Record<
  AgentStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  active: {
    label: "Active",
    badgeClass: "border-sky-500/50 bg-sky-500/15 text-sky-300",
    dotClass: "bg-sky-400 shadow-[0_0_8px_oklch(0.7_0.15_250)]",
  },
  waiting: {
    label: "Waiting",
    badgeClass: "border-slate-500/40 bg-slate-500/15 text-slate-300",
    dotClass: "bg-slate-400",
  },
  completed: {
    label: "Completed",
    badgeClass: "border-emerald-500/50 bg-emerald-500/15 text-emerald-300",
    dotClass: "bg-emerald-400",
  },
};

const handleClassName = "size-2.5! border-white/30! bg-background! opacity-0";

function StatusIcon({ status }: { status: AgentStatus }) {
  if (status === "active") {
    return <Loader2 className="size-3 animate-spin text-sky-400" />;
  }
  if (status === "completed") {
    return <CheckCircle2 className="size-3 text-emerald-400" />;
  }
  return <Clock className="size-3 text-slate-400" />;
}

function ActivityTicker({
  tasks,
  currentTask,
  active,
  waitingMessage,
}: {
  tasks: string[];
  currentTask?: string;
  active: boolean;
  waitingMessage: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || tasks.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % tasks.length);
    }, 1800);
    return () => clearInterval(id);
  }, [active, tasks]);

  const display = active
    ? (currentTask ?? tasks[index] ?? "processing…")
    : (currentTask ?? waitingMessage);

  return (
    <div
      className={cn(
        "mt-2 rounded-md border px-2 py-1.5 font-mono text-[10px]",
        active
          ? "border-sky-500/30 bg-sky-500/10 text-sky-200 agent-activity-ticker"
          : "border-border/50 bg-muted/30 text-muted-foreground"
      )}
    >
      <span className="text-muted-foreground">→ </span>
      <span key={display} className="agent-activity-text">
        {display}
      </span>
    </div>
  );
}

function TaskRow({
  label,
  highlighted,
}: {
  label: string;
  highlighted: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
        highlighted && "bg-sky-500/10 ring-1 ring-sky-500/20",
        !highlighted && "hover:bg-muted/50"
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          highlighted ? "bg-sky-400 animate-pulse" : "bg-muted-foreground/35"
        )}
      />
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground/90">
        {label}
      </span>
    </div>
  );
}

export function AgentNode({ data }: NodeProps<AgentNodeType>) {
  const role = roleConfig[data.role];
  const status = statusConfig[data.status];
  const RoleIcon = role.icon;
  const isActive = data.status === "active";
  const isWaiting = data.status === "waiting";
  const isOrchestrator = data.role === "orchestrator";
  const isChatAgent = data.role === "qna";

  const waitingMessage =
    data.role === "approval"
      ? "awaiting human sign-off"
      : data.role === "gitlab"
        ? "awaiting remediation output"
        : "waiting for upstream";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card/95 shadow-lg shadow-black/25 ring-1 ring-white/5 backdrop-blur-sm",
        isChatAgent
          ? "cursor-pointer hover:ring-1 hover:ring-cyan-500/35"
          : "cursor-grab active:cursor-grabbing",
        isOrchestrator ? "w-[272px]" : "w-[252px]",
        isActive && cn("agent-node-busy", role.borderActive),
        data.status === "completed" && "border-emerald-500/30",
        isWaiting && "border-border/80 opacity-90",
        isOrchestrator &&
          "ring-2 ring-violet-500/20 shadow-violet-950/30"
      )}
    >
      {isActive && (
        <div className="agent-node-shimmer pointer-events-none" aria-hidden />
      )}

      {HANDLE_POSITIONS.map(({ id, position }) => (
        <Handle
          key={`target-${id}`}
          id={id}
          type="target"
          position={position}
          className={handleClassName}
        />
      ))}

      <div
        className={cn(
          "relative border-b border-border/60 px-3 py-2.5",
          isOrchestrator && "bg-violet-500/5"
        )}
      >
        {isOrchestrator && (
          <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-widest text-violet-400/90">
            Incident-to-PR
          </span>
        )}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              role.iconBg,
              role.accent
            )}
          >
            <RoleIcon className={cn("size-4", isActive && "animate-pulse")} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium tracking-tight">
              {data.name}
            </span>
            {data.integration && (
              <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                {data.integration}
              </span>
            )}
            <Badge
              variant="outline"
              className={cn(
                "mt-1 h-5 gap-1 px-1.5 text-[10px] font-medium",
                status.badgeClass
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status.dotClass,
                  isActive && "animate-pulse"
                )}
              />
              <StatusIcon status={data.status} />
              {status.label}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="nodrag nopan text-muted-foreground"
            aria-label="Agent options"
          >
            <MoreHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="relative px-2 pb-2.5 pt-1.5">
        <p className="mb-1 px-1 text-[9px] font-medium uppercase tracking-wide text-muted-foreground/80">
          Tool steps
        </p>
        <div className="flex flex-col gap-0.5">
          {data.tasks.map((task) => (
            <TaskRow
              key={task}
              label={task}
              highlighted={isActive && task === data.currentTask}
            />
          ))}
        </div>

        <ActivityTicker
          tasks={data.tasks}
          currentTask={data.currentTask}
          active={isActive}
          waitingMessage={waitingMessage}
        />
      </div>

      {HANDLE_POSITIONS.map(({ id, position }) => (
        <Handle
          key={`source-${id}`}
          id={id}
          type="source"
          position={position}
          className={handleClassName}
        />
      ))}
    </div>
  );
}
