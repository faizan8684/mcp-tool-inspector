import type { Tool } from '../api/client';

interface Props {
  tools: Tool[];
  selected: Tool | null;
  onSelect: (tool: Tool) => void;
}

export default function ToolList({ tools, selected, onSelect }: Props) {
  return (
    <div className="tool-list">
      <div className="tool-list-header">Tools</div>
      {tools.map(tool => (
        <div
          key={tool.name}
          className={`tool-item ${selected?.name === tool.name ? 'active' : ''}`}
          onClick={() => onSelect(tool)}
        >
          <span className="tool-item-name">{tool.name}</span>
          {tool.description && (
            <span className="tool-item-desc">{tool.description}</span>
          )}
        </div>
      ))}
    </div>
  );
}