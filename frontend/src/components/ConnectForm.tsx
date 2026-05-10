import { useState } from 'react';
import { connectToServer, fetchTools } from '../api/client';
import type { Tool } from '../api/client';


interface Props {
  onConnected: (sessionId: string, tools: Tool[]) => void;
}

export default function ConnectForm({ onConnected }: Props) {
  const [type, setType] = useState<'stdio' | 'sse'>('stdio');
  const [command, setCommand] = useState('npx @modelcontextprotocol/server-filesystem /private/tmp');
  const [url, setUrl] = useState('http://localhost:8080/sse');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    try {
      const { sessionId } = await connectToServer(
        type === 'stdio' ? { type, command } : { type, url }
      );
      const tools = await fetchTools(sessionId);
      onConnected(sessionId, tools);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="connect-wrap">
      <div className="connect-box">
        <h2>Connect to an MCP Server</h2>
        <p className="connect-sub">Inspect tools over stdio or HTTP/SSE</p>

        <div className="transport-toggle">
          <button
            className={type === 'stdio' ? 'active' : ''}
            onClick={() => setType('stdio')}
          >
            stdio
          </button>
          <button
            className={type === 'sse' ? 'active' : ''}
            onClick={() => setType('sse')}
          >
            HTTP / SSE
          </button>
        </div>

        {type === 'stdio' ? (
          <div className="field">
            <label>Command</label>
            <input
              value={command}
              onChange={e => setCommand(e.target.value)}
              placeholder="npx @modelcontextprotocol/server-filesystem /tmp"
              spellCheck={false}
            />
            <span className="field-hint">Shell command to spawn the MCP server process</span>
          </div>
        ) : (
          <div className="field">
            <label>URL</label>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="http://localhost:8080/sse"
              spellCheck={false}
            />
            <span className="field-hint">SSE endpoint of the MCP server</span>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        <button
          className="connect-btn"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );
}