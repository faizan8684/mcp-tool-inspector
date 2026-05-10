import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { Tool } from './session';

export type TransportType = 'stdio' | 'sse';

interface ConnectOptions {
  type: TransportType;
  command?: string; // for stdio: e.g. "npx @modelcontextprotocol/server-filesystem /tmp"
  url?: string;     // for sse: e.g. "http://localhost:8080/sse"
}

export async function createMCPClient(options: ConnectOptions): Promise<{
  client: Client;
  tools: Tool[];
}> {
  const client = new Client(
    { name: 'mcp-tool-inspector', version: '1.0.0' },
    { capabilities: {} }
  );

  if (options.type === 'stdio') {
    if (!options.command) throw new Error('command is required for stdio transport');

    // Split command string into executable + args
    const parts = options.command.trim().split(/\s+/);
    const [cmd, ...args] = parts;

    const transport = new StdioClientTransport({ command: cmd, args });
    await client.connect(transport);

  } else if (options.type === 'sse') {
    if (!options.url) throw new Error('url is required for sse transport');

    const transport = new SSEClientTransport(new URL(options.url));
    await client.connect(transport);

  } else {
    throw new Error(`Unknown transport type: ${options.type}`);
  }

  // Fetch available tools
  const response = await client.listTools();
  const tools: Tool[] = response.tools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema as Record<string, unknown>,
  }));

  return { client, tools };
}