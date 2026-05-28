<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## UI & components

- **Prefer shadcn/ui** — Use pre-built components from `@/components/ui` when they fit. Do not reinvent buttons, dialogs, forms, etc. Add new shadcn components with `npx shadcn@latest add <name>` rather than copying one-off markup.
- **Compose small pieces** — Break UI into focused, reusable components (e.g. separate list item, header, and actions from a monolithic page section). Keep pages thin; put layout and behavior in named components under `components/`.
