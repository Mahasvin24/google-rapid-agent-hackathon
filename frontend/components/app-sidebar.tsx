"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Network, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  href: string;
  label: string;
  active?: boolean;
  children: React.ReactNode;
};

function SidebarNavItem({ href, label, active, children }: SidebarNavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            className={cn(
              "size-9 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              active && "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
            )}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            render={<Link href={href} />}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const onChat = pathname.startsWith("/chat");
  const onDiagram = pathname === "/";

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center border-r border-border/60 bg-card/30 py-3">
      <SidebarNavItem href="/" label="Agent diagram" active={onDiagram}>
        <Network className="size-[18px]" />
      </SidebarNavItem>

      <SidebarNavItem href="/chat" label="Incident chat" active={onChat}>
        <MessageSquare className="size-[18px]" />
      </SidebarNavItem>

      <div className="flex-1" />

      <SidebarNavItem href="/" label="Settings">
        <Settings className="size-[18px]" />
      </SidebarNavItem>
    </aside>
  );
}
