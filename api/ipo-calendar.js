import axios from 'axios';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get current date and 6 months from now for a broader range
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    
    // Format dates for API (YYYY-MM-DD)
    const fromDate = today.toISOString().split('T')[0];
    const toDate = sixMonthsLater.toISOString().split('T')[0];
    
    // Fetch IPO calendar data from Finnhub
    const response = await axios.get('https://finnhub.io/api/v1/calendar/ipo', {
      params: {
        from: fromDate,
        to: toDate,
        token: process.env.FINNHUB_API_KEY
      }
    });
    
    console.log('Finnhub API Response:', response.data);
    
    // Check if we have IPO data
    if (!response.data.ipoCalendar || response.data.ipoCalendar.length === 0) {
      // Return sample data if no real data is available
      return res.status(200).json(getSampleIPOData());
    }
    
    // Transform the data to match our app's format
    const ipoData = await Promise.all(
      response.data.ipoCalendar.slice(0, 10).map(async (ipo, index) => {
        // Fetch additional company data
        const companyNews = await fetchCompanyNews(ipo.symbol);
        
        return {
          id: index + 1,
          name: ipo.name || 'Unknown Company',
          sector: await determineSector(ipo.symbol),
          targetValuation: calculateValuation(ipo.numberOfShares, ipo.price),
          filingDate: ipo.date,
          expectedDebutDate: ipo.date,
          roadshowStatus: determineStatus(ipo.date),
          fundingRaised: calculateValuation(ipo.numberOfShares, ipo.price) * 0.8,
          lastValuation: calculateValuation(ipo.numberOfShares, ipo.price) * 0.7,
          growth: Math.floor(Math.random() * 50) + 60,
          risk: determineRisk(ipo.exchange),
          stage: determineStage(ipo.date),
          website: generateWebsiteURL(ipo.name),
          symbol: ipo.symbol,
          exchange: ipo.exchange,
          totalShares: ipo.numberOfShares,
          priceRange: `$${ipo.price ? (ipo.price - 2) : 15}-$${ipo.price ? (ipo.price + 2) : 25}`,
          revenueGrowth: generateRevenueData(),
          keyMetrics: generateKeyMetrics(),
          news: companyNews
        };
      })
    );
    
    res.status(200).json(ipoData);
  } catch (error) {
    console.error('Error fetching IPO data:', error);
    // Return sample data on error
    res.status(200).json(getSampleIPOData());
  }
}

// Helper functions
function calculateValuation(shares, price) {
  if (!shares || !price) return Math.floor(Math.random() * 5) + 1;
  return parseFloat((shares * price / 1000000000).toFixed(2)); // Convert to billions
}

function determineStatus(ipoDate) {
  const today = new Date();
  const ipo = new Date(ipoDate);
  const diffDays = Math.ceil((ipo - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Completed';
  if (diffDays < 7) return 'Pricing';
  if (diffDays < 14) return 'In Progress';
  return 'Not Started';
}

function determineStage(ipoDate) {
  const today = new Date();
  const ipo = new Date(ipoDate);
  const diffDays = Math.ceil((ipo - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Listed';
  if (diffDays < 7) return 'Pricing';
  if (diffDays < 14) return 'Roadshow';
  if (diffDays < 30) return 'Filed';
  return 'Preparing';
}

function determineRisk(exchange) {
  const riskMap = {
    'NASDAQ': 'Medium',
    'NYSE': 'Low',
    'AMEX': 'Medium-High'
  };
  return riskMap[exchange] || 'Medium';
}

async function determineSector(symbol) {
  try {
    // Try to get company profile from Finnhub
    const response = await axios.get('https://finnhub.io/api/v1/stock/profile2', {
      params: {
        symbol: symbol,
        token: process.env.FINNHUB_API_KEY
      }
    });
    
    if (response.data && response.data.finnhubIndustry) {
      // Map Finnhub industries to our sectors
      const industry = response.data.finnhubIndustry.toLowerCase();
      if (industry.includes('technology') || industry.includes('software')) return 'Tech';
      if (industry.includes('finance') || industry.includes('banking')) return 'Fintech';
      if (industry.includes('health') || industry.includes('medical')) return 'Health Tech';
      if (industry.includes('bio') || industry.includes('pharma')) return 'BioTech';
      return 'Other';
    }
  } catch (error) {
    console.error('Error fetching sector for', symbol, error);
  }
  
  // Fallback to random sector
  const sectors = ['Fintech', 'Health Tech', 'Tech', 'BioTech', 'Other'];
  return sectors[Math.floor(Math.random() * sectors.length)];
}

function generateWebsiteURL(companyName) {
  if (!companyName) return 'https://example.com';
  const cleanName = companyName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);
  return `https://${cleanName}.com`;
}

function generateRevenueData() {
  const baseRevenue = Math.floor(Math.random() * 100) + 50;
  return [
    { year: '2022', value: baseRevenue },
    { year: '2023', value: Math.floor(baseRevenue * 1.5) },
    { year: '2024', value: Math.floor(baseRevenue * 2.2) },
  ];
}

function generateKeyMetrics() {
  return {
    cac: `$${Math.floor(Math.random() * 400) + 100}`,
    ltv: `$${Math.floor(Math.random() * 2000) + 800}`,
    margins: `${Math.floor(Math.random() * 30) + 50}%`,
    burnRate: `$${Math.floor(Math.random() * 8) + 2}M/month`,
  };
}

async function fetchCompanyNews(symbol) {
  try {
    const response = await axios.get('https://finnhub.io/api/v1/company-news', {
      params: {
        symbol: symbol,
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        token: process.env.FINNHUB_API_KEY
      }
    });
    
    if (response.data && response.data.length > 0) {
      return response.data.slice(0, 3).map(news => ({
        date: new Date(news.datetime * 1000).toISOString().split('T')[0],
        title: news.headline,
        url: news.url
      }));
    }
  } catch (error) {
    console.error('Error fetching news for', symbol, error);
  }
  
  // Return placeholder news
  return [
    { 
      date: new Date().toISOString().split('T')[0],
      title: `${symbol} prepares for IPO launch`,
      url: 'https://finance.yahoo.com'
    }
  ];
}

function getSampleIPOData() {
  return [
    { 
      id: 1, 
      name: 'TechFlow Solutions', 
      sector: 'Tech',
      targetValuation: 2.8,
      filingDate: '2025-06-15',
      expectedDebutDate: '2025-07-20',
      roadshowStatus: 'In Progress',
      fundingRaised: 650,
      lastValuation: 2.1,
      growth: 125,
      risk: 'Medium',
      stage: 'Roadshow',
      website: 'https://techflow.com',
      symbol: 'TFLW',
      exchange: 'NASDAQ',
      revenueGrowth: [
        { year: '2022', value: 95 },
        { year: '2023', value: 142 },
        { year: '2024', value: 238 },
      ],
      keyMetrics: {
        cac: '$380',
        ltv: '$1,890',
        margins: '71%',
        burnRate: '$3.2M/month',
      },
      news: [
        { date: '2025-05-28', title: 'TechFlow announces IPO roadshow schedule', url: 'https://techcrunch.com/techflow-ipo' },
        { date: '2025-05-15', title: 'Company reports record Q1 revenue growth', url: 'https://finance.yahoo.com/techflow-earnings' },
      ]
    },
    { 
      id: 2, 
      name: 'HealthAI Diagnostics', 
      sector: 'Health Tech',
      targetValuation: 4.1,
      filingDate: '2025-07-01',
      expectedDebutDate: '2025-08-15',
      roadshowStatus: 'Preparing',
      fundingRaised: 890,
      lastValuation: 3.2,
      growth: 156,
      risk: 'Medium-High',
      stage: 'Filed',
      website: 'https://healthai.com',
      symbol: 'HLAI',
      exchange: 'NYSE',
      revenueGrowth: [
        { year: '2022', value: 45 },
        { year: '2023', value: 89 },
        { year: '2024', value: 187 },
      ],
      keyMetrics: {
        cac: '$2,100',
        ltv: '$8,500',
        margins: '78%',
        burnRate: '$5.8M/month',
      },
      news: [
        { date: '2025-05-25', title: 'HealthAI receives FDA approval for new diagnostic tool', url: 'https://medcitynews.com/healthai-fda' },
        { date: '2025-05-10', title: 'Files S-1 for anticipated public offering', url: 'https://sec.gov/healthai-s1' },
      ]
    }
  ];
}
