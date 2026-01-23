# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mind-mapping application built with SvelteKit 2, Svelte 5, TypeScript, and Tailwind CSS v4. Uses Bun as the package manager.

## Commands

- `bun run dev` — Start dev server
- `bun run build` — Production build
- `bun run preview` — Preview production build
- `bun run check` — Type-check with svelte-check
- `bun run lint` — Run Prettier and ESLint checks
- `bun run format` — Auto-format with Prettier

## Architecture

- **Routing**: SvelteKit file-based routing in `src/routes/`
- **Components/utilities**: `src/lib/` (aliased as `$lib`)
- **Styling**: Tailwind CSS v4 via Vite plugin (no tailwind.config — uses CSS-based config in `src/routes/layout.css`)
- **Adapter**: `adapter-auto` for environment-agnostic deployment

## Code Conventions

- **Svelte 5 runes**: Use `$props()`, `$state()`, `$derived()`, `$effect()` — not legacy Svelte 4 syntax
- **Snippets over slots**: Use `{@render children()}` pattern, not `<slot />`
- **Formatting**: Tabs, single quotes, no trailing commas, printWidth 100
- **TypeScript**: Strict mode enabled

## MCP Tools (Svelte Documentation)

You have access to a Svelte MCP server. Use these tools when working on Svelte/SvelteKit code:

1. **list-sections** — Call FIRST to discover available documentation sections. Analyze the `use_cases` field to find relevant docs.
2. **get-documentation** — Fetch full documentation for relevant sections found via list-sections.
3. **svelte-autofixer** — MUST be used whenever writing Svelte code. Keep calling until no issues remain.
4. **playground-link** — Generates a Svelte Playground link. Only offer after code is complete, and NEVER if code was written to project files.

You have access to a Threlte MCP server. Use these tools when working on Threlte/3D code:

To install it  : 
Add the component to your Threlte app
Requires Svelte 5 for the MCPBridge component.

<script>
  import { MCPBridgeComponent } from 'threlte-mcp/client';
</script>

<!-- Add inside your <Canvas> -->
<MCPBridgeComponent />
That's it! The AI can now inspect and manipulate your scene.

Check the repo for more details:
https://github.com/SerifeusStudio/threlte-mcp?tab=readme-ov-file