// ROI Chart component with premium gating and responsive layout.

'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import SubscribeButton from './SubscribeButton';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function RoiChart({
  campaigns,
  isPro,
  user,
}: {
  campaigns: any[];
  isPro: boolean;
  user: any;
}) {
  const sorted = [...campaigns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const data = {
    labels: sorted.map((c) => c.date),
    datasets: [
      {
        label: 'ROI (%)',
        data: sorted.map((c) => (c.roi * 100).toFixed(2)),
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'ROI (%)',
        },
        beginAtZero: true,
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="mb-10 w-full overflow-x-auto min-w-[300px]">
     <div className="relative min-w-[300px]">
       <h2 className="text-lg font-semibold mb-4">ROI Over Time</h2>

      {!isPro && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
      <div className="text-center px-4">
    <p className="text-gray-800 font-medium mb-2">Upgrade to unlock ROI chart</p>
    <SubscribeButton user={user} />
  </div>
</div>
      )}

      <div className={!isPro ? 'opacity-30 pointer-events-none' : ''}>
        <Line data={data} options={options} />
      </div>
    </div>
    </div>
  );
}