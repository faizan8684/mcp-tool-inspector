import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { createMCPClient, TransportType } from '../mcp/client';
import { createSession } from '../mcp/session';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { type, command, url } = req.body;

  if (!type || !['stdio', 'sse'].includes(type)) {
    res.status(400).json({ error: 'type must be "stdio" or "sse"' });
    return;
  }

  if (type === 'stdio' && !command) {
    res.status(400).json({ error: 'command is required for stdio transport' });
    return;
  }

  if (type === 'sse' && !url) {
    res.status(400).json({ error: 'url is required for sse transport' });
    return;
  }

  try {
    const { client, tools } = await createMCPClient({ type: type as TransportType, command, url });
    const sessionId = randomUUID();
    createSession(sessionId, client, tools);

    res.json({ sessionId, toolCount: tools.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to connect';
    res.status(500).json({ error: message });
  }
});

export default router;