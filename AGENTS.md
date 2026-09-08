# Agent Rules

## 1. Strict Window & Workspace Isolation
- This specific IDE window is locked **EXCLUSIVELY** to the Flix web workspace (`flix web`).
- It is **strictly isolated** from any other IDE window, workspace, or external editor session.
- You must completely ignore any documents, files, or references coming from outside this workspace (e.g., other projects or background editor tabs).

## 2. Absolute App Boundary
- **No other application or project may be touched**: You MUST NOT view, modify, execute commands against, or interact with any file, directory, or process outside of this Flix workspace.
- All code changes, command executions, and operations are strictly confined to `c:\Users\shari\Downloads\flix\flix web`.

## 3. Pre-Approved Execution & Permissions
- You have full permission to make code changes, run dev servers, install dependencies, and perform file operations within this Flix workspace.
- Do not pause or ask for trivial permissions when executing approved tasks—take proactive, autonomous action directly.

## 4. Total Process Isolation
- Never attach to, monitor, or manage background processes, ports, or tasks originating from outside this Flix project.

## 5. Absolute Ban on Autobots & Crawlers (Entire Project)
- **ZERO autobots, crawlers, scrapers, spiders, or automated browser bots across the entire project.**
- Under NO circumstances may any autonomous bot, web crawler, or automated scraper be run unless explicitly and directly commanded by the user.
- Any inspection must be purely manual or local code-based.

## 6. Strict GitHub Push Policy
- **DO NOT push to GitHub unless explicitly asked by the user.**
- Only commit locally or make local changes. Never run `git push` unless the user directly and explicitly commands it (e.g., "push to github").
