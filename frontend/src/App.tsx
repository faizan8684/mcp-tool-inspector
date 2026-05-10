import { useState } from 'react';
import type { Tool } from './api/client';
import ConnectForm from './components/ConnectForm';
import ToolList from './components/ToolList';
import ToolDetail from './components/ToolDetail';
import './App.css';

export default function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  function handleConnected(sid: string, t: Tool[]) {
    setSessionId(sid);
    setTools(t);
    setSelectedTool(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">⚡</span>
        <h1>mcp-tool-inspector</h1>
        {sessionId && (
          <span className="session-badge">
            {tools.length} tools connected
          </span>
        )}
      </header>

      <main className="app-main">
        {!sessionId ? (
          <ConnectForm onConnected={handleConnected} />
        ) : (
          <div className="workspace">
            <aside className="tool-sidebar">
              <ToolList
                tools={tools}
                selected={selectedTool}
                onSelect={setSelectedTool}
              />
            </aside>
            <section className="tool-panel">
              {selectedTool ? (
                <ToolDetail tool={selectedTool} sessionId={sessionId} />
              ) : (
                <div className="empty-state">
                  ← Select a tool to inspect and call it
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}