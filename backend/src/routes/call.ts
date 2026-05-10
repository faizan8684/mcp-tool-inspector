import { Router, Request, Response } from 'express';
import { getSession } from '../mcp/session';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { session, toolName, args } = req.body;

  if (!session || !toolName) {
    res.status(400).json({ error: 'session and toolName are required' });
    return;
  }

  const s = getSession(session);
  if (!s) {
    res.status(404).json({ error: 'Session not found or expired' });
    return;
  }

  const start = Date.now();

  try {
    const result = await s.client.callTool({
      name: toolName,
      arguments: args ?? {},
    });

    res.json({
      result,
      latency: Date.now() - start,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Tool call failed';
    res.status(500).json({ error: message, latency: Date.now() - start });
  }
});

export default router;