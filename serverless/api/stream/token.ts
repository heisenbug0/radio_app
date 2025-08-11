import type { VercelRequest, VercelResponse } from '@vercel/node';
import { StreamClient } from '@stream-io/node-sdk';
import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    let userId: string | null = null;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ', 2)[1];
      const verified = await clerk.verifyToken(token);
      userId = (verified?.sub as string) || null;
    }

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_SECRET_KEY;
    if (!apiKey || !apiSecret) return res.status(500).json({ error: 'Server misconfiguration' });

    const client = new StreamClient(apiKey, apiSecret, { timeout: 3000 });
    const expire = Math.round(Date.now() / 1000) + 60 * 60;
    const tokenIssued = Math.floor(Date.now() / 1000) - 60;
    const token = client.createToken(userId, expire, tokenIssued);

    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to create token' });
  }
}