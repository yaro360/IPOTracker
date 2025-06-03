export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Return sample IPO data
    const sampleIPOs = [
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
          { year: '2024', value: 238 }
        ],
        keyMetrics: {
          cac: '$380',
          ltv: '$1,890',
          margins: '71%',
          burnRate: '$3.2M/month'
        },
        news: [
          { date: '2025-05-28', title: 'TechFlow announces IPO roadshow schedule', url: 'https://techcrunch.com/techflow-ipo' },
          { date: '2025-05-15', title: 'Company reports record Q1 revenue growth', url: 'https://finance.yahoo.com/techflow-earnings' }
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
          { year: '2024', value: 187 }
        ],
        keyMetrics: {
          cac: '$2,100',
          ltv: '$8,500',
          margins: '78%',
          burnRate: '$5.8M/month'
        },
        news: [
          { date: '2025-05-25', title: 'HealthAI receives FDA approval for new diagnostic tool', url: 'https://medcitynews.com/healthai-fda' },
          { date: '2025-05-10', title: 'Files S-1 for anticipated public offering', url: 'https://sec.gov/healthai-s1' }
        ]
      }
    ];
    
    res.status(200).json(sampleIPOs);
  } catch (error) {
    console.error('Error in IPO calendar:', error);
    res.status(500).json({ error: 'Failed to fetch IPO data', details: error.message });
  }
}
