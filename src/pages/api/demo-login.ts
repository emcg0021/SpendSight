import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo@fakeemail.com',
    password: 'demopass123',
  });

  if (error) {
    console.error('Demo login error:', error.message);
    return res.status(401).json({ error: error.message });
  }

  res.status(200).json({ session: data.session, user: data.user });
}