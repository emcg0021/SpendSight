'use client';

import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();

  const handleDemoLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const res = await fetch('/api/demo-login');
      const session = await res.json();

      if (session?.session?.access_token) {
        const { error } = await supabase.auth.setSession({
          access_token: session.session.access_token,
          refresh_token: session.session.refresh_token,
        });

        if (!error) {
          router.push('/dashboard');
        } else {
          console.error('❌ Failed to set session:', error.message);
        }
      } else {
        console.error('❌ Demo login failed:', session?.error || 'Unknown error');
      }
    } catch (err) {
      console.error('❌ Demo login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome to SpendSight — Track Your Ad Spend. Maximize Your ROI.
         </h1>

        <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
          Simple, powerful campaign tracking that gives you clear insights into your marketing performance.
          No clutter. No confusion. Just profit.
        </p>

        <div className="flex flex-col items-center gap-4 mb-12">
          <a
            href="/signup"
            className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-lg hover:opacity-90 transition text-lg font-semibold"
          >
            Try It Free
          </a>

          <button
            onClick={handleDemoLogin}
            className="bg-white border border-black text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
          >
            Try Demo (Instant Preview)
          </button>
        </div>

        <Image
           src="/dashboard.png"
           alt="Dashboard Screenshot"
           width={1200}
           height={600}
           className="w-full rounded-xl shadow-lg"
         />

<div className="mt-16 grid gap-8 sm:grid-cols-2 text-gray-800">
  <div>
    <h2 className="text-xl font-semibold mb-2">📊 Campaign Performance at a Glance</h2>
    <p className="text-sm text-gray-700">
      Track spend, revenue, and net profit for each ad campaign in a clean, sortable dashboard.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold mb-2">📈 ROI Chart & Metrics</h2>
    <p className="text-sm text-gray-700">
      Visualize your return on investment over time and monitor total spend, revenue, and average ROI.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold mb-2">📥 CSV Import & Export</h2>
    <p className="text-sm text-gray-700">
      Easily upload historical campaigns or export your data anytime. Perfect for quick backups and audits.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold mb-2">🚀 Free & Premium Access</h2>
    <p className="text-sm text-gray-700">
      Use the free plan to track up to 3 campaigns, or upgrade for unlimited features and full insights.
    </p>
  </div>
</div> 
  </div>
    </div>
  );
}