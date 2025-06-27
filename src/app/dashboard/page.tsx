'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import RoiChart from '../components/RoiChart';
import SubscribeButton from '../components/SubscribeButton';

import supabase from '../../lib/supabaseClient';
import { exportCampaignsToCsv, importCampaignsFromCsv } from '../../lib/csvUtils';
import { isPremium } from '../../lib/helpers';

type User = {
  id: string;
  email: string;
  is_active?: boolean;
};

type Campaign = {
  id: number;
  user_id: string;
  name: string;
  spend: number;
  revenue: number;
  roi: number;
  date: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState({ name: '', spend: '', revenue: '', date: '' });
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', spend: '', revenue: '', date: '' });

  const maxFreeCampaigns = 3;
  const reachedLimit = !user?.is_active && campaigns.length >= maxFreeCampaigns;
  const isPro = isPremium(user);
  const isDemoUser = user?.email === 'demo@fakeemail.com';

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data: userData } = await supabase
        .from('users')
        .select('is_active')
        .eq('id', user.id)
        .single();

      setUser({ id: user.id, email: user.email ?? '', is_active: userData?.is_active === undefined ? false : userData.is_active });
    };

    getUser();
  }, []);

  useEffect(() => {
    if (user?.id) fetchCampaigns(user.id);
  }, [user]);

  const fetchCampaigns = async (userId: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!error && data) setCampaigns(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const date = form.date.trim();
    const spend = parseFloat(form.spend);
    const revenue = parseFloat(form.revenue);

    if (!name || name.length < 3 || !date || isNaN(spend) || isNaN(revenue)) {
      toast.error('Enter a valid name (3+ chars), date, spend, and revenue.');
      return;
    }

    const duplicate = campaigns.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      toast.error('Duplicate campaign name.');
      return;
    }

    const roi = spend !== 0 ? (revenue - spend) / spend : 0;

    if (!user) {
      toast.error('User not found.');
      return;
    }
    const { error } = await supabase.from('campaigns').insert([{
      user_id: user.id,
      name,
      spend,
      revenue,
      roi,
      date,
    }]);

    if (!error) {
      setForm({ name: '', spend: '', revenue: '', date: '' });
      toast.success('Campaign added!');
      if (user?.id) fetchCampaigns(user.id);
    } else {
      toast.error('Failed to add campaign.');
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (!error && user?.id) {
      fetchCampaigns(user.id);
      toast.success('Campaign deleted!');
    } else {
      toast.error('Delete failed.');
    }
  };

  const handleEditClick = (campaign: any) => {
    setEditingCampaignId(campaign.id);
    setEditForm({
      name: campaign.name,
      spend: campaign.spend.toString(),
      revenue: campaign.revenue.toString(),
      date: campaign.date,
    });
  };

  const handleUpdateCampaign = async (e: any) => {
    e.preventDefault();
    if (!editingCampaignId) return;

    const spend = parseFloat(editForm.spend);
    const revenue = parseFloat(editForm.revenue);
    const roi = spend !== 0 ? (revenue - spend) / spend : 0;

    const { error } = await supabase.from('campaigns')
      .update({
        name: editForm.name,
        spend,
        revenue,
        roi,
        date: editForm.date,
      })
      .eq('id', editingCampaignId);

    if (!error && user?.id) {
      fetchCampaigns(user.id);
      setEditingCampaignId(null);
      setEditForm({ name: '', spend: '', revenue: '', date: '' });
      toast.success('Campaign updated!');
    } else {
      toast.error('Update failed.');
    }
  };

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const netProfit = totalRevenue - totalSpend;
  const averageROI = campaigns.length > 0
    ? (campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">

        {!isPro && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center text-sm text-gray-700">
            <p className="mb-2">You&rsquo;re on the free plan.</p>
            <p className="mb-4">Upgrade to unlock unlimited campaigns and pro features.</p>
            {user && <SubscribeButton user={user} />}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2">SpendSight</h1>

        {isDemoUser && (
          <span
            className="inline-block bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2"
            data-tooltip-id="demo-badge-tip"
            data-tooltip-content="You're viewing a read-only demo version of the app"
          >
            Demo Mode
          </span>
        )}

        <p className="text-sm text-gray-700 mb-6">
          Logged in as: <span className="font-semibold">{user?.email}</span>
        </p>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center text-sm md:text-base">
          {[
            { label: 'Total Spend', value: `$${totalSpend.toFixed(2)}`, tip: 'Sum of all ad spend.' },
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, tip: 'Combined revenue from all campaigns.' },
            { label: 'Net Profit', value: `$${netProfit.toFixed(2)}`, tip: 'Revenue minus ad spend.' },
            { label: 'Avg. ROI', value: `${averageROI.toFixed(2)}%`, tip: 'Average return on investment.' },
          ].map(({ label, value, tip }) => (
            <div
              key={label}
              className="bg-gray-100 p-4 rounded shadow"
              data-tooltip-id="roi-tip"
              data-tooltip-content={tip}
            >
              <p className="text-gray-700">{label}</p>
              <p className="font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {(isPro || !reachedLimit) ? (
          <form onSubmit={handleSubmit} className="space-y-4 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Campaign Name', 'Ad Spend', 'Revenue', 'Date'].map((label, i) => (
                <input
                  key={label}
                  type={label === 'Date' ? 'date' : 'text'}
                  placeholder={label !== 'Date' ? label : undefined}
                  step="0.01"
                  value={form[['name', 'spend', 'revenue', 'date'][i] as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [['name', 'spend', 'revenue', 'date'][i] as keyof typeof form]: e.target.value })}
                  required
                  className="w-full p-2 border rounded text-gray-900"
                />
              ))}
            </div>
            <button type="submit" className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2 rounded hover:opacity-90 transition">
              Add Campaign
            </button>
          </form>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center text-sm text-gray-700">
            <p className="mb-2">You&rsquo;ve reached the free campaign limit of {maxFreeCampaigns}.</p>
            <p className="mb-4">Upgrade to premium for unlimited campaigns.</p>
            {user && <SubscribeButton user={user} />}
          </div>
        )}

        {user && (
          <RoiChart
            campaigns={campaigns}
            isPro={isPro}
            user={{
              ...user,
              is_active: user.is_active === undefined ? false : user.is_active,
            }}
          />
        )}

        <h2 className="text-xl font-semibold mb-4">Your Campaign History</h2>

        {isPro && (
          <div className="flex flex-col md:flex-row gap-4 justify-end mb-4">
            <button
              onClick={() => user && exportCampaignsToCsv(campaigns, user.email)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              data-tooltip-id="export-tip"
              data-tooltip-content="Download your campaign data as a CSV file"
            >
              Export CSV
            </button>

            <div
              className="relative w-full md:w-auto"
              data-tooltip-id="import-tip"
              data-tooltip-content="Upload campaigns from a CSV file"
            >
              <label
                htmlFor="csv-upload"
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
              >
                Import CSV
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && user?.id) {
                    try {
                      await importCampaignsFromCsv(file, user.id);
                      fetchCampaigns(user.id);
                    } catch (error) {
                      console.error('Import failed:', error);
                    }
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
        )}

        {editingCampaignId && (
          <form onSubmit={handleUpdateCampaign} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'spend', 'revenue', 'date'].map((field) => (
                <input
                  key={field}
                  type={field === 'date' ? 'date' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={editForm[field as keyof typeof editForm]}
                  onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  required
                  className="w-full p-2 border rounded text-gray-900"
                />
              ))}
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Save Changes</button>
              <button type="button" onClick={() => setEditingCampaignId(null)} className="text-gray-600 underline text-sm">Cancel</button>
            </div>
          </form>
        )}

        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full border text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-black">
                  {['Name', 'Spend', 'Revenue', 'ROI', 'Date', 'Actions'].map(header => (
                    <th key={header} className="p-2 border">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-4">No campaigns yet.</td>
                  </tr>
                ) : (
                  campaigns.map(c => (
                    <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-3 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-3 py-3 text-gray-700">${c.spend}</td>
                      <td className="px-3 py-3 text-gray-700">${c.revenue}</td>
                      <td className="px-3 py-3 text-gray-700">{(c.roi * 100).toFixed(2)}%</td>
                      <td className="px-3 py-3 text-gray-700">{c.date}</td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex gap-3 justify-center">
                          <button onClick={() => handleEditClick(c)} className="text-blue-600 hover:underline text-sm">Edit</button>
                          <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tooltips */}
        <Tooltip id="roi-tip" />
        <Tooltip id="demo-badge-tip" />
        <Tooltip id="export-tip" />
        <Tooltip id="import-tip" />
      </div>
    </div>
  );
}