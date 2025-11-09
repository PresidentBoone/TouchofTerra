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
  AreaChart,
  Area,
} from 'recharts';
import VolunteerForm from './VolunteerForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function Dashboard() {
  const [currentStats, setCurrentStats] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [bedData, setBedData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);

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
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-tot-green-primary mx-auto"></div>
          <p className="mt-6 text-lg text-tot-text-light font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-tot-beige to-tot-beige-warm rounded-3xl shadow-tot-large p-8 border border-tot-green-sage/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-tot-text-dark mb-3">Louisville Homelessness Dashboard</h1>
            <p className="text-lg text-tot-text-light mb-2">Real-time data and insights for our community</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-tot-green-primary/10 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-tot-green-primary rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-tot-green-primary">Live Data Active</span>
              </div>
              <div className="flex items-center gap-2 bg-tot-teal/10 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5 text-tot-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="text-xs font-semibold text-tot-teal">Weather Alerts Monitored</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-semibold text-blue-600">Louisville Open Data</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-tot-medium">
              <p className="text-sm text-tot-text-light mb-1">Last Updated</p>
              <p className="text-lg font-semibold text-tot-text-dark">
                {new Date(currentStats?.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-tot-teal to-tot-green-primary rounded-3xl shadow-tot-large p-8 border-2 border-white/30 animate-slide-up">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Advanced Features Launching Soon
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                Coming Soon
              </span>
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              We're building powerful tools to maximize impact in Louisville. Here's what's next:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-white mb-1">Interactive Resource Map</h4>
                  <p className="text-sm text-white/80">Live locations of shelters, food banks, clinics with real-time availability</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-white mb-1">AI Help Chatbot</h4>
                  <p className="text-sm text-white/80">Instant answers: "I need shelter tonight" → get nearest resources</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-white mb-1">Volunteer & Donation Portal</h4>
                  <p className="text-sm text-white/80">Easy signup to help + transparent donation tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-white mb-1">Predictive Analytics</h4>
                  <p className="text-sm text-white/80">AI identifies at-risk neighborhoods for early intervention</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-white mb-1">Live Data Feeds</h4>
                  <p className="text-sm text-white/80">Auto-updating from HUD, Louisville Metro, weather alerts</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-white mb-1">Partner Organization Dashboards</h4>
                  <p className="text-sm text-white/80">Real-time coordination between shelters and service providers</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowVolunteerForm(true)}
                className="inline-flex items-center gap-2 bg-white text-tot-green-primary px-6 py-3 rounded-xl font-semibold shadow-tot-medium hover:shadow-tot-large transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Volunteer Signup
              </button>
              <a
                href="mailto:touchofterralouisville@gmail.com?subject=Partnership Inquiry"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-xl font-semibold shadow-tot-medium hover:shadow-tot-large transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Partner With Us
              </a>
              <p className="text-sm text-white/80">
                Want early access or have ideas? Reach out to touchofterralouisville@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 shadow-tot-medium"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-2">{alert.event}</h3>
                  <p className="text-red-800 mb-2">{alert.headline}</p>
                  {alert.instruction && (
                    <p className="text-sm text-red-700 italic bg-white/50 rounded-lg p-3 mt-3">
                      {alert.instruction}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics - Premium Cards */}
      <div>
        <h2 className="text-3xl font-bold text-tot-text-dark mb-6 flex items-center">
          <span className="w-1 h-8 bg-tot-green-primary rounded-full mr-3"></span>
          Current Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumMetricCard
            title="Total Homeless"
            value={currentStats?.totalHomeless || 0}
            subtitle="Individuals in Louisville"
            icon={
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            trend="+3.1%"
            trendUp={false}
          />
          <PremiumMetricCard
            title="Sheltered"
            value={currentStats?.sheltered || 0}
            subtitle={`${Math.round((currentStats?.sheltered / currentStats?.totalHomeless) * 100)}% of total`}
            icon={
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            trend="+2.4%"
            trendUp={true}
          />
          <PremiumMetricCard
            title="Unsheltered"
            value={currentStats?.unsheltered || 0}
            subtitle={`${Math.round((currentStats?.unsheltered / currentStats?.totalHomeless) * 100)}% of total`}
            icon={
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            trend="+5.2%"
            trendUp={false}
          />
          <PremiumMetricCard
            title="Available Beds"
            value={bedData?.available || 0}
            subtitle={`${bedData?.total || 0} total capacity`}
            icon={
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            trend="12% capacity"
            trendUp={true}
          />
        </div>
      </div>

      {/* Population Breakdown */}
      <div>
        <h2 className="text-3xl font-bold text-tot-text-dark mb-6 flex items-center">
          <span className="w-1 h-8 bg-tot-teal rounded-full mr-3"></span>
          Population Breakdown
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <DetailCard
            title="Families"
            value={currentStats?.families || 0}
            subtitle="Family units in need"
            iconBg="bg-tot-green-light"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <DetailCard
            title="Veterans"
            value={currentStats?.veterans || 0}
            subtitle="Military veterans"
            iconBg="bg-tot-teal"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
          <DetailCard
            title="Youth (Under 25)"
            value={currentStats?.youth || 0}
            subtitle="Young individuals"
            iconBg="bg-tot-brown"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Trend Charts - Premium Design */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Historical Trend */}
        <div className="bg-white rounded-3xl shadow-tot-large p-8 border border-tot-green-sage/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-tot-text-dark">5-Year Trend</h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-tot-green-primary"></div>
              <div className="w-3 h-3 rounded-full bg-tot-teal"></div>
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7BA05B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7BA05B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSheltered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5D8A7A" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#5D8A7A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUnsheltered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="year" stroke="#6B7C73" style={{ fontSize: '14px', fontWeight: 500 }} />
              <YAxis stroke="#6B7C73" style={{ fontSize: '14px', fontWeight: 500 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(123, 160, 91, 0.1)',
                }}
                animationDuration={300}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#7BA05B"
                strokeWidth={3}
                fill="url(#colorTotal)"
                name="Total Homeless"
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
              <Area
                type="monotone"
                dataKey="sheltered"
                stroke="#5D8A7A"
                strokeWidth={2.5}
                fill="url(#colorSheltered)"
                name="Sheltered"
                animationDuration={2200}
                animationEasing="ease-in-out"
              />
              <Area
                type="monotone"
                dataKey="unsheltered"
                stroke="#EF4444"
                strokeWidth={2.5}
                fill="url(#colorUnsheltered)"
                name="Unsheltered"
                animationDuration={2400}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sheltered vs Unsheltered */}
        <div className="bg-white rounded-3xl shadow-tot-large p-8 border border-tot-green-sage/10">
          <h3 className="text-2xl font-bold text-tot-text-dark mb-6">Current Distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={shelteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                stroke="white"
                strokeWidth={3}
                animationDuration={1500}
                animationBegin={200}
                animationEasing="ease-out"
              >
                {shelteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#5D8A7A' : '#EF4444'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(123, 160, 91, 0.1)',
                }}
                animationDuration={300}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bed Availability - Premium Design */}
      <div className="bg-gradient-to-br from-tot-beige to-white rounded-3xl shadow-tot-large p-8 border-2 border-tot-teal/20">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-tot-text-dark">
          <svg className="w-8 h-8 mr-3 text-tot-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Shelter Bed Availability
        </h3>
        <div className="mb-6">
          <div className="flex justify-between mb-3 text-lg font-medium text-tot-text-dark">
            <span>Occupancy Rate: {bedData?.occupancyRate}%</span>
            <span className="font-bold text-tot-green-primary">
              {bedData?.available} / {bedData?.total} beds available
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-tot-green-primary to-tot-green-light h-8 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-4"
              style={{ width: `${100 - (bedData?.occupancyRate || 0)}%` }}
            >
              <span className="text-sm font-bold text-white drop-shadow-lg">
                {100 - (bedData?.occupancyRate || 0)}% Available
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-tot-teal/10 rounded-xl p-4 text-center border border-tot-teal/20">
            <p className="text-sm text-tot-text-light mb-1">Emergency</p>
            <p className="text-2xl font-bold text-tot-text-dark">{bedData?.emergency || 340}</p>
            <p className="text-xs text-tot-text-light mt-1">beds</p>
          </div>
          <div className="bg-tot-teal/10 rounded-xl p-4 text-center border border-tot-teal/20">
            <p className="text-sm text-tot-text-light mb-1">Transitional</p>
            <p className="text-2xl font-bold text-tot-text-dark">{bedData?.transitional || 298}</p>
            <p className="text-xs text-tot-text-light mt-1">beds</p>
          </div>
          <div className="bg-tot-teal/10 rounded-xl p-4 text-center border border-tot-teal/20">
            <p className="text-sm text-tot-text-light mb-1">Permanent</p>
            <p className="text-2xl font-bold text-tot-text-dark">{bedData?.permanent || 212}</p>
            <p className="text-xs text-tot-text-light mt-1">beds</p>
          </div>
        </div>
      </div>

      {/* Stories Section - Premium Design */}
      <div className="bg-gradient-to-br from-tot-beige to-tot-beige-warm rounded-3xl shadow-tot-large p-8 border border-tot-green-sage/20">
        <h3 className="text-2xl font-bold text-tot-text-dark mb-6 flex items-center">
          <svg className="w-8 h-8 mr-3 text-tot-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Community Stories
        </h3>
        <div className="space-y-6">
          <PremiumStory
            name="Sarah M."
            story="After losing my job during the pandemic, I found myself without a home. The resources on this dashboard helped me find shelter and case management support. I'm now in transitional housing and working toward stability."
          />
          <PremiumStory
            name="James T."
            story="As a veteran, I struggled with PTSD and housing instability. The veteran-specific services I found through the Coalition for the Homeless gave me the support I needed. I've been in permanent housing for 6 months now."
          />
        </div>
      </div>

      {/* Policy Insights - Premium Design */}
      <div className="bg-gradient-to-br from-white to-tot-beige rounded-3xl shadow-tot-large p-8 border-2 border-tot-green-primary/30">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-tot-text-dark">
          <svg className="w-8 h-8 mr-3 text-tot-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Key Insights & Research
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <InsightCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
            text="Louisville's homeless population has increased 16% over the past 5 years, primarily driven by rising unsheltered numbers."
          />
          <InsightCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            text="Eviction rates in Jefferson County have risen 23% since 2020, correlating with increased homelessness risk."
          />
          <InsightCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            text="Average rent for 1-bedroom apartment: $950/mo (2024), up from $750/mo in 2020, outpacing wage growth."
          />
          <InsightCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            text="Housing First programs have shown 85% success rate in maintaining stable housing for chronically homeless individuals."
          />
        </div>
      </div>

      {/* Volunteer Form Modal */}
      <VolunteerForm
        isOpen={showVolunteerForm}
        onClose={() => setShowVolunteerForm(false)}
      />
    </div>
  );
}

// Premium Metric Card Component with Count-Up Animation
function PremiumMetricCard({ title, value, subtitle, icon, trend, trendUp }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!value) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white rounded-2xl shadow-tot-medium hover:shadow-tot-large p-6 border border-tot-green-sage/10 transition-all duration-300 hover:scale-105 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-tot-green-primary to-tot-green-light rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-tot-text-light mb-2">{title}</h3>
      <p className="text-4xl font-bold text-tot-text-dark mb-2 tabular-nums">{displayValue.toLocaleString()}</p>
      <p className="text-sm text-tot-text-light">{subtitle}</p>
    </div>
  );
}

// Detail Card Component
function DetailCard({ title, value, subtitle, iconBg, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-tot-medium p-6 border border-tot-green-sage/10 hover:shadow-tot-large transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className={`${iconBg} rounded-xl p-3`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-tot-text-light">{title}</h3>
          <p className="text-3xl font-bold text-tot-text-dark">{value.toLocaleString()}</p>
        </div>
      </div>
      <p className="text-sm text-tot-text-light pl-16">{subtitle}</p>
    </div>
  );
}

// Premium Story Component
function PremiumStory({ name, story }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-tot-green-sage/20 hover:bg-white/80 transition-all duration-300">
      <svg className="w-10 h-10 text-tot-green-primary/30 mb-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-tot-text-dark italic leading-relaxed mb-4 text-lg">
        "{story}"
      </p>
      <p className="text-sm font-semibold text-tot-green-primary flex items-center">
        <span className="w-8 h-0.5 bg-tot-green-primary mr-3"></span>
        {name}
      </p>
    </div>
  );
}

// Insight Card Component
function InsightCard({ icon, text }) {
  return (
    <div className="bg-tot-green-sage/20 rounded-xl p-5 hover:bg-tot-green-sage/30 transition-all duration-300 border border-tot-green-primary/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-tot-green-primary/20 rounded-lg p-2 text-tot-green-primary">
          {icon}
        </div>
        <p className="text-tot-text-dark leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default Dashboard;
