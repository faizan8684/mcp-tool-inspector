import { useState } from 'react';
import { callTool } from '../api/client';
import type { Tool, SchemaProperty } from '../api/client';

interface Props {
  tool: Tool;
  sessionId: string;
}

function buildInitialArgs(tool: Tool): Record<string, unknown> {
  const props = tool.inputSchema.properties ?? {};
  const initial: Record<string, unknown> = {};
  for (const [key, schema] of Object.entries(props)) {
    if (schema.type === 'boolean') initial[key] = false;
    else if (schema.type === 'number') initial[key] = '';
    else initial[key] = '';
  }
  return initial;
}

function FieldInput({
  name,
  schema,
  value,
  onChange,
  required,
}: {
  name: string;
  schema: SchemaProperty;
  value: unknown;
  onChange: (val: unknown) => void;
  required: boolean;
}) {
  if (schema.type === 'boolean') {
    return (
      <div className="field">
        <label>
          {name} {required && <span className="required">*</span>}
        </label>
        <input
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
        />
        {schema.description && <span className="field-hint">{schema.description}</span>}
      </div>
    );
  }

  if (schema.enum) {
    return (
      <div className="field">
        <label>
          {name} {required && <span className="required">*</span>}
        </label>
        <select value={value as string} onChange={e => onChange(e.target.value)}>
          <option value="">-- select --</option>
          {schema.enum.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {schema.description && <span className="field-hint">{schema.description}</span>}
      </div>
    );
  }

  if (schema.type === 'object' || schema.type === 'array') {
    return (
      <div className="field">
        <label>
          {name} <span className="type-badge">{schema.type}</span>{required && <span className="required">*</span>}
        </label>
        <textarea
          value={value as string}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${schema.type} as JSON`}
          rows={3}
        />
        {schema.description && <span className="field-hint">{schema.description}</span>}
      </div>
    );
  }

  return (
    <div className="field">
      <label>
        {name} {required && <span className="required">*</span>}
      </label>
      <input
        type={schema.type === 'number' ? 'number' : 'text'}
        value={value as string}
        onChange={e => onChange(
          schema.type === 'number' ? Number(e.target.value) : e.target.value
        )}
        placeholder={schema.description ?? name}
      />
      {schema.description && <span className="field-hint">{schema.description}</span>}
    </div>
  );
}

export default function ToolDetail({ tool, sessionId }: Props) {
  const [args, setArgs] = useState<Record<string, unknown>>(buildInitialArgs(tool));
  const [result, setResult] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const properties = tool.inputSchema.properties ?? {};
  const required = tool.inputSchema.required ?? [];

  function setArg(key: string, val: unknown) {
    setArgs(prev => ({ ...prev, [key]: val }));
  }

  async function handleCall() {
    setLoading(true);
    setResult(null);
    try {
      const { result: res, latency: lat } = await callTool({
        session: sessionId,
        toolName: tool.name,
        args,
      });
      setLatency(lat);
      setIsError(!!res.isError);
      setResult(res.content.map(c => c.text).join('\n'));
    } catch (err: unknown) {
      setIsError(true);
      setLatency(null);
      setResult(err instanceof Error ? err.message : 'Call failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tool-detail">
      <div className="tool-detail-header">
        <h2>{tool.name}</h2>
        {tool.description && <p className="tool-desc">{tool.description}</p>}
      </div>

      <div className="tool-detail-body">
        <div className="detail-col">
          <h3>Arguments</h3>
          {Object.keys(properties).length === 0 ? (
            <p className="no-args">This tool takes no arguments</p>
          ) : (
            Object.entries(properties).map(([name, schema]) => (
              <FieldInput
                key={name}
                name={name}
                schema={schema}
                value={args[name]}
                onChange={val => setArg(name, val)}
                required={required.includes(name)}
              />
            ))
          )}

          <button
            className="call-btn"
            onClick={handleCall}
            disabled={loading}
          >
            {loading ? 'Calling...' : `Call ${tool.name}`}
          </button>
        </div>

        <div className="detail-col">
          <h3>
            Response
            {latency !== null && (
              <span className="latency-badge">{latency}ms</span>
            )}
          </h3>
          {result !== null ? (
            <pre className={`result-block ${isError ? 'result-error' : 'result-ok'}`}>
              {result}
            </pre>
          ) : (
            <div className="result-empty">Response will appear here</div>
          )}
        </div>
      </div>
    </div>
  );
}