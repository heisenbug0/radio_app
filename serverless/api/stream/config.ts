import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing API key' });
  return res.status(200).json({ stream_api_key: apiKey });
}