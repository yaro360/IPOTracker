import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { ArrowUp, ArrowDown, Briefcase, DollarSign, Calendar, Layers, TrendingUp, AlertTriangle, Eye, Clock } from 'lucide-react';

const IPOTrackerApp = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filterSector, setFilterSector] = useState('All');
  
  // Sample data - in a real app, this would come from APIs
  const upcomingIPOs = [
    { 
      id: 1, 
      name: 'Hinge Health', 
      sector: 'Health Tech',
      targetValuation: 2.6,
      filingDate: '2025-02-10',
      expectedDebutDate: '2025-05-20',
      roadshowStatus: 'In Progress',
      fundingRaised: 600,
      lastValuation: 1.8,
      growth: 115,
      risk: 'Medium',
      stage: 'Roadshow',
      revenueGrowth: [
        { year: '2022', value: 80 },
        { year: '2023', value: 120 },
        { year: '2024', value: 210 },
      ],
      keyMetrics: {
        cac: '$420',
        ltv: '$2,100',
        margins: '68%',
        burnRate: '$2.8M/month',
      },
      news: [
        { date: '2025-05-02', title: 'Launches IPO roadshow targeting $2.6B valuation' },
        { date: '2025-04-15', title: 'Files amended S-1 with updated financials' },
      ]
    },
    { 
      id: 2, 
      name: 'eToro', 
      sector: 'Fintech',
      targetValuation: 3.2,
      filingDate: '2025-03-05',
      expectedDebutDate: '2025-05-15',
      roadshowStatus: 'Pricing',
      fundingRaised: 720,
      lastValuation: 2.5,
      growth: 85,
      risk: 'Medium-High',
      stage: 'Pricing',
      revenueGrowth: [
        { year: '2022', value: 150 },
        { year: '2023', value: 210 },
        { year: '2024', value: 320 },
      ],
      keyMetrics: {
        cac: '$210',
        ltv: '$890',
        margins: '72%',
        burnRate: '$4.2M/month',
      },
      news: [
        { date: '2025-05-13', title: 'Set to price IPO this evening' },
        { date: '2025-05-01', title: 'Announces target price range of $18-22' },
      ]
    },
    { 
      id: 3, 
      name: 'Chime', 
      sector: 'Fintech',
      targetValuation: 8.5,
      filingDate: '2025-05-10',
      expectedDebutDate: '2025-06-20',
      roadshowStatus: 'Preparing',
      fundingRaised: 1500,
      lastValuation: 6.8,
      growth: 95,
      risk: 'Low',
      stage: 'Filed',
      revenueGrowth: [
        { year: '2022', value: 280 },
        { year: '2023', value: 450 },
        { year: '2024', value: 720 },
      ],
      keyMetrics: {
        cac: '$110',
        ltv: '$1,200',
        margins: '65%',
        burnRate: '$7.5M/month',
      },
      news: [
        { date: '2025-05-13', title: 'Revealed IPO paperwork this afternoon' },
        { date: '2025-04-28', title: 'Hires new CFO with IPO experience' },
      ]
    },
    { 
      id: 4, 
      name: 'Klarna', 
      sector: 'Fintech',
      targetValuation: 12.2,
      filingDate: null,
      expectedDebutDate: '2025-09-15',
      roadshowStatus: 'Not Started',
      fundingRaised: 3700,
      lastValuation: 10.5,
      growth: 65,
      risk: 'Medium',
      stage: 'Rumored',
      revenueGrowth: [
        { year: '2022', value: 520 },
        { year: '2023', value: 680 },
        { year: '2024', value: 950 },
      ],
      keyMetrics: {
        cac: '$90',
        ltv: '$850',
        margins: '59%',
        burnRate: '$12M/month',
      },
      news: [
        { date: '2025-04-20', title: 'CEO hints at 2025 IPO plans in earnings call' },
        { date: '2025-03-15', title: 'Reports first profitable quarter' },
      ]
    },
    { 
      id: 5, 
      name: 'Circle', 
      sector: 'Crypto/Fintech',
      targetValuation: 5.8,
      filingDate: null,
      expectedDebutDate: '2025-10-10',
      roadshowStatus: 'Not Started',
      fundingRaised: 1100,
      lastValuation: 4.1,
      growth: 130,
      risk: 'High',
      stage: 'Preparing',
      revenueGrowth: [
        { year: '2022', value: 90 },
        { year: '2023', value: 180 },
        { year: '2024', value: 410 },
      ],
      keyMetrics: {
        cac: '$70',
        ltv: '$950',
        margins: '81%',
        burnRate: '$5.2M/month',
      },
      news: [
        { date: '2025-05-05', title: 'Reported to be interviewing underwriters' },
        { date: '2025-03-30', title: 'Reaches 10M active users milestone' },
      ]
    },
  ];
  
  const angelInvestments = [
    { 
      id: 101, 
      name: 'Quantum Compute AI', 
      sector: 'AI/Quantum',
      stage: 'Series A',
      targetRaise: 25,
      valuation: 120,
      growth: 185,
      risk: 'High',
      revenueGrowth: [
        { year: '2023', value: 0.8 },
        { year: '2024', value: 2.5 },
      ],
      keyMetrics: {
        cac: '$5,200',
        ltv: '$75,000',
        margins: '92%',
        burnRate: '$850K/month',
      },
      traction: 'Early enterprise contracts with 3 Fortune 500 companies',
      team: 'Founded by ex-Google Quantum Computing researchers',
      investors: 'Y Combinator, Andreessen Horowitz',
      news: [
        { date: '2025-04-25', title: 'Opens Series A funding round' },
        { date: '2025-03-10', title: 'Announces breakthrough in quantum ML algorithms' },
      ]
    },
    { 
      id: 102, 
      name: 'BioRegenX', 
      sector: 'BioTech',
      stage: 'Seed+',
      targetRaise: 12,
      valuation: 45,
      growth: 110,
      risk: 'Very High',
      revenueGrowth: [
        { year: '2023', value: 0 },
        { year: '2024', value: 0.4 },
      ],
      keyMetrics: {
        cac: 'Pre-revenue',
        ltv: 'Estimated $120K/patient',
        margins: 'Projected 75%',
        burnRate: '$620K/month',
      },
      traction: 'Successful Phase 1 trials, FDA fast-track designation',
      team: 'Led by Stanford Medical School department head',
      investors: 'Johnson & Johnson Innovation, Illumina Ventures',
      news: [
        { date: '2025-05-10', title: 'Secures new patents for regenerative therapy' },
        { date: '2025-02-28', title: 'Completes pre-clinical trials with promising results' },
      ]
    },
  ];
  
  const sectors = ['All', 'Fintech', 'Health Tech', 'AI/Quantum', 'BioTech', 'Crypto/Fintech'];
  const stages = ['All', 'Rumored', 'Preparing', 'Filed', 'Roadshow', 'Pricing'];
  
  // Filtered IPO listings
  const filteredIPOs = upcomingIPOs.filter(ipo => 
    filterSector === 'All' || ipo.sector === filterSector
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
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold">
              ${company.targetValuation}B
              <span className="text-sm text-gray-500 ml-1">Target Valuation</span>
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
        
        {/* Timeline & Key Dates */}
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
            </div>
          </div>
        )}
        
        {/* Traction & Team (Angel Investments) */}
        {activeTab === 'angel' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp size={18} className="mr-2" />
              Traction & Team
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Traction</div>
                <div className="font-medium">{company.traction}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Team Background</div>
                <div className="font-medium">{company.team}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Current Investors</div>
                <div className="font-medium">{company.investors}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Revenue Growth Chart */}
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
        
        {/* Key Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Layers size={18} className="mr-2" />
            Key Metrics
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">CAC</div>
              <div className="font-medium">{company.keyMetrics.cac}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">LTV</div>
              <div className="font-medium">{company.keyMetrics.ltv}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Margins</div>
              <div className="font-medium">{company.keyMetrics.margins}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Burn Rate</div>
              <div className="font-medium">{company.keyMetrics.burnRate}</div>
            </div>
          </div>
        </div>
        
        {/* Recent News */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Eye size={18} className="mr-2" />
            Recent News
          </h3>
          <div className="space-y-3">
            {company.news.map((item, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-3 py-1">
                <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
                <div className="font-medium">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
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
            </div>
            <div className="mt-4 md:mt-0 flex">
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 mr-2 rounded-md ${
                  activeTab === 'upcoming' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Upcoming IPOs
              </button>
              <button 
                onClick={() => setActiveTab('angel')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'angel' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Angel Investments
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side - Company List */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {activeTab === 'upcoming' ? 'Upcoming IPOs' : 'Angel Opportunities'}
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
                {(activeTab === 'upcoming' ? filteredIPOs : angelInvestments).map(company => (
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
                ))}
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
        </div>
      </div>
    </div>
  );
};

export default IPOTrackerApp;
