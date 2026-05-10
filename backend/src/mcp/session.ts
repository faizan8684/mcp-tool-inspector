import { Client } from '@modelcontextprotocol/sdk/client/index.js';

interface Session {
  client: Client;
  tools: Tool[];
  createdAt: Date;
}

export interface Tool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

// Simple in-memory store — good enough for v1
const sessions = new Map<string, Session>();

export function createSession(id: string, client: Client, tools: Tool[]) {
  sessions.set(id, { client, tools, createdAt: new Date() });
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function deleteSession(id: string) {
  sessions.delete(id);
}