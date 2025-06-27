// Stripe-powered subscribe button for upgrading to premium.

'use client';

import { useState } from 'react';

interface User {
  id: string;
  email: string;
}
export default function SubscribeButton({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('❌ No URL in response:', data);
        alert('Unable to start checkout. Please try again.');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      alert('Something went wrong during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
    >
      {loading ? 'Redirecting...' : 'Subscribe Now'}
    </button>
  );
}