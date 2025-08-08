import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, email } = req.body as { userId?: string; email?: string };

  if (!userId || !email) {
    return res.status(400).json({ error: 'Missing userId or email' });
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    // Prefer the incoming request’s origin; fallback to Vercel URL or your public base
    const origin =
      (req.headers.origin as string) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      metadata: { userId },
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/billing?checkout=cancelled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return res.status(500).json({ error: 'Stripe session creation failed' });
  }
}