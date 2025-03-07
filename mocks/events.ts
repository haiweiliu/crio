import { Event } from '@/types/event';

export const events: Event[] = [
  {
    id: '1',
    title: 'ETH Global Summit 2023',
    description: 'Join the biggest Ethereum developers conference of the year. Connect with builders, learn from experts, and hack on the future of web3.',
    startDate: '2023-11-15T09:00:00Z',
    endDate: '2023-11-17T18:00:00Z',
    location: {
      type: 'hybrid',
      address: '123 Blockchain Ave',
      city: 'San Francisco',
      country: 'USA',
      link: 'https://meet.zoom.us/j/123456789'
    },
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    organizer: {
      id: 'org1',
      name: 'ETH Global',
      avatar: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['dev', 'defi'],
    attendees: 1250,
    maxAttendees: 1500,
    price: {
      amount: 299,
      currency: 'USD'
    },
    isFeatured: true,
    speakers: [
      {
        id: 'speaker1',
        name: 'Vitalik Buterin',
        avatar: 'https://images.unsplash.com/photo-1579493934830-eaa45aaf1d0d?q=80&w=1974&auto=format&fit=crop',
        title: 'Founder',
        company: 'Ethereum'
      },
      {
        id: 'speaker2',
        name: 'Hayden Adams',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop',
        title: 'Founder',
        company: 'Uniswap'
      }
    ]
  },
  {
    id: '2',
    title: 'NFT NYC Meetup',
    description: 'A casual meetup for NFT enthusiasts, artists, and collectors. Share your projects, get feedback, and network with the community.',
    startDate: '2023-10-25T18:30:00Z',
    endDate: '2023-10-25T21:30:00Z',
    location: {
      type: 'in-person',
      address: '456 Digital Art St',
      city: 'New York',
      country: 'USA'
    },
    imageUrl: 'https://images.unsplash.com/photo-1643101452019-bc00c9bba76b?q=80&w=1974&auto=format&fit=crop',
    organizer: {
      id: 'org2',
      name: 'NFT NYC',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1770&auto=format&fit=crop'
    },
    categories: ['ai', 'social'],
    attendees: 85,
    maxAttendees: 100,
    price: {
      amount: 0,
      currency: 'USD'
    }
  },
  {
    id: '3',
    title: 'DeFi Deep Dive: Yield Farming Strategies',
    description: 'Learn advanced yield farming strategies from DeFi experts. Discover how to optimize your returns while managing risk in the volatile DeFi landscape.',
    startDate: '2023-11-05T14:00:00Z',
    endDate: '2023-11-05T16:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.google.com/abc-defg-hij'
    },
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1902&auto=format&fit=crop',
    organizer: {
      id: 'org3',
      name: 'DeFi Pulse',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop'
    },
    categories: ['defi', 'dev'],
    attendees: 320,
    isFeatured: true
  },
  {
    id: '4',
    title: 'RWA Tokenization Workshop',
    description: 'A hands-on workshop on tokenizing real-world assets. We\'ll cover legal frameworks, technical implementation, and market opportunities.',
    startDate: '2023-11-10T10:00:00Z',
    endDate: '2023-11-10T13:00:00Z',
    location: {
      type: 'hybrid',
      address: '789 Decentralized Blvd',
      city: 'Berlin',
      country: 'Germany',
      link: 'https://meet.zoom.us/j/987654321'
    },
    imageUrl: 'https://images.unsplash.com/photo-1559445368-b8a993676d7a?q=80&w=1964&auto=format&fit=crop',
    organizer: {
      id: 'org4',
      name: 'RWA Alliance',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['rwa', 'dev'],
    attendees: 150,
    maxAttendees: 200,
    price: {
      amount: 49,
      currency: 'USD'
    }
  },
  {
    id: '5',
    title: 'Web3 Gaming Showcase',
    description: 'Experience the latest blockchain games and meet the developers behind them. Play demos, win prizes, and learn about the future of gaming.',
    startDate: '2023-12-01T12:00:00Z',
    endDate: '2023-12-03T20:00:00Z',
    location: {
      type: 'in-person',
      address: '101 Player One Plaza',
      city: 'Tokyo',
      country: 'Japan'
    },
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    organizer: {
      id: 'org5',
      name: 'GameFi Association',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['gaming', 'ai'],
    attendees: 750,
    maxAttendees: 1000,
    price: {
      amount: 150,
      currency: 'USD'
    },
    isFeatured: true
  },
  {
    id: '6',
    title: 'Solidity Bootcamp for Beginners',
    description: 'A 3-hour crash course on Solidity programming. Perfect for developers looking to enter the blockchain space.',
    startDate: '2023-11-20T15:00:00Z',
    endDate: '2023-11-20T18:00:00Z',
    location: {
      type: 'online',
      link: 'https://discord.gg/solidity-bootcamp'
    },
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org6',
      name: 'Web3 Academy',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop'
    },
    categories: ['dev'],
    attendees: 210,
    maxAttendees: 300,
    price: {
      amount: 0,
      currency: 'USD'
    }
  },
  {
    id: '7',
    title: 'DePIN Infrastructure Summit',
    description: 'Explore the future of decentralized physical infrastructure networks. Connect with leading projects building the next generation of physical infrastructure on blockchain.',
    startDate: '2023-12-15T09:00:00Z',
    endDate: '2023-12-16T18:00:00Z',
    location: {
      type: 'in-person',
      address: '555 Network Ave',
      city: 'Austin',
      country: 'USA'
    },
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    organizer: {
      id: 'org7',
      name: 'DePIN Collective',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['depin', 'dev'],
    attendees: 420,
    maxAttendees: 500,
    price: {
      amount: 199,
      currency: 'USD'
    },
    isFeatured: true
  },
  {
    id: '8',
    title: 'AI x Blockchain Hackathon',
    description: 'A weekend-long hackathon focused on building applications that combine AI and blockchain technologies. $50,000 in prizes for the winning teams.',
    startDate: '2023-11-25T09:00:00Z',
    endDate: '2023-11-27T18:00:00Z',
    location: {
      type: 'hybrid',
      address: '888 Innovation Center',
      city: 'London',
      country: 'UK',
      link: 'https://meet.zoom.us/j/aihackathon'
    },
    imageUrl: 'https://images.unsplash.com/photo-1526378800651-c1a63d2b0ca1?q=80&w=2069&auto=format&fit=crop',
    organizer: {
      id: 'org8',
      name: 'AI Blockchain Alliance',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['ai', 'dev'],
    attendees: 350,
    maxAttendees: 400,
    price: {
      amount: 25,
      currency: 'USD'
    }
  },
  {
    id: '9',
    title: 'Real Estate Tokenization Conference',
    description: 'The premier event for real estate tokenization. Learn how blockchain is transforming property ownership, investment, and management.',
    startDate: '2023-12-05T10:00:00Z',
    endDate: '2023-12-06T17:00:00Z',
    location: {
      type: 'in-person',
      address: '777 Property Plaza',
      city: 'Miami',
      country: 'USA'
    },
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop',
    organizer: {
      id: 'org9',
      name: 'RWA Consortium',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070&auto=format&fit=crop'
    },
    categories: ['rwa', 'defi'],
    attendees: 280,
    maxAttendees: 300,
    price: {
      amount: 349,
      currency: 'USD'
    }
  },
  {
    id: '10',
    title: 'DeFi Risk Management Workshop',
    description: 'A practical workshop on managing risk in DeFi protocols. Learn strategies for protecting your assets and optimizing returns in volatile markets.',
    startDate: '2023-11-12T13:00:00Z',
    endDate: '2023-11-12T16:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.google.com/defi-risk'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org10',
      name: 'DeFi Shield',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['defi'],
    attendees: 175,
    price: {
      amount: 0,
      currency: 'USD'
    }
  },
  {
    id: '11',
    title: 'Helium Network Meetup',
    description: 'Connect with Helium Network enthusiasts and learn about the latest developments in decentralized wireless infrastructure.',
    startDate: '2023-11-18T18:00:00Z',
    endDate: '2023-11-18T21:00:00Z',
    location: {
      type: 'in-person',
      address: '123 Signal St',
      city: 'Chicago',
      country: 'USA'
    },
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org11',
      name: 'Helium Community',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['depin', 'social'],
    attendees: 65,
    maxAttendees: 80,
    price: {
      amount: 0,
      currency: 'USD'
    }
  },
  {
    id: '12',
    title: 'AI for Blockchain Developers',
    description: 'Learn how to integrate AI capabilities into your blockchain applications. From smart contract optimization to predictive analytics.',
    startDate: '2023-12-08T14:00:00Z',
    endDate: '2023-12-08T17:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.zoom.us/j/aiblockchain'
    },
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    organizer: {
      id: 'org12',
      name: 'AI Chain Labs',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['ai', 'dev'],
    attendees: 230,
    price: {
      amount: 49,
      currency: 'USD'
    }
  },
  {
    id: '13',
    title: 'Tokenized Carbon Credits Summit',
    description: 'Explore how blockchain is revolutionizing carbon markets. Connect with projects working on tokenized carbon credits and environmental assets.',
    startDate: '2023-12-12T09:00:00Z',
    endDate: '2023-12-13T17:00:00Z',
    location: {
      type: 'hybrid',
      address: '100 Green Plaza',
      city: 'Singapore',
      country: 'Singapore',
      link: 'https://meet.zoom.us/j/carboncredits'
    },
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org13',
      name: 'Climate Chain Coalition',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['rwa', 'defi'],
    attendees: 310,
    maxAttendees: 350,
    price: {
      amount: 199,
      currency: 'USD'
    },
    isFeatured: true
  },
  {
    id: '14',
    title: 'Blockchain Gaming Tournament',
    description: 'Compete in the biggest blockchain gaming tournament of the year. Play to earn and showcase your skills in various web3 games.',
    startDate: '2023-11-30T15:00:00Z',
    endDate: '2023-12-02T22:00:00Z',
    location: {
      type: 'hybrid',
      address: '200 Gamer Blvd',
      city: 'Seoul',
      country: 'South Korea',
      link: 'https://twitch.tv/blockchaingaming'
    },
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    organizer: {
      id: 'org14',
      name: 'Blockchain Gaming League',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1770&auto=format&fit=crop'
    },
    categories: ['gaming'],
    attendees: 850,
    maxAttendees: 1000,
    price: {
      amount: 25,
      currency: 'USD'
    }
  },
  {
    id: '15',
    title: 'DePIN Hardware Showcase',
    description: 'Explore the latest hardware innovations in decentralized physical infrastructure. From mining equipment to IoT devices.',
    startDate: '2023-12-18T10:00:00Z',
    endDate: '2023-12-19T18:00:00Z',
    location: {
      type: 'in-person',
      address: '456 Hardware Lane',
      city: 'Taipei',
      country: 'Taiwan'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org15',
      name: 'DePIN Hardware Collective',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop'
    },
    categories: ['depin', 'dev'],
    attendees: 420,
    maxAttendees: 500,
    price: {
      amount: 149,
      currency: 'USD'
    }
  },
  {
    id: '16',
    title: 'Stablecoin Economics Forum',
    description: 'A deep dive into stablecoin economics, regulations, and use cases. Learn from experts about the future of digital currencies.',
    startDate: '2023-11-22T13:00:00Z',
    endDate: '2023-11-22T17:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.zoom.us/j/stablecoin'
    },
    imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=1974&auto=format&fit=crop',
    organizer: {
      id: 'org16',
      name: 'Digital Currency Initiative',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop'
    },
    categories: ['defi', 'dev'],
    attendees: 290,
    price: {
      amount: 0,
      currency: 'USD'
    }
  },
  {
    id: '17',
    title: 'AI Art & NFT Exhibition',
    description: 'Explore the intersection of AI-generated art and NFTs. Meet artists, collectors, and technologists pushing the boundaries of digital creativity.',
    startDate: '2023-12-10T11:00:00Z',
    endDate: '2023-12-12T20:00:00Z',
    location: {
      type: 'in-person',
      address: '789 Gallery Street',
      city: 'Paris',
      country: 'France'
    },
    imageUrl: 'https://images.unsplash.com/photo-1643101452019-bc00c9bba76b?q=80&w=1974&auto=format&fit=crop',
    organizer: {
      id: 'org17',
      name: 'Digital Art Collective',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070&auto=format&fit=crop'
    },
    categories: ['ai', 'social'],
    attendees: 380,
    maxAttendees: 450,
    price: {
      amount: 35,
      currency: 'USD'
    }
  },
  {
    id: '18',
    title: 'Tokenized Securities Conference',
    description: 'The premier event for security token offerings and tokenized traditional assets. Connect with issuers, investors, and regulators.',
    startDate: '2023-12-07T09:00:00Z',
    endDate: '2023-12-08T17:00:00Z',
    location: {
      type: 'hybrid',
      address: '123 Financial District',
      city: 'Zurich',
      country: 'Switzerland',
      link: 'https://meet.zoom.us/j/securitytokens'
    },
    imageUrl: 'https://images.unsplash.com/photo-1559445368-b8a993676d7a?q=80&w=1964&auto=format&fit=crop',
    organizer: {
      id: 'org18',
      name: 'Security Token Alliance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['rwa', 'defi'],
    attendees: 320,
    maxAttendees: 400,
    price: {
      amount: 399,
      currency: 'USD'
    }
  },
  {
    id: '19',
    title: 'Web3 Social Media Summit',
    description: 'Explore the future of decentralized social media platforms. Connect with builders creating the next generation of social networks.',
    startDate: '2023-11-28T10:00:00Z',
    endDate: '2023-11-29T16:00:00Z',
    location: {
      type: 'in-person',
      address: '456 Community Blvd',
      city: 'Barcelona',
      country: 'Spain'
    },
    imageUrl: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org19',
      name: 'Decentralized Social Alliance',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop'
    },
    categories: ['social', 'dev'],
    attendees: 240,
    maxAttendees: 300,
    price: {
      amount: 149,
      currency: 'USD'
    }
  },
  {
    id: '20',
    title: 'Zero Knowledge Proofs Workshop',
    description: 'A technical deep dive into zero-knowledge proofs and their applications in blockchain. From theory to implementation.',
    startDate: '2023-11-15T14:00:00Z',
    endDate: '2023-11-15T18:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.zoom.us/j/zkproofs'
    },
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org20',
      name: 'ZK Research Group',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['dev', 'defi'],
    attendees: 180,
    price: {
      amount: 0,
      currency: 'USD'
    }
  },
  {
    id: '21',
    title: 'Decentralized Science (DeSci) Conference',
    description: 'Explore how blockchain is transforming scientific research, funding, and publication. Connect with researchers and projects at the forefront of DeSci.',
    startDate: '2023-12-14T09:00:00Z',
    endDate: '2023-12-15T17:00:00Z',
    location: {
      type: 'hybrid',
      address: '789 Research Park',
      city: 'Boston',
      country: 'USA',
      link: 'https://meet.zoom.us/j/desci'
    },
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org21',
      name: 'DeSci Foundation',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['rwa', 'dev'],
    attendees: 260,
    maxAttendees: 300,
    price: {
      amount: 99,
      currency: 'USD'
    }
  },
  {
    id: '22',
    title: 'Crypto Trading Masterclass',
    description: 'Learn advanced trading strategies from professional crypto traders. From technical analysis to risk management and portfolio optimization.',
    startDate: '2023-11-19T15:00:00Z',
    endDate: '2023-11-19T19:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.zoom.us/j/tradingclass'
    },
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org22',
      name: 'Crypto Trading Academy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['defi'],
    attendees: 420,
    maxAttendees: 500,
    price: {
      amount: 79,
      currency: 'USD'
    }
  },
  {
    id: '23',
    title: 'Blockchain for Supply Chain Summit',
    description: 'Discover how blockchain is transforming global supply chains. From provenance tracking to automated settlements and smart contracts.',
    startDate: '2023-12-11T09:00:00Z',
    endDate: '2023-12-12T17:00:00Z',
    location: {
      type: 'in-person',
      address: '456 Logistics Center',
      city: 'Rotterdam',
      country: 'Netherlands'
    },
    imageUrl: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org23',
      name: 'Supply Chain Consortium',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop'
    },
    categories: ['rwa', 'depin'],
    attendees: 290,
    maxAttendees: 350,
    price: {
      amount: 249,
      currency: 'USD'
    }
  },
  {
    id: '24',
    title: 'Metaverse Design Workshop',
    description: 'A hands-on workshop for designers and developers building in the metaverse. Learn best practices for 3D environments, avatars, and interactions.',
    startDate: '2023-11-24T13:00:00Z',
    endDate: '2023-11-24T17:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.zoom.us/j/metaverse'
    },
    imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop',
    organizer: {
      id: 'org24',
      name: 'Metaverse Creators Guild',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1770&auto=format&fit=crop'
    },
    categories: ['gaming', 'ai'],
    attendees: 210,
    price: {
      amount: 49,
      currency: 'USD'
    }
  },
  {
    id: '25',
    title: 'DeFi Governance Forum',
    description: 'Join the conversation on decentralized governance models. Discuss best practices, challenges, and innovations in DAO governance.',
    startDate: '2023-12-20T13:00:00Z',
    endDate: '2023-12-20T17:00:00Z',
    location: {
      type: 'online',
      link: 'https://meet.zoom.us/j/defigovernance'
    },
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1902&auto=format&fit=crop',
    organizer: {
      id: 'org25',
      name: 'DeFi Governance Alliance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop'
    },
    categories: ['defi', 'social'],
    attendees: 195,
    price: {
      amount: 0,
      currency: 'USD'
    }
  },
  {
    id: '26',
    title: 'RWA Lending Summit',
    description: 'Explore the intersection of real-world assets and DeFi lending. Learn about the latest platforms, regulations, and opportunities.',
    startDate: '2023-12-22T10:00:00Z',
    endDate: '2023-12-22T16:00:00Z',
    location: {
      type: 'hybrid',
      address: '123 Finance Street',
      city: 'Dubai',
      country: 'UAE',
      link: 'https://meet.zoom.us/j/rwalending'
    },
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop',
    organizer: {
      id: 'org26',
      name: 'RWA Finance Consortium',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['rwa', 'defi'],
    attendees: 280,
    maxAttendees: 350,
    price: {
      amount: 199,
      currency: 'USD'
    },
    isFeatured: true
  },
  {
    id: '27',
    title: 'AI Ethics in Web3 Conference',
    description: 'A critical examination of ethical considerations at the intersection of AI and blockchain. Discuss responsible innovation and governance.',
    startDate: '2023-12-18T09:00:00Z',
    endDate: '2023-12-19T17:00:00Z',
    location: {
      type: 'in-person',
      address: '456 Ethics Boulevard',
      city: 'Amsterdam',
      country: 'Netherlands'
    },
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    organizer: {
      id: 'org27',
      name: 'Responsible Tech Alliance',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070&auto=format&fit=crop'
    },
    categories: ['ai', 'social'],
    attendees: 310,
    maxAttendees: 400,
    price: {
      amount: 149,
      currency: 'USD'
    }
  },
  {
    id: '28',
    title: 'DePIN Investor Summit',
    description: 'Connect with investors and projects in the decentralized physical infrastructure space. Pitch sessions, panel discussions, and networking.',
    startDate: '2023-12-05T09:00:00Z',
    endDate: '2023-12-06T17:00:00Z',
    location: {
      type: 'in-person',
      address: '789 Investor Plaza',
      city: 'New York',
      country: 'USA'
    },
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    organizer: {
      id: 'org28',
      name: 'DePIN Capital',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
    },
    categories: ['depin', 'rwa'],
    attendees: 250,
    maxAttendees: 300,
    price: {
      amount: 499,
      currency: 'USD'
    }
  }
];