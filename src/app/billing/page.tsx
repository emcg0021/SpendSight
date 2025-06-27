// Billing page for premium upgrades. Displays current subscription status and upgrade button.

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient';
import SubscribeButton from '../components/SubscribeButton';

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUser = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const authUser = sessionData?.session?.user;

    if (!authUser) {
      router.push('/login');
      return;
    }

const { data: dbUser, error } = await supabase
  .from('users')
  .select('id, email, is_active', { head: false })
  .eq('id', authUser.id)
  .single();

    if (error) {
      console.error('Failed to load user from users table:', error);
      return;
    }

    setUser(dbUser);
    setLoading(false);
  };

  fetchUser();
}, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading billing info...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">Upgrade to Premium</h1>
        <p className="text-gray-600 text-center mb-6">
           Get full access to all features — unlimited campaigns, ROI analysis, CSV tools, and more.
        </p>

        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-indigo-300 mb-6">
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>✅ Unlimited campaigns</li>
            <li>✅ Profit margin calculations</li>
            <li>✅ Campaign editing</li>
            <li>✅ CSV import/export</li>
            <li>✅ Priority feature access</li>
          </ul>
        </div>

        {!user?.is_active ? (
  <SubscribeButton user={user} />
) : (
  <p className="text-center text-green-600 font-medium">
    ✅ You are subscribed
  </p>
)}

        <p className="text-sm text-gray-500 text-center mt-4">
          Just $9/month. Cancel anytime.
        </p>
      </div>
    </div>
  );
}