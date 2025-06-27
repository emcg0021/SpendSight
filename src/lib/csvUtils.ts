import Papa from 'papaparse';
import supabase from './supabaseClient';

// Export campaign data to CSV and trigger download
type CampaignCsv = {
  name: string;
  spend: number;
  revenue: number;
  roi: number;
  date: string;
};

export const exportCampaignsToCsv = (campaigns: CampaignCsv[], userEmail: string) => {

  if (!campaigns.length) return;

  const headers = [
    'Campaign Name',
    'Ad Spend',
    'Revenue',
    'ROI (%)',
    'Date',
    'User Email',
  ];

  const rows = campaigns.map((c) => [
    c.name || '',
    `$${Number(c.spend).toFixed(2)}`,
    `$${Number(c.revenue).toFixed(2)}`,
    (Number(c.roi) * 100).toFixed(2),
    c.date || '',
    userEmail,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Ensure browser compatibility for download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ad-spend-campaigns-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Import CSV and insert parsed campaigns into Supabase
export const importCampaignsFromCsv = async (file: File, userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const campaigns = (results.data as { [key: string]: string }[]).map((row) => {
            const spend = parseFloat(row.spend);
            const revenue = parseFloat(row.revenue);

            return {
              user_id: userId,
              name: row.name?.trim() || 'Unnamed Campaign',
              spend: isNaN(spend) ? 0 : spend,
              revenue: isNaN(revenue) ? 0 : revenue,
              roi: !isNaN(spend) && spend !== 0 ? (revenue - spend) / spend : 0,
              date: row.date || new Date().toISOString().slice(0, 10),
            };
          });

          const { error } = await supabase.from('campaigns').insert(campaigns);
          if (error) return reject(error);
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      error: reject,
    });
  });
};