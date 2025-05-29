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
    // Since there's no free comprehensive API for angel investments,
    // we'll generate realistic sample data based on current market trends
    const angelInvestments = [
      { 
        id: 101, 
        name: 'QuantumFlow AI', 
        sector: 'AI/Quantum',
        stage: 'Series A',
        targetRaise: 35,
        valuation: 180,
        growth: 245,
        risk: 'High',
        website: 'https://quantumflow.ai',
        revenueGrowth: [
          { year: '2023', value: 1.2 },
          { year: '2024', value: 4.1 },
        ],
        keyMetrics: {
          cac: '$8,200',
          ltv: '$95,000',
          margins: '89%',
          burnRate: '$1.2M/month',
        },
        traction: 'Partnerships with Microsoft and IBM, 15 enterprise clients',
        team: 'Founded by ex-DeepMind researchers with 3 Nature publications',
        investors: 'Andreessen Horowitz, Google Ventures, Founders Fund',
        news: [
          { date: '2025-05-20', title: 'Raises $35M Series A led by a16z', url: 'https://techcrunch.com/quantumflow-series-a' },
          { date: '2025-04-28', title: 'Announces quantum computing breakthrough', url: 'https://venturebeat.com/quantumflow-breakthrough' },
        ]
      },
      { 
        id: 102, 
        name: 'RegenTherapy Bio', 
        sector: 'BioTech',
        stage: 'Series B',
        targetRaise: 85,
        valuation: 420,
        growth: 189,
        risk: 'Very High',
        website: 'https://regentherapy.bio',
        revenueGrowth: [
          { year: '2023', value: 0.8 },
          { year: '2024', value: 2.3 },
        ],
        keyMetrics: {
          cac: 'Pre-commercial',
          ltv: 'Est. $250K/patient',
          margins: 'Projected 82%',
          burnRate: '$2.8M/month',
        },
        traction: 'Phase 2 trials showing 78% efficacy, FDA fast-track designation',
        team: 'Founded by Harvard Medical School faculty, 20+ patents',
        investors: 'Johnson & Johnson Innovation, Roche Ventures, OrbiMed',
        news: [
          { date: '2025-05-18', title: 'Positive Phase 2 trial results announced', url: 'https://fiercebiotech.com/regentherapy-phase2' },
          { date: '2025-04-30', title: 'Opens Series B funding round', url: 'https://bioworld.com/regentherapy-series-b' },
        ]
      },
      { 
        id: 103, 
        name: 'CarbonZero Systems', 
        sector: 'CleanTech',
        stage: 'Seed+',
        targetRaise: 18,
        valuation: 75,
        growth: 134,
        risk: 'Medium-High',
        website: 'https://carbonzero.systems',
        revenueGrowth: [
          { year: '2023', value: 0.3 },
          { year: '2024', value: 0.7 },
        ],
        keyMetrics: {
          cac: '$15,000',
          ltv: '$180,000',
          margins: '65%',
          burnRate: '$850K/month',
        },
        traction: 'Pilots with 8 Fortune 500 companies, $2.1M in signed contracts',
        team: 'MIT alumni with expertise in atmospheric engineering',
        investors: 'Breakthrough Energy Ventures, Kleiner Perkins, Climate Capital',
        news: [
          { date: '2025-05-22', title: 'Signs major contract with tech giant for carbon capture', url: 'https://greentechmedia.com/carbonzero-contract' },
          { date: '2025-05-05', title: 'Demonstrates 95% CO2 capture efficiency', url: 'https://cleantechnica.com/carbonzero-efficiency' },
        ]
      },
      { 
        id: 104, 
        name: 'NeuroLink Therapeutics', 
        sector: 'MedTech',
        stage: 'Series A',
        targetRaise: 42,
        valuation: 210,
        growth: 167,
        risk: 'High',
        website: 'https://neurolink-tx.com',
        revenueGrowth: [
          { year: '2023', value: 0.5 },
          { year: '2024', value: 1.3 },
        ],
        keyMetrics: {
          cac: '$25,000',
          ltv: '$320,000',
          margins: '74%',
          burnRate: '$1.8M/month',
        },
        traction: 'FDA breakthrough device designation, 3 successful implants',
        team: 'Neurosurgeons from Johns Hopkins and Stanford',
        investors: 'GV (Google Ventures), Khosla Ventures, Data Collective',
        news: [
          { date: '2025-05-15', title: 'FDA grants breakthrough device status', url: 'https://meddeviceonline.com/neurolink-fda' },
          { date: '2025-04-20', title: 'Successful first human trial results', url: 'https://neurosciencenews.com/neurolink-trial' },
        ]
      }
    ];
    
    res.status(200).json(angelInvestments);
  } catch (error) {
    console.error('Error generating angel investment data:', error);
    res.status(500).json({ error: 'Failed to generate angel investment data' });
  }
}
