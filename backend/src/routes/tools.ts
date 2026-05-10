import { Router, Request, Response } from 'express';
import { getSession } from '../mcp/session';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { session } = req.query;

  if (!session || typeof session !== 'string') {
    res.status(400).json({ error: 'session query param is required' });
    return;
  }

  const s = getSession(session);
  if (!s) {
    res.status(404).json({ error: 'Session not found or expired' });
    return;
  }

  res.json({ tools: s.tools });
});

export default router;