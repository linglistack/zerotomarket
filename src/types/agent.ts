export type AgentType = 'strategist' | 'research' | 'creator' | 'publisher';

export interface AgentStatus {
    isRunning: boolean;
    progress: number;
    lastUpdated: string;
    currentTask?: string;
    error?: string;
}

export interface Agent {
    id: string;
    type: AgentType;
    name: string;
    description: string;
    status: AgentStatus;
    capabilities: string[];
    integrations: string[];
}

export const mockAgents: Agent[] = [
    {
        id: 'agent-1',
        type: 'strategist',
        name: 'StrategistAgent',
        description: 'Determines optimal marketing angles, target audience segments, and brand tone based on product information.',
        status: {
            isRunning: false,
            progress: 100,
            lastUpdated: '2023-10-10T15:30:45Z'
        },
        capabilities: [
            'Audience analysis',
            'Market positioning',
            'Competitive differentiation',
            'Tone and voice development'
        ],
        integrations: ['Clarifai']
    },
    {
        id: 'agent-2',
        type: 'research',
        name: 'ResearchAgent',
        description: 'Scans competitor content and marketing strategies to gather insights and inspiration.',
        status: {
            isRunning: true,
            progress: 65,
            lastUpdated: '2023-10-11T09:45:12Z',
            currentTask: 'Analyzing competitor social media performance'
        },
        capabilities: [
            'Social media scraping',
            'Website content analysis',
            'Community engagement assessment',
            'Market trend identification'
        ],
        integrations: ['Apify']
    },
    {
        id: 'agent-3',
        type: 'creator',
        name: 'CreatorAgent',
        description: 'Generates engaging marketing content optimized for different platforms and audience segments.',
        status: {
            isRunning: false,
            progress: 0,
            lastUpdated: '2023-10-09T11:20:30Z'
        },
        capabilities: [
            'Platform-specific content creation',
            'Headline optimization',
            'Call-to-action generation',
            'Content personalization'
        ],
        integrations: ['Clarifai']
    },
    {
        id: 'agent-4',
        type: 'publisher',
        name: 'PublisherAgent',
        description: 'Manages the scheduling and publishing of content across various marketing channels.',
        status: {
            isRunning: false,
            progress: 30,
            lastUpdated: '2023-10-10T16:15:22Z',
            error: 'Twitter API rate limit exceeded'
        },
        capabilities: [
            'Multi-channel publishing',
            'Optimal timing analysis',
            'Engagement monitoring',
            'Publishing workflow automation'
        ],
        integrations: ['n8n']
    }
]; 