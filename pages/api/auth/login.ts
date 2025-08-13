import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.GLOBAL_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ message: 'Server configuration error' });
  }

  if (password === correctPassword) {
    // Crea un token di sessione che dura 8 ore
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    // Imposta il cookie di sessione
    res.setHeader('Set-Cookie', [
      `auth-session=authenticated; HttpOnly; Path=/; Expires=${expiresAt.toUTCString()}; SameSite=Strict`,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Autenticazione riuscita',
      expiresAt: expiresAt.toISOString()
    });
  } else {
    return res.status(401).json({ message: 'Password non corretta' });
  }
}
