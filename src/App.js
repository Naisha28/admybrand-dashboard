import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, BarChart3, Download, Sun, Moon, RefreshCw, Search } from 'lucide-react';
import './App.css';

const ADmyBRANDDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  
  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [metrics, setMetrics] = useState({
    revenue: { value: '$0', change: '0%', trend: 'up' },
    users: { value: '0', change: '0%', trend: 'up' },
    conversions: { value: '0', change: '0%', trend: 'up' },
    growth: { value: '0%', change: '0%', trend: 'up' },
  });

  const itemsPerPage = 10;

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Mock data generators
  const generateRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      target: Math.floor(Math.random() * 45000) + 35000,
    }));
  };

  const generateUserData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      users: Math.floor(Math.random() * 1000) + 500,
      newUsers: Math.floor(Math.random() * 300) + 100,
    }));
  };

  const generateChannelData = () => [
    { name: 'Google Ads', value: 35, color: '#4285f4' },
    { name: 'Facebook', value: 28, color: '#1877f2' },
    { name: 'Instagram', value: 20, color: '#e4405f' },
    { name: 'Email', value: 12, color: '#34a853' },
    { name: 'Direct', value: 5, color: '#fbbc04' },
  ];

  const generateTableData = () => {
    const campaigns = ['Summer Sale', 'Black Friday', 'New Year', 'Spring Collection', 'Back to School', 'Holiday Special'];
    const channels = ['Google Ads', 'Facebook', 'Instagram', 'Email', 'LinkedIn'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      impressions: Math.floor(Math.random() * 100000) + 10000,
      clicks: Math.floor(Math.random() * 5000) + 500,
      conversions: Math.floor(Math.random() * 200) + 20,
      cost: Math.floor(Math.random() * 5000) + 1000,
      ctr: ((Math.random() * 5) + 1).toFixed(2),
      cpa: ((Math.random() * 50) + 10).toFixed(2),
    }));
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const revenue = generateRevenueData();
      const users = generateUserData();
      const channels = generateChannelData();
      const table = generateTableData();
      
      setRevenueData(revenue);
      setUserData(users);
      setChannelData(channels);
      setTableData(table);
      
      const totalRevenue = revenue.reduce((sum, item) => sum + item.revenue, 0);
      const totalUsers = users.reduce((sum, item) => sum + item.users, 0);
      const totalConversions = table.reduce((sum, item) => sum + item.conversions, 0);
      
      setMetrics({
        revenue: { value: `$${(totalRevenue / 1000).toFixed(0)}K`, change: '+12.5%', trend: 'up' },
        users: { value: `${(totalUsers / 1000).toFixed(1)}K`, change: '+8.2%', trend: 'up' },
        conversions: { value: totalConversions.toLocaleString(), change: '+15.3%', trend: 'up' },
        growth: { value: '+23.1%', change: '+2.1%', trend: 'up' },
      });
      
      setIsLoading(false);
    };

    loadData();
  }, [selectedDateRange]);

  // Real-time updates
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          users: { ...prev.users, value: `${(Math.random() * 10 + 5).toFixed(1)}K` }
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Table filtering and sorting
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = tableData.filter(item =>
      item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.channel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortField, sortDirection]);

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRevenueData(generateRevenueData());
      setUserData(generateUserData());
      setChannelData(generateChannelData());
      setTableData(generateTableData());
      setIsLoading(false);
    }, 1000);
  };

  // Metric Card Component
  const MetricCard = ({ title, value, change, icon: Icon, trend }) => {
    const isPositive = trend === 'up';
    
    if (isLoading) {
      return (
        <div className={`rounded-xl p-6 shadow-sm border animate-pulse ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`w-16 h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`w-24 h-8 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`w-20 h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      );
    }

    return (
      <div className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 group ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
            isPositive 
              ? darkMode ? 'bg-green-900/30' : 'bg-green-100'
              : darkMode ? 'bg-red-900/30' : 'bg-red-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              isPositive 
                ? darkMode ? 'text-green-400' : 'text-green-600'
                : darkMode ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive 
              ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
              : darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        </div>
        <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
      </div>
    );
  };

  // Chart Card Component
  const ChartCard = ({ title, children }) => {
    if (isLoading) {
      return (
        <div className={`rounded-xl p-6 shadow-sm border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`w-32 h-6 rounded mb-4 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`w-full h-64 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      );
    }

    return (
      <div className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        {children}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b sticky top-0 z-50 transition-colors duration-500 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ADmyBRAND Insights
                </h1>
                <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Digital Marketing Analytics
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="12m">Last 12 months</option>
              </select>
              
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
                disabled={isLoading}
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 transform ${
                  darkMode 
                    ? 'hover:bg-gray-700 bg-gray-700/50' 
                    : 'hover:bg-gray-100 bg-gray-100/50'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="relative">
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500 animate-pulse" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={metrics.revenue.value}
            change={metrics.revenue.change}
            icon={DollarSign}
            trend={metrics.revenue.trend}
          />
          <MetricCard
            title="Active Users"
            value={metrics.users.value}
            change={metrics.users.change}
            icon={Users}
            trend={metrics.users.trend}
          />
          <MetricCard
            title="Conversions"
            value={metrics.conversions.value}
            change={metrics.conversions.change}
            icon={Target}
            trend={metrics.conversions.trend}
          />
          <MetricCard
            title="Growth Rate"
            value={metrics.growth.value}
            change={metrics.growth.change}
            icon={TrendingUp}
            trend={metrics.growth.trend}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <ChartCard title="Revenue Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e0e7ff'} />
                <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* User Analytics Chart */}
          <ChartCard title="User Analytics">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e0e7ff'} />
                <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="users" fill="#8b5cf6" name="Total Users" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newUsers" fill="#06d6a0" name="New Users" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Traffic Sources and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pie Chart */}
          <ChartCard title="Traffic Sources">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelStyle={{ fill: darkMode ? '#ffffff' : '#000000', fontSize: '12px' }}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <ChartCard title="Quick Stats">
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>94.2%</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Customer Satisfaction</div>
                </div>
                <div className={`text-center p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>2.8s</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Load Time</div>
                </div>
                <div className={`text-center p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>$4.20</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cost Per Click</div>
                </div>
                <div className={`text-center p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>156%</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ROI</div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Data Table */}
        <div className={`rounded-xl shadow-sm border transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Campaign Performance
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  {[
                    { key: 'campaign', label: 'Campaign' },
                    { key: 'channel', label: 'Channel' },
                    { key: 'impressions', label: 'Impressions' },
                    { key: 'clicks', label: 'Clicks' },
                    { key: 'conversions', label: 'Conversions' },
                    { key: 'cost', label: 'Cost' },
                    { key: 'ctr', label: 'CTR' },
                    { key: 'cpa', label: 'CPA' },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200 ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-600' 
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{label}</span>
                        {sortField === key && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
              }`}>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className={`h-4 rounded animate-pulse ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  paginatedData.map((row) => (
                    <tr key={row.id} className={`transition-colors duration-200 ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {row.campaign}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.channel === 'Google Ads' ? 
                            darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800' :
                          row.channel === 'Facebook' ? 
                            darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-800' :
                          row.channel === 'Instagram' ? 
                            darkMode ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-800' :
                          row.channel === 'Email' ? 
                            darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800' :
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {row.channel}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {row.impressions.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {row.clicks.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {row.conversions}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        ${row.cost.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {row.ctr}%
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        ${row.cpa}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className={`px-6 py-4 border-t transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 border rounded-lg text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'border-gray-600 text-gray-400 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + Math.max(1, currentPage - 2);
                    return pageNum <= totalPages ? (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : darkMode 
                              ? 'border border-gray-600 text-gray-400 hover:bg-gray-700' 
                              : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ) : null;
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 border rounded-lg text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'border-gray-600 text-gray-400 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ADmyBRANDDashboard;