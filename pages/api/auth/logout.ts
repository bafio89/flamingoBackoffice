import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Rimuove il cookie di sessione
  res.setHeader('Set-Cookie', [
    'auth-session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict',
  ]);

  return res.status(200).json({ success: true, message: 'Logout effettuato' });
}
