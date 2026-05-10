# ⚡ mcp-tool-inspector

Like Postman, but for MCP servers.

Connect to any [Model Context Protocol](https://modelcontextprotocol.io) server, browse its tools, fill in a form, call them, and inspect the full request/response — all from a clean UI.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Protocol-blueviolet?style=flat)

---

## What it does

MCP servers expose tools — but until now, the only way to test them was writing raw JSON in a terminal or using Claude Desktop which gives you no visibility into what's happening under the hood.

`mcp-tool-inspector` gives you:

- **Tool browser** — connect to any MCP server and see all its tools with full input schemas
- **Auto-generated forms** — input fields are generated from the tool's JSON schema, no manual JSON required
- **Live tool calling** — call any tool and see the response instantly
- **Latency tracking** — every call shows how long it took
- **Both transports** — works over stdio (local processes) and HTTP/SSE

---

## Getting started

### Prerequisites

- Node.js 20.19+
- npm

### Install

```bash
git clone https://github.com/faizan8684/mcp-tool-inspector.git
cd mcp-tool-inspector

npm install
npm install --prefix backend
npm install --prefix frontend
```

### Run

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

---

## Usage

### Connect via stdio

Paste a shell command that spawns an MCP server:

```
npx @modelcontextprotocol/server-filesystem /your/directory
```

### Connect via HTTP/SSE

Paste the SSE endpoint URL of a running MCP server:

```
http://localhost:8080/sse
```

Once connected, click any tool in the sidebar → fill in the form → hit Call.

---

## Example servers to try

| Server | Command |
|---|---|
| Filesystem | `npx @modelcontextprotocol/server-filesystem /tmp` |
| SQLite | `npx @modelcontextprotocol/server-sqlite path/to/db.sqlite` |
| GitHub | `npx @modelcontextprotocol/server-github` |

---

## Tech stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Frontend | React, Vite, TypeScript |
| MCP | `@modelcontextprotocol/sdk` |
| Transports | stdio, HTTP/SSE |

---

## Project structure

```
mcp-tool-inspector/
├── backend/
│   └── src/
│       ├── index.ts          # Express server
│       ├── mcp/
│       │   ├── client.ts     # MCP client (stdio + SSE)
│       │   └── session.ts    # In-memory session store
│       └── routes/
│           ├── connect.ts    # POST /connect
│           ├── tools.ts      # GET /tools
│           └── call.ts       # POST /call
└── frontend/
    └── src/
        ├── api/client.ts         # Typed API wrappers
        ├── App.tsx
        └── components/
            ├── ConnectForm.tsx   # Server connection UI
            ├── ToolList.tsx      # Tool sidebar
            └── ToolDetail.tsx    # Schema viewer + call form
```

---

## Built by

[Faizan Akhtar](https://www.linkedin.com/in/akhtar-faizan/)
