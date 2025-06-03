import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { ArrowUp, ArrowDown, Briefcase, DollarSign, Calendar, Layers, TrendingUp, AlertTriangle, Eye, Clock, RefreshCw, Globe, ExternalLink, Newspaper } from 'lucide-react';

const IPOTrackerApp = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filterSector, setFilterSector] = useState('All');
  const [newsTab, setNewsTab] = useState('all');
  
  // State for real data
  const [upcomingIPOs, setUpcomingIPOs] = useState([]);
  const [angelInvestments, setAngelInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API service functions
  const fetchUpcomingIPOs = async () => {
    try {
      const response = await fetch('/api/ipo-calendar');
      if (!response.ok) throw new Error('Failed to fetch IPO data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming IPOs:', error);
      throw error;
    }
  };

  const fetchAngelInvestments = async () => {
    try {
      const response = await fetch('/api/angel-investments');
      if (!response.ok) throw new Error('Failed to fetch angel investment data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching angel investments:', error);
      throw error;
    }
  };

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ipos, angels] = await Promise.all([
          fetchUpcomingIPOs(),
          fetchAngelInvestments()
        ]);
        
        setUpcomingIPOs(ipos);
        setAngelInvestments(angels);
        setLastUpdated(new Date());
        
        // Set first company as selected by default
        if (ipos.length > 0 && !selectedCompany) {
          setSelectedCompany(ipos[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [ipos, angels] = await Promise.all([
        fetchUpcomingIPOs(),
        fetchAngelInvestments()
      ]);
      
      setUpcomingIPOs(ipos);
      setAngelInvestments(angels);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Combined news from all companies for the news tab
  const allNews = [...upcomingIPOs, ...angelInvestments].flatMap(company => 
    (company.news || []).map(item => ({
      ...item,
      company: company.name,
      sector: company.sector
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Filter options
  const sectors = ['All', ...new Set([
    ...upcomingIPOs.map(ipo => ipo.sector),
    ...angelInvestments.map(angel => angel.sector)
  ])];
  
  const newsSectors = ['All', ...new Set(allNews.map(item => item.sector))];
  
  // Filtered data
  const filteredIPOs = upcomingIPOs.filter(ipo => 
    filterSector === 'All' || ipo.sector === filterSector
  );
  
  const filteredNews = allNews.filter(item => 
    newsTab === 'all' || item.sector === newsTab
  );
  
  // Risk color mapping
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FFC107';
      case 'Medium-High': return '#FF9800';
      case 'High': return '#F44336';
      case 'Very High': return '#B71C1C';
      default: return '#9E9E9E';
    }
  };
  
  // Stage progress percentage
  const getStageProgress = (stage) => {
    const stages = ['Rumored', 'Preparing', 'Filed', 'Roadshow', 'Pricing', 'Listed'];
    return ((stages.indexOf(stage) + 1) / stages.length) * 100;
  };
  
  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-slate-200">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-xl text-slate-700 font-medium">Loading IPO data...</p>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
          <div className="text-red-500 text-center mb-6">
            <AlertTriangle size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Error Loading Data</h2>
          <p className="text-slate-600 text-center mb-8">{error}</p>
          <button 
            onClick={handleRefresh}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Company Detail View
  const CompanyDetail = ({ company }) => {
    if (!company) return null;
    
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 h-full overflow-y-auto">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{company.name}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {company.sector}
              </span>
              <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {company.stage}
              </span>
              {company.symbol && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {company.symbol}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-800 mb-1">
              ${activeTab === 'upcoming' ? company.targetValuation : company.targetRaise}
              {activeTab === 'upcoming' ? 'B' : 'M'}
            </div>
            <div className="text-sm text-slate-500 mb-2">
              {activeTab === 'upcoming' ? 'Target Valuation' : 'Target Raise'}
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className="flex items-center text-sm font-medium" style={{ color: company.growth > 100 ? '#10B981' : '#EF4444' }}>
                {company.growth > 100 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {company.growth}% YoY
              </span>
              <span 
                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: getRiskColor(company.risk) }}
              >
                {company.risk} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Company Website */}
        {company.website && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Globe size={20} className="mr-3 text-blue-500" />
              Company Website
            </h3>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              <ExternalLink size={18} className="mr-2" />
              Visit {company.name}
            </a>
          </div>
        )}
        
        {/* IPO Timeline */}
        {activeTab === 'upcoming' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Calendar size={20} className="mr-3 text-blue-500" />
              IPO Timeline
            </h3>
            <div className="bg-slate-100 h-3 rounded-full mb-6 relative overflow-hidden">
              <div 
                className="absolute h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${getStageProgress(company.stage)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Filing Date</div>
                <div className="text-lg font-semibold text-slate-800">{formatDate(company.filingDate)}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Expected Debut</div>
                <div className="text-lg font-semibold text-slate-800">{formatDate(company.expectedDebutDate)}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Roadshow Status</div>
                <div className="text-lg font-semibold text-slate-800">{company.roadshowStatus}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Last Private Valuation</div>
                <div className="text-lg font-semibold text-slate-800">${company.lastValuation}B</div>
              </div>
              {company.exchange && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 md:col-span-2">
                  <div className="text-sm text-slate-500 font-medium mb-1">Exchange</div>
                  <div className="text-lg font-semibold text-slate-800">{company.exchange}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Angel Investment Details */}
        {activeTab === 'angel' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <TrendingUp size={20} className="mr-3 text-blue-500" />
              Traction & Team
            </h3>
            <div className="space-y-6">
              {company.traction && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-medium mb-2">Traction</div>
                  <div className="text-base text-slate-800 leading-relaxed">{company.traction}</div>
                </div>
              )}
              {company.team && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-medium mb-2">Team Background</div>
                  <div className="text-base text-slate-800 leading-relaxed">{company.team}</div>
                </div>
              )}
              {company.investors && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-medium mb-2">Current Investors</div>
                  <div className="text-base text-slate-800 leading-relaxed">{company.investors}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Revenue Growth Chart */}
        {company.revenueGrowth && company.revenueGrowth.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <TrendingUp size={20} className="mr-3 text-blue-500" />
              Revenue Growth
            </h3>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={company.revenueGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Revenue ($M)" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      dot={{ r: 8, fill: '#3B82F6' }}
                      activeDot={{ r: 10, fill: '#1D4ED8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* Key Metrics */}
        {company.keyMetrics && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Layers size={20} className="mr-3 text-blue-500" />
              Key Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {company.keyMetrics.cac && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium mb-2">CAC</div>
                  <div className="text-2xl font-bold text-blue-800">{company.keyMetrics.cac}</div>
                </div>
              )}
              {company.keyMetrics.ltv && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="text-sm text-green-600 font-medium mb-2">LTV</div>
                  <div className="text-2xl font-bold text-green-800">{company.keyMetrics.ltv}</div>
                </div>
              )}
              {company.keyMetrics.margins && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="text-sm text-purple-600 font-medium mb-2">Margins</div>
                  <div className="text-2xl font-bold text-purple-800">{company.keyMetrics.margins}</div>
                </div>
              )}
              {company.keyMetrics.burnRate && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="text-sm text-orange-600 font-medium mb-2">Burn Rate</div>
                  <div className="text-2xl font-bold text-orange-800">{company.keyMetrics.burnRate}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Recent News */}
        {company.news && company.news.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Eye size={20} className="mr-3 text-blue-500" />
              Recent News
            </h3>
            <div className="space-y-4">
              {company.news.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-6 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 font-medium mb-2">{formatDate(item.date)}</div>
                      <div className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 flex items-center">
                        {item.title}
                        <ExternalLink size={16} className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">IPO Tracker</h1>
              <p className="text-lg text-slate-600 mb-2">
                Deep analysis of upcoming IPOs and promising investment opportunities
              </p>
              {lastUpdated && (
                <p className="text-sm text-slate-500">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <div className="mt-6 lg:mt-0 flex gap-3 items-center flex-wrap">
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-lg font-medium"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-lg transition-all font-medium ${
                  activeTab === 'upcoming' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                Upcoming IPOs
              </button>
              <button 
                onClick={() => setActiveTab('angel')}
                className={`px-6 py-2 rounded-lg transition-all font-medium ${
                  activeTab === 'angel' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                Angel Investments
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`px-6 py-2 rounded-lg flex items-center transition-all font-medium ${
                  activeTab === 'news' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <Newspaper size={16} className="mr-2" />
                Latest News
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        {activeTab === 'news' ? (
          // News Tab Content
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Newspaper size={28} className="mr-3 text-blue-500" />
                Latest IPO & Investment News
              </h2>
              
              <div>
                <select 
                  value={newsTab}
                  onChange={(e) => setNewsTab(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {newsSectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-6">
              {filteredNews.length > 0 ? (
                filteredNews.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-6 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-xl font-semibold text-slate-800 group-hover:text-blue-700 mb-3">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(item.date)}
                          </span>
                          <span className="font-medium text-blue-600">{item.company}</span>
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                            {item.sector}
                          </span>
                        </div>
                      </div>
                      <ExternalLink size={20} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4" />
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-16 text-slate-500">
                  <Newspaper size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No news available for the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Company Lists and Details
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company List */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {activeTab === 'upcoming' ? 'Upcoming IPOs' : 'Angel Opportunities'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {activeTab === 'upcoming' ? filteredIPOs.length : angelInvestments.length} companies
                    </p>
                  </div>
                  
                  <div>
                    <select 
                      value={filterSector}
                      onChange={(e) => setFilterSector(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {sectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {(activeTab === 'upcoming' ? filteredIPOs : angelInvestments).length > 0 ? (
                    (activeTab === 'upcoming' ? filteredIPOs : angelInvestments).map(company => (
                      <div 
                        key={company.id}
                        onClick={() => setSelectedCompany(company)}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                          selectedCompany?.id === company.id 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg text-slate-800 mb-2">{company.name}</div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                              <span className="font-medium">{company.sector}</span>
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {company.stage}
                              </span>
                            </div>
                          </div>
                      ˚˚
cat > src/IPOTracker.js << 'EOF'
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { ArrowUp, ArrowDown, Briefcase, DollarSign, Calendar, Layers, TrendingUp, AlertTriangle, Eye, Clock, RefreshCw, Globe, ExternalLink, Newspaper } from 'lucide-react';

const IPOTrackerApp = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filterSector, setFilterSector] = useState('All');
  const [newsTab, setNewsTab] = useState('all');
  
  // State for real data
  const [upcomingIPOs, setUpcomingIPOs] = useState([]);
  const [angelInvestments, setAngelInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API service functions
  const fetchUpcomingIPOs = async () => {
    try {
      const response = await fetch('/api/ipo-calendar');
      if (!response.ok) throw new Error('Failed to fetch IPO data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming IPOs:', error);
      throw error;
    }
  };

  const fetchAngelInvestments = async () => {
    try {
      const response = await fetch('/api/angel-investments');
      if (!response.ok) throw new Error('Failed to fetch angel investment data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching angel investments:', error);
      throw error;
    }
  };

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ipos, angels] = await Promise.all([
          fetchUpcomingIPOs(),
          fetchAngelInvestments()
        ]);
        
        setUpcomingIPOs(ipos);
        setAngelInvestments(angels);
        setLastUpdated(new Date());
        
        // Set first company as selected by default
        if (ipos.length > 0 && !selectedCompany) {
          setSelectedCompany(ipos[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [ipos, angels] = await Promise.all([
        fetchUpcomingIPOs(),
        fetchAngelInvestments()
      ]);
      
      setUpcomingIPOs(ipos);
      setAngelInvestments(angels);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Combined news from all companies for the news tab
  const allNews = [...upcomingIPOs, ...angelInvestments].flatMap(company => 
    (company.news || []).map(item => ({
      ...item,
      company: company.name,
      sector: company.sector
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Filter options
  const sectors = ['All', ...new Set([
    ...upcomingIPOs.map(ipo => ipo.sector),
    ...angelInvestments.map(angel => angel.sector)
  ])];
  
  const newsSectors = ['All', ...new Set(allNews.map(item => item.sector))];
  
  // Filtered data
  const filteredIPOs = upcomingIPOs.filter(ipo => 
    filterSector === 'All' || ipo.sector === filterSector
  );
  
  const filteredNews = allNews.filter(item => 
    newsTab === 'all' || item.sector === newsTab
  );
  
  // Risk color mapping
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FFC107';
      case 'Medium-High': return '#FF9800';
      case 'High': return '#F44336';
      case 'Very High': return '#B71C1C';
      default: return '#9E9E9E';
    }
  };
  
  // Stage progress percentage
  const getStageProgress = (stage) => {
    const stages = ['Rumored', 'Preparing', 'Filed', 'Roadshow', 'Pricing', 'Listed'];
    return ((stages.indexOf(stage) + 1) / stages.length) * 100;
  };
  
  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-slate-200">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-xl text-slate-700 font-medium">Loading IPO data...</p>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
          <div className="text-red-500 text-center mb-6">
            <AlertTriangle size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Error Loading Data</h2>
          <p className="text-slate-600 text-center mb-8">{error}</p>
          <button 
            onClick={handleRefresh}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Company Detail View
  const CompanyDetail = ({ company }) => {
    if (!company) return null;
    
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 h-full overflow-y-auto">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{company.name}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {company.sector}
              </span>
              <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {company.stage}
              </span>
              {company.symbol && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {company.symbol}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-800 mb-1">
              ${activeTab === 'upcoming' ? company.targetValuation : company.targetRaise}
              {activeTab === 'upcoming' ? 'B' : 'M'}
            </div>
            <div className="text-sm text-slate-500 mb-2">
              {activeTab === 'upcoming' ? 'Target Valuation' : 'Target Raise'}
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className="flex items-center text-sm font-medium" style={{ color: company.growth > 100 ? '#10B981' : '#EF4444' }}>
                {company.growth > 100 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {company.growth}% YoY
              </span>
              <span 
                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: getRiskColor(company.risk) }}
              >
                {company.risk} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Company Website */}
        {company.website && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Globe size={20} className="mr-3 text-blue-500" />
              Company Website
            </h3>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              <ExternalLink size={18} className="mr-2" />
              Visit {company.name}
            </a>
          </div>
        )}
        
        {/* IPO Timeline */}
        {activeTab === 'upcoming' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Calendar size={20} className="mr-3 text-blue-500" />
              IPO Timeline
            </h3>
            <div className="bg-slate-100 h-3 rounded-full mb-6 relative overflow-hidden">
              <div 
                className="absolute h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${getStageProgress(company.stage)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Filing Date</div>
                <div className="text-lg font-semibold text-slate-800">{formatDate(company.filingDate)}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Expected Debut</div>
                <div className="text-lg font-semibold text-slate-800">{formatDate(company.expectedDebutDate)}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Roadshow Status</div>
                <div className="text-lg font-semibold text-slate-800">{company.roadshowStatus}</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 font-medium mb-1">Last Private Valuation</div>
                <div className="text-lg font-semibold text-slate-800">${company.lastValuation}B</div>
              </div>
              {company.exchange && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 md:col-span-2">
                  <div className="text-sm text-slate-500 font-medium mb-1">Exchange</div>
                  <div className="text-lg font-semibold text-slate-800">{company.exchange}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Angel Investment Details */}
        {activeTab === 'angel' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <TrendingUp size={20} className="mr-3 text-blue-500" />
              Traction & Team
            </h3>
            <div className="space-y-6">
              {company.traction && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-medium mb-2">Traction</div>
                  <div className="text-base text-slate-800 leading-relaxed">{company.traction}</div>
                </div>
              )}
              {company.team && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-medium mb-2">Team Background</div>
                  <div className="text-base text-slate-800 leading-relaxed">{company.team}</div>
                </div>
              )}
              {company.investors && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-medium mb-2">Current Investors</div>
                  <div className="text-base text-slate-800 leading-relaxed">{company.investors}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Revenue Growth Chart */}
        {company.revenueGrowth && company.revenueGrowth.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <TrendingUp size={20} className="mr-3 text-blue-500" />
              Revenue Growth
            </h3>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={company.revenueGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Revenue ($M)" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      dot={{ r: 8, fill: '#3B82F6' }}
                      activeDot={{ r: 10, fill: '#1D4ED8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* Key Metrics */}
        {company.keyMetrics && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Layers size={20} className="mr-3 text-blue-500" />
              Key Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {company.keyMetrics.cac && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium mb-2">CAC</div>
                  <div className="text-2xl font-bold text-blue-800">{company.keyMetrics.cac}</div>
                </div>
              )}
              {company.keyMetrics.ltv && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="text-sm text-green-600 font-medium mb-2">LTV</div>
                  <div className="text-2xl font-bold text-green-800">{company.keyMetrics.ltv}</div>
                </div>
              )}
              {company.keyMetrics.margins && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="text-sm text-purple-600 font-medium mb-2">Margins</div>
                  <div className="text-2xl font-bold text-purple-800">{company.keyMetrics.margins}</div>
                </div>
              )}
              {company.keyMetrics.burnRate && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="text-sm text-orange-600 font-medium mb-2">Burn Rate</div>
                  <div className="text-2xl font-bold text-orange-800">{company.keyMetrics.burnRate}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Recent News */}
        {company.news && company.news.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Eye size={20} className="mr-3 text-blue-500" />
              Recent News
            </h3>
            <div className="space-y-4">
              {company.news.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-6 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 font-medium mb-2">{formatDate(item.date)}</div>
                      <div className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 flex items-center">
                        {item.title}
                        <ExternalLink size={16} className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">IPO Tracker</h1>
              <p className="text-lg text-slate-600 mb-2">
                Deep analysis of upcoming IPOs and promising investment opportunities
              </p>
              {lastUpdated && (
                <p className="text-sm text-slate-500">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <div className="mt-6 lg:mt-0 flex gap-3 items-center flex-wrap">
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-lg font-medium"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-lg transition-all font-medium ${
                  activeTab === 'upcoming' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                Upcoming IPOs
              </button>
              <button 
                onClick={() => setActiveTab('angel')}
                className={`px-6 py-2 rounded-lg transition-all font-medium ${
                  activeTab === 'angel' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                Angel Investments
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`px-6 py-2 rounded-lg flex items-center transition-all font-medium ${
                  activeTab === 'news' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <Newspaper size={16} className="mr-2" />
                Latest News
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        {activeTab === 'news' ? (
          // News Tab Content
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Newspaper size={28} className="mr-3 text-blue-500" />
                Latest IPO & Investment News
              </h2>
              
              <div>
                <select 
                  value={newsTab}
                  onChange={(e) => setNewsTab(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {newsSectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-6">
              {filteredNews.length > 0 ? (
                filteredNews.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-6 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-xl font-semibold text-slate-800 group-hover:text-blue-700 mb-3">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(item.date)}
                          </span>
                          <span className="font-medium text-blue-600">{item.company}</span>
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                            {item.sector}
                          </span>
                        </div>
                      </div>
                      <ExternalLink size={20} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4" />
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-16 text-slate-500">
                  <Newspaper size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No news available for the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Company Lists and Details
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company List */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {activeTab === 'upcoming' ? 'Upcoming IPOs' : 'Angel Opportunities'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {activeTab === 'upcoming' ? filteredIPOs.length : angelInvestments.length} companies
                    </p>
                  </div>
                  
                  <div>
                    <select 
                      value={filterSector}
                      onChange={(e) => setFilterSector(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {sectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {(activeTab === 'upcoming' ? filteredIPOs : angelInvestments).length > 0 ? (
                    (activeTab === 'upcoming' ? filteredIPOs : angelInvestments).map(company => (
                      <div 
                        key={company.id}
                        onClick={() => setSelectedCompany(company)}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                          selectedCompany?.id === company.id 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg text-slate-800 mb-2">{company.name}</div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                              <span className="font-medium">{company.sector}</span>
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {company.stage}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xl font-bold text-slate-800">
                            ${activeTab === 'upcoming' ? company.targetValuation : company.targetRaise}
                            {activeTab === 'upcoming' ? 'B' : 'M'}
                          </div>
                          <div 
                            className="text-xs px-3 py-1 rounded-full text-white font-medium"
                            style={{ backgroundColor: getRiskColor(company.risk) }}
                          >
                            {company.risk}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No companies found for the selected filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Company Details */}
            <div className="lg:col-span-2">
              {selectedCompany ? (
                <CompanyDetail company={selectedCompany} />
              ) : (
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 h-full flex items-center justify-center">
                  <div className="text-center text-slate-500">
                   <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                   <p className="text-xl font-medium">Select a company to view detailed analysis</p>
                 </div>
               </div>
             )}
           </div>
         </div>
       )}
     </div>
   </div>
 );
};

export default IPOTrackerApp;
