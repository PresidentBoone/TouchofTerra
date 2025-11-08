import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [currentStats, setCurrentStats] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [bedData, setBedData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historicalRes, bedsRes, alertsRes] = await Promise.all([
        fetch(`${API_URL}/api/stats/current`),
        fetch(`${API_URL}/api/stats/historical`),
        fetch(`${API_URL}/api/stats/beds`),
        fetch(`${API_URL}/api/alerts`),
      ]);

      const stats = await statsRes.json();
      const historical = await historicalRes.json();
      const beds = await bedsRes.json();
      const alertData = await alertsRes.json();

      setCurrentStats(stats);
      setHistoricalData(historical);
      setBedData(beds);
      setAlerts(alertData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#2a357a', '#f3e6ff', '#6a7aba', '#4a5a9a'];

  const shelteredData = currentStats
    ? [
        { name: 'Sheltered', value: currentStats.sheltered },
        { name: 'Unsheltered', value: currentStats.unsheltered },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-dark dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className="alert-banner danger">
              <h3 className="font-bold text-lg mb-2">⚠️ {alert.event}</h3>
              <p className="mb-2">{alert.headline}</p>
              {alert.instruction && (
                <p className="text-sm italic">{alert.instruction}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Current Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Homeless"
            value={currentStats?.totalHomeless || 0}
            subtitle="Individuals experiencing homelessness"
            icon="👥"
          />
          <MetricCard
            title="Sheltered"
            value={currentStats?.sheltered || 0}
            subtitle={`${Math.round((currentStats?.sheltered / currentStats?.totalHomeless) * 100)}% of total`}
            icon="🏠"
          />
          <MetricCard
            title="Unsheltered"
            value={currentStats?.unsheltered || 0}
            subtitle={`${Math.round((currentStats?.unsheltered / currentStats?.totalHomeless) * 100)}% of total`}
            icon="⛺"
          />
          <MetricCard
            title="Available Beds"
            value={bedData?.available || 0}
            subtitle={`${bedData?.total || 0} total capacity`}
            icon="🛏️"
          />
        </div>
      </div>

      {/* Population Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard
          title="Families"
          value={currentStats?.families || 0}
          subtitle="Family units"
          icon="👨‍👩‍👧‍👦"
        />
        <MetricCard
          title="Veterans"
          value={currentStats?.veterans || 0}
          subtitle="Military veterans"
          icon="🎖️"
        />
        <MetricCard
          title="Youth (Under 25)"
          value={currentStats?.youth || 0}
          subtitle="Young individuals"
          icon="👤"
        />
      </div>

      {/* Trend Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Historical Trend */}
        <div className="gradient-box">
          <h3 className="text-xl font-bold mb-4 text-white dark:text-white">
            5-Year Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#f3e6ff"
                strokeWidth={3}
                name="Total Homeless"
              />
              <Line
                type="monotone"
                dataKey="sheltered"
                stroke="#6a7aba"
                strokeWidth={2}
                name="Sheltered"
              />
              <Line
                type="monotone"
                dataKey="unsheltered"
                stroke="#ff6b6b"
                strokeWidth={2}
                name="Unsheltered"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sheltered vs Unsheltered */}
        <div className="gradient-box">
          <h3 className="text-xl font-bold mb-4 text-white dark:text-white">
            Current Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={shelteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {shelteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#6a7aba' : '#ff6b6b'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bed Availability */}
      <div className="gradient-box">
        <h3 className="text-xl font-bold mb-4 text-white dark:text-white">
          Shelter Bed Availability
        </h3>
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-white">
            <span>Occupancy: {bedData?.occupancyRate}%</span>
            <span>
              {bedData?.available} / {bedData?.total} beds available
            </span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-6">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-500"
              style={{ width: `${100 - (bedData?.occupancyRate || 0)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="gradient-box">
        <h3 className="text-xl font-bold mb-4 text-white dark:text-white">
          Community Stories
        </h3>
        <div className="space-y-4">
          <Story
            name="Sarah M."
            story="After losing my job during the pandemic, I found myself without a home. The resources on this dashboard helped me find shelter and case management support. I'm now in transitional housing and working toward stability."
          />
          <Story
            name="James T."
            story="As a veteran, I struggled with PTSD and housing instability. The veteran-specific services I found through the Coalition for the Homeless gave me the support I needed. I've been in permanent housing for 6 months now."
          />
        </div>
      </div>

      {/* Policy Insights */}
      <div className="gradient-box">
        <h3 className="text-xl font-bold mb-4 text-white dark:text-white">
          Key Insights & Research
        </h3>
        <ul className="space-y-3 text-white dark:text-white">
          <li className="flex items-start">
            <span className="mr-2">📊</span>
            <span>
              Louisville's homeless population has increased 16% over the past 5
              years, primarily driven by rising unsheltered numbers.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📈</span>
            <span>
              Eviction rates in Jefferson County have risen 23% since 2020,
              correlating with increased homelessness risk.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🏡</span>
            <span>
              Average rent for 1-bedroom apartment: $950/mo (2024), up from
              $750/mo in 2020, outpacing wage growth.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">💡</span>
            <span>
              Housing First programs have shown 85% success rate in maintaining
              stable housing for chronically homeless individuals.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon }) {
  return (
    <div className="metric-card text-white dark:text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold opacity-90">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-4xl font-bold mb-2">{value.toLocaleString()}</p>
      <p className="text-sm opacity-80">{subtitle}</p>
    </div>
  );
}

function Story({ name, story }) {
  return (
    <div className="bg-white bg-opacity-10 dark:bg-opacity-5 p-4 rounded-lg">
      <p className="italic text-white dark:text-white mb-2">"{story}"</p>
      <p className="text-sm text-white dark:text-white opacity-75">— {name}</p>
    </div>
  );
}

export default Dashboard;
