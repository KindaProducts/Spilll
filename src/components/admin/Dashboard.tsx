import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface EmailStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface CampaignMetrics {
  campaignName: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
}

const Dashboard: React.FC = () => {
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignMetrics[]>([]);
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const [statsResponse, campaignsResponse] = await Promise.all([
        axios.get(`/api/admin/stats?range=${dateRange}`),
        axios.get(`/api/admin/campaigns?range=${dateRange}`),
      ]);

      setEmailStats(statsResponse.data);
      setCampaigns(campaignsResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const conversionData = {
    labels: campaigns.map(c => c.campaignName),
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: campaigns.map(c => (c.converted / c.sent) * 100),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
      },
    ],
  };

  const emailMetricsData = {
    labels: ['Opened', 'Clicked', 'Converted'],
    datasets: [
      {
        data: [
          emailStats?.openRate || 0,
          emailStats?.clickRate || 0,
          emailStats?.conversionRate || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Email Campaign Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Subscribers"
          value={emailStats?.totalSubscribers || 0}
          change="+12%"
        />
        <StatCard
          title="Active Subscribers"
          value={emailStats?.activeSubscribers || 0}
          change="+8%"
        />
        <StatCard
          title="Emails Sent"
          value={emailStats?.emailsSent || 0}
          change="+15%"
        />
        <StatCard
          title="Conversion Rate"
          value={`${emailStats?.conversionRate.toFixed(1)}%` || '0%'}
          change="+5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
          <div className="h-80">
            <Chart type="line" data={conversionData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Email Metrics</h2>
          <div className="h-80">
            <Chart type="doughnut" data={emailMetricsData} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Campaign Details</h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Opened
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Clicked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Converted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.campaignName}>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.campaignName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.sent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.opened}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.clicked}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.converted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  change: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className="mt-2 flex items-baseline">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="ml-2 text-sm font-medium text-green-600">{change}</p>
    </div>
  </div>
);

export default Dashboard; 