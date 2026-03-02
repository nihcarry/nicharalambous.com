# Making Notion MCP Available to the Cursor Agent

## What’s going on

- **Plugin MCP servers** (e.g. Notion) are enabled in **Cursor Settings → Tools & MCP** and show as “12 tools, 1 resource enabled.”
- The **agent** in Composer only receives a subset of MCP servers. In practice, only `cursor-ide-browser` was visible, so Notion’s tools were never available to the agent.
- So: the Notion *plugin* is on, but the **agent’s list of MCP servers** doesn’t include it. That’s either by design (plugin MCPs used only in other parts of Cursor) or a Cursor bug.

## Fix: Add Notion as a custom MCP in this project

Servers defined in **`.cursor/mcp.json`** are part of the MCP set that Cursor (and the agent) load. Adding Notion there makes it a “custom” MCP for this project so the agent can see and use it.

1. **Project-level config (already done)**  
   This repo now has `.cursor/mcp.json` with Notion’s official MCP URL:
   - `https://mcp.notion.com/mcp`  
   After you restart Cursor (or reload the window), the agent should list Notion among its available MCP servers.

2. **First use / OAuth**  
   Notion’s MCP uses OAuth. The first time the agent (or you) uses a Notion tool, Cursor should open a browser for you to sign in to Notion and allow access. Do that once; then the agent can call Notion tools.

3. **If the agent still doesn’t see Notion**  
   - Confirm **Settings → Tools & MCP** still has the Notion plugin **on** (optional but can help).  
   - In chat, check the **Available Tools** list and ensure Notion (or its tools) aren’t disabled.  
   - Try a **new Composer/agent chat** and ask again (e.g. “Create a Notion page from …”).  
   - If it still fails, it’s likely a Cursor bug: report that “Notion is in `.cursor/mcp.json` and the plugin is enabled, but the agent’s available MCP servers still don’t include Notion.”

## References

- Cursor docs: [Model Context Protocol (MCP)](https://cursor.com/docs/context/mcp) — config locations (project vs global), `mcp.json` format, OAuth.  
- Cursor forum: [Agent has trouble detecting available MCP tools](https://forum.cursor.com/t/agent-has-trouble-detecting-available-mcp-tools/146486) — known issue where the agent doesn’t always see connected MCPs.  
- Notion MCP: [https://mcp.notion.com/mcp](https://mcp.notion.com/mcp) (SSE, OAuth).
