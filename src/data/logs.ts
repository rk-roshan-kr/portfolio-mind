export interface LogEntry {
  id: string;
  timestamp: string;
  sector: 'RESEARCH' | 'SYSTEMS' | 'ARCHITECTURE' | 'LIFE';
  title: string;
  content: string;
  metadata: {
    latency?: string;
    buffer?: string;
    recall?: string;
    status: 'STABLE' | 'OPTIMIZING' | 'DECRYPTED';
    reactions?: string;
    comments?: string;
  };
  externalLink?: string;
}

export const logs: LogEntry[] = [
  {
    id: 'LOG_000',
    timestamp: '2025-12-24T00:00:00Z',
    sector: 'RESEARCH',
    title: 'Emergent Ventures Grant [$5500]',
    content: 'Massive milestone: Received a $5500 USD grant from Emergent Ventures (Tyler Cowen) to accelerate Project TARS. Transitioning from theory to high-performance hardware orchestration. Workstation initialization complete.',
    metadata: {
      status: 'STABLE',
      reactions: '18+',
      comments: '10'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7439805732532682752/'
  },
  {
    id: 'LOG_001',
    timestamp: '2025-11-15T00:00:00Z',
    sector: 'RESEARCH',
    title: 'Scientific Paper Certification',
    content: 'Completed "How to Write and Publish a Scientific Paper" from École Polytechnique with a 99.33% score. Mastering research methodologies and the peer-review process for upcoming preprints.',
    metadata: {
      status: 'STABLE',
      reactions: '13',
      comments: '3'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7431425269967740928/'
  },
  {
    id: 'LOG_002',
    timestamp: '2025-11-10T00:00:00Z',
    sector: 'RESEARCH',
    title: 'PINNs Implementation in TARS',
    content: 'Integrating Physics-Informed Neural Networks. Pure data models are insufficient; TARS now enforces transit depth equations and astrophysical constraints directly within the inference framework.',
    metadata: {
      status: 'OPTIMIZING',
      reactions: '5+',
      comments: '2'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7431050419704922112/'
  },
  {
    id: 'LOG_003',
    timestamp: '2025-10-02T00:00:00Z',
    sector: 'SYSTEMS',
    title: 'SMG Electric Scooters Internship',
    content: 'Initiating Winter Internship as an IT Intern. Applying the "Kaizen" philosophy to corporate IT infrastructure and electric mobility systems. Scaling technical operations.',
    metadata: {
      status: 'STABLE',
      reactions: '10+',
      comments: '11'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7400519609910628352/'
  },
  {
    id: 'LOG_004',
    timestamp: '2025-09-20T00:00:00Z',
    sector: 'ARCHITECTURE',
    title: 'Cryptic DAO Frontend Launch',
    content: 'Built the entire frontend for Cryptic using React, Vite, and Framer Motion. Aiming for high-fidelity fintech aesthetics in DeFi governance models. Demo now live.',
    metadata: {
      status: 'DECRYPTED',
      reactions: '5'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7406219042862206976/'
  },
  {
    id: 'LOG_005',
    timestamp: '2025-09-10T00:00:00Z',
    sector: 'SYSTEMS',
    title: 'Samvidhaan Saral: GenAI Hackathon',
    content: 'Developed a structured Constitution learning tool for the Google GenAI Hackathon. Simplifying complex legal framework through consistent, article-wise AI generation.',
    metadata: {
      status: 'STABLE',
      reactions: '3'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7396011767576932352/'
  },
  {
    id: 'LOG_006',
    timestamp: '2025-08-30T00:00:00Z',
    sector: 'RESEARCH',
    title: 'NASA Space Apps Challenge',
    content: 'Processed 12,000 light curves for 1,750 stars. Extreme data processing requirements pushed local hardware limits. Learning CNNs and feature extraction from scratch.',
    metadata: {
      status: 'STABLE',
      reactions: '9'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7387397023291031552/'
  },
  {
    id: 'LOG_007',
    timestamp: '2025-08-25T00:00:00Z',
    sector: 'LIFE',
    title: 'Gemini Write-off Participation',
    content: 'Participated in the Gemini Write-off. Exploring the boundaries of prompt engineering and LLM orchestration. "Using AI isn\'t cheating—it\'s a competitive sport."',
    metadata: {
      status: 'DECRYPTED',
      reactions: '6'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7399596926838484992/'
  },
  {
    id: 'LOG_008',
    timestamp: '2025-08-15T00:00:00Z',
    sector: 'LIFE',
    title: 'Zinnovatio 3.0 Hackathon Victory',
    content: 'Won an internship offer at SMG Electric Scooters on the 100th day at Chandigarh University. Team ZeroQ successfully navigated the 36-hour sprint.',
    metadata: {
      status: 'STABLE',
      reactions: '30+',
      comments: '3'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7391959476435685377/'
  },
  {
    id: 'LOG_009',
    timestamp: '2025-07-15T00:00:00Z',
    sector: 'SYSTEMS',
    title: 'Local LLM on 6GB RAM',
    content: 'Tinkering with LLaMA 2 via Ollama on a low-end setup (6GB RAM, no GPU). Encountered 0.05 tokens/sec eval speed and extreme latency—but successfully ran a large model completely offline. "Tinkering, exploring, learning."',
    metadata: {
      status: 'OPTIMIZING',
      reactions: '6'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7348190503802142720/'
  },
  {
    id: 'LOG_010',
    timestamp: '2025-07-10T00:00:00Z',
    sector: 'RESEARCH',
    title: 'OpenAI Academy: Applied AI',
    content: 'Participated in the "Empowering Communities Through Applied AI" clinic. Exploring the "Human-in-the-loop" philosophy and how AI can work with us to focus on creative, high-level tasks.',
    metadata: {
      status: 'DECRYPTED',
      reactions: '3'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7344071820184096769/'
  },
  {
    id: 'LOG_011',
    timestamp: '2025-07-05T00:00:00Z',
    sector: 'RESEARCH',
    title: 'OpenAI Academy: Info Session',
    content: ' मास्टरिंग the transition from AI user to AI builder. Recognizing that curiosity and questions are the primary inputs for innovation, regardless of expertise level.',
    metadata: {
      status: 'STABLE',
      reactions: '3'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7344630639435866112/'
  },
  {
    id: 'LOG_012',
    timestamp: '2025-06-25T00:00:00Z',
    sector: 'LIFE',
    title: 'Identity Initialization',
    content: 'First professional signal. Starting my journey as a CSE student at Chandigarh University. Rooting my career in code, curiosity, and early experiments like EveryWebStore.',
    metadata: {
      status: 'STABLE',
      reactions: '4'
    },
    externalLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7343914574930178048/'
  }
];
