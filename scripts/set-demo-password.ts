// This script updates the password of the demo user in Supabase.
// Run it manually if the demo password needs resetting for live preview access.

import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updatePassword() {
  const email = 'demo@fakeemail.com';
  const newPassword = 'demopass123';

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error('❌ Demo user not found:', userError?.message);
    return;
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });

  if (error) {
    console.error('❌ Failed to update password:', error.message);
  } else {
    console.info('✅ Demo password updated successfully!');
  }
}

updatePassword();