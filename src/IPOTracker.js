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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading real IPO data...</p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <AlertTriangle size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
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
      <div className="bg-white p-6 rounded-lg shadow-md w-full h-full overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">{company.name}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                {company.sector}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                {activeTab === 'upcoming' ? company.stage : company.stage}
              </span>
              {company.symbol && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                  {company.symbol}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold">
              ${activeTab === 'upcoming' ? company.targetValuation : company.targetRaise}
              {activeTab === 'upcoming' ? 'B' : 'M'}
              <span className="text-sm text-gray-500 ml-1">
                {activeTab === 'upcoming' ? 'Target Valuation' : 'Target Raise'}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <span className="flex items-center text-sm" style={{ color: company.growth > 100 ? '#4CAF50' : '#F44336' }}>
                {company.growth > 100 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {company.growth}% YoY Growth
              </span>
              <span 
                className="ml-2 px-2 py-1 rounded-md text-white text-sm"
                style={{ backgroundColor: getRiskColor(company.risk) }}
              >
                {company.risk} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Company Website */}
        {company.website && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Globe size={18} className="mr-2" />
              Company Website
            </h3>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <ExternalLink size={16} className="mr-2" />
              Visit {company.name} Website
            </a>
          </div>
        )}
        
        {/* Timeline & Key Dates for IPOs */}
        {activeTab === 'upcoming' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar size={18} className="mr-2" />
              IPO Timeline
            </h3>
            <div className="bg-gray-100 h-2 rounded-full mb-4 relative">
              <div 
                className="absolute h-2 bg-blue-500 rounded-full" 
                style={{ width: `${getStageProgress(company.stage)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Filing Date</div>
                <div className="font-medium">{formatDate(company.filingDate)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Expected Debut</div>
                <div className="font-medium">{formatDate(company.expectedDebutDate)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Roadshow Status</div>
                <div className="font-medium">{company.roadshowStatus}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Last Private Valuation</div>
                <div className="font-medium">${company.lastValuation}B</div>
              </div>
              {company.exchange && (
                <div className="bg-gray-50 p-3 rounded-md col-span-2">
                  <div className="text-sm text-gray-500">Exchange</div>
                  <div className="font-medium">{company.exchange}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Traction & Team for Angel Investments */}
        {activeTab === 'angel' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp size={18} className="mr-2" />
              Traction & Team
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {company.traction && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Traction</div>
                  <div className="font-medium">{company.traction}</div>
                </div>
              )}
              {company.team && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Team Background</div>
                  <div className="font-medium">{company.team}</div>
                </div>
              )}
              {company.investors && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Current Investors</div>
                  <div className="font-medium">{company.investors}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Revenue Growth Chart */}
        {company.revenueGrowth && company.revenueGrowth.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp size={18} className="mr-2" />
              Revenue Growth
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={company.revenueGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Revenue ($M)" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Key Metrics */}
        {company.keyMetrics && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Layers size={18} className="mr-2" />
              Key Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {company.keyMetrics.cac && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">CAC</div>
                  <div className="font-medium">{company.keyMetrics.cac}</div>
                </div>
              )}
              {company.keyMetrics.ltv && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">LTV</div>
                  <div className="font-medium">{company.keyMetrics.ltv}</div>
                </div>
              )}
              {company.keyMetrics.margins && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Margins</div>
                  <div className="font-medium">{company.keyMetrics.margins}</div>
                </div>
              )}
              {company.keyMetrics.burnRate && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Burn Rate</div>
                  <div className="font-medium">{company.keyMetrics.burnRate}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Recent News */}
        {company.news && company.news.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Eye size={18} className="mr-2" />
              Recent News
            </h3>
            <div className="space-y-3">
              {company.news.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block border-l-4 border-blue-500 pl-3 py-2 hover:bg-blue-50 transition-colors rounded-r-md"
                >
                  <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
                  <div className="font-medium flex items-center">
                    {item.title}
                    <ExternalLink size={14} className="ml-2 text-blue-500" />
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">IPO Tracker</h1>
              <p className="text-gray-600 mt-1">
                Deep analysis of upcoming IPOs and promising investment opportunities
              </p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex gap-2 items-center">
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'upcoming' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Upcoming IPOs
              </button>
              <button 
                onClick={() => setActiveTab('angel')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'angel' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Angel Investments
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                  activeTab === 'news' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Newspaper size={16} className="mr-1" />
                Latest News
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === 'news' ? (
            // News Tab Content
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Newspaper size={24} className="mr-2" />
                    Latest IPO & Investment News
                  </h2>
                  
                  {/* Filter dropdown */}
                  <div>
                    <select 
                      value={newsTab}
                      onChange={(e) => setNewsTab(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      {newsSectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* News list */}
                <div className="space-y-4">
                  {filteredNews.length > 0 ? (
                    filteredNews.map((item, idx) => (
                      <a 
                        key={idx} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-lg">{item.title}</div>
                            <div className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {formatDate(item.date)}
                              </span>
                              <span className="font-medium text-blue-600">{item.company}</span>
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {item.sector}
                              </span>
                            </div>
                          </div>
                          <ExternalLink size={18} className="text-blue-500" />
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Newspaper size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No news available for the selected filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Regular IPO/Angel Content
            <>
              {/* Left Side - Company List */}
              <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {activeTab === 'upcoming' ? 'Upcoming IPOs' : 'Angel Opportunities'}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({activeTab === 'upcoming' ? filteredIPOs.length : angelInvestments.length})
                      </span>
                    </h2>
                    
                    {/* Filter dropdown */}
                    <div>
                      <select 
                        value={filterSector}
                        onChange={(e) => setFilterSector(e.target.value)}
                        className="border rounded-md px-3 py-1 text-sm"
                      >
                        {sectors.map(sector => (
                          <option key={sector} value={sector}>{sector}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Company list */}
                  <div className="space-y-3">
                    {(activeTab === 'upcoming' ? filteredIPOs : angelInvestments).length > 0 ? (
                      (activeTab === 'upcoming' ? filteredIPOs : angelInvestments).map(company => (
                        <div 
                          key={company.id}
                          onClick={() => setSelectedCompany(company)}
                          className={`border border-gray-200 rounded-md p-3 cursor-pointer transition-colors ${
                            selectedCompany?.id === company.id 
                              ? 'bg-blue-50 border-blue-300' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <span>{company.sector}</span>
                                {activeTab === 'upcoming' ? (
                                  <span className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {company.stage}
                                  </span>
                                ) : (
                                  <span>{company.stage}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="font-bold">
                                ${activeTab === 'upcoming' ? company.targetValuation : company.targetRaise}
                                {activeTab === 'upcoming' ? 'B' : 'M'}
                              </div>
                              <div 
                                className="text-xs px-2 py-1 rounded-full text-white mt-1"
                                style={{ backgroundColor: getRiskColor(company.risk) }}
                              >
                                {company.risk}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No companies found for the selected filter.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Side - Company Details */}
              <div className="md:col-span-2">
                {selectedCompany ? (
                  <CompanyDetail company={selectedCompany} />
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">Select a company to view detailed analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPOTrackerApp;
