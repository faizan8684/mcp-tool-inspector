import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mcp-tool-inspector-production.up.railway.app',
});

export interface Tool {
  name: string;
  description?: string;
  inputSchema: {
    type: string;
    properties?: Record<string, SchemaProperty>;
    required?: string[];
  };
}

export interface SchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  default?: unknown;
  items?: SchemaProperty;
}

export interface CallResult {
  result: {
    content: { type: string; text: string }[];
    isError?: boolean;
  };
  latency: number;
}

// POST /connect
export async function connectToServer(payload: {
  type: 'stdio' | 'sse';
  command?: string;
  url?: string;
}): Promise<{ sessionId: string; toolCount: number }> {
  const { data } = await api.post('/connect', payload);
  return data;
}

// GET /tools
export async function fetchTools(sessionId: string): Promise<Tool[]> {
  const { data } = await api.get('/tools', { params: { session: sessionId } });
  return data.tools;
}

// POST /call
export async function callTool(payload: {
  session: string;
  toolName: string;
  args: Record<string, unknown>;
}): Promise<CallResult> {
  const { data } = await api.post('/call', payload);
  return data;
}
