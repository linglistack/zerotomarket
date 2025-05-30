export interface CompetitorPost {
    id: string;
    source: 'twitter' | 'linkedin' | 'producthunt' | 'reddit' | 'website';
    competitorName: string;
    content: string;
    url: string;
    date: string;
    engagementScore: number;
    tags: string[];
}

export interface CompetitorInsight {
    id: string;
    productId: string;
    competitorName: string;
    keyInsight: string;
    recommendedAction: string;
    source: string;
    confidence: number;
}

export const mockCompetitorPosts: CompetitorPost[] = [
    {
        id: 'comp-post-1',
        source: 'twitter',
        competitorName: 'TaskFlow',
        content: 'TaskFlow just got a major update! AI-powered task recommendations, team analytics dashboard, and our new mobile app are now live. Managing your team\'s workflow has never been easier! #ProductivityTools #TeamManagement',
        url: 'https://twitter.com/TaskFlow/status/1234567890',
        date: '2023-09-10T15:30:00Z',
        engagementScore: 87,
        tags: ['product update', 'ai features', 'mobile']
    },
    {
        id: 'comp-post-2',
        source: 'producthunt',
        competitorName: 'TaskFlow',
        content: 'TaskFlow 3.0 - AI-powered task management for high-performing teams | Seamlessly organize tasks, automate workflows, and get AI-powered insights to boost your team\'s productivity.',
        url: 'https://www.producthunt.com/posts/taskflow-3-0',
        date: '2023-09-12T08:45:00Z',
        engagementScore: 92,
        tags: ['launch', 'featured', 'productivity']
    },
    {
        id: 'comp-post-3',
        source: 'linkedin',
        competitorName: 'HealthSync',
        content: 'We\'re thrilled to announce that HealthSync has been featured in TechCrunch as one of the top 10 health tech innovations of 2023! Our AI-driven health monitoring platform is helping thousands of users take control of their health journey. Read the full article in the comments! #HealthTech #Innovation',
        url: 'https://linkedin.com/company/healthsync/posts/12345',
        date: '2023-09-28T11:20:00Z',
        engagementScore: 95,
        tags: ['press coverage', 'award', 'milestone']
    },
    {
        id: 'comp-post-4',
        source: 'reddit',
        competitorName: 'DevAssist',
        content: 'DevAssist creator here! We just launched our beta for our AI programming assistant that helps with debugging, code optimization, and learning best practices. Looking for feedback from fellow developers - happy to answer any questions!',
        url: 'https://reddit.com/r/programming/comments/devassist_launch',
        date: '2023-10-05T19:15:00Z',
        engagementScore: 78,
        tags: ['beta launch', 'community feedback', 'developer tools']
    },
    {
        id: 'comp-post-5',
        source: 'website',
        competitorName: 'CodeGenius',
        content: 'Introducing CodeGenius Pro: Our most powerful AI coding assistant yet. With enhanced language support, integration with popular IDEs, and our new natural language code generation feature, CodeGenius Pro is changing how developers write code. Try it free for 14 days.',
        url: 'https://codegenius.dev/blog/introducing-codegenius-pro',
        date: '2023-09-18T13:40:00Z',
        engagementScore: 83,
        tags: ['product launch', 'premium tier', 'ide integration']
    }
];

export const mockCompetitorInsights: CompetitorInsight[] = [
    {
        id: 'insight-1',
        productId: 'prod-1',
        competitorName: 'TaskFlow',
        keyInsight: 'Emphasis on mobile app capabilities in marketing materials',
        recommendedAction: 'Highlight TaskMaster Pro\'s mobile features in upcoming campaigns',
        source: 'Twitter, ProductHunt',
        confidence: 0.87
    },
    {
        id: 'insight-2',
        productId: 'prod-1',
        competitorName: 'TaskFlow',
        keyInsight: 'High engagement when sharing specific AI feature examples',
        recommendedAction: 'Create detailed posts about specific AI capabilities with real use cases',
        source: 'LinkedIn, ProductHunt',
        confidence: 0.92
    },
    {
        id: 'insight-3',
        productId: 'prod-2',
        competitorName: 'HealthSync',
        keyInsight: 'Leverages press coverage and awards in social media strategy',
        recommendedAction: 'Pursue health tech awards and media coverage opportunities',
        source: 'LinkedIn',
        confidence: 0.78
    },
    {
        id: 'insight-4',
        productId: 'prod-3',
        competitorName: 'DevAssist, CodeGenius',
        keyInsight: 'Direct developer engagement on Reddit generates valuable feedback',
        recommendedAction: 'Create Reddit posts in r/programming and r/coding with specific questions for the community',
        source: 'Reddit',
        confidence: 0.85
    },
    {
        id: 'insight-5',
        productId: 'prod-3',
        competitorName: 'CodeGenius',
        keyInsight: 'Offers free trial to showcase premium features',
        recommendedAction: 'Consider implementing a free trial period for CodeBuddy',
        source: 'Website',
        confidence: 0.81
    }
]; 