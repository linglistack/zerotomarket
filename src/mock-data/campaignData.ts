export interface Campaign {
    id: string;
    productId: string;
    name: string;
    platform: 'twitter' | 'linkedin' | 'facebook' | 'email' | 'reddit';
    status: 'draft' | 'scheduled' | 'published';
    scheduledDate?: string;
    publishedDate?: string;
    content: string;
    engagementMetrics?: {
        impressions: number;
        likes: number;
        shares: number;
        comments: number;
        clicks: number;
    };
}

export const mockCampaigns: Campaign[] = [
    {
        id: 'camp-1',
        productId: 'prod-1',
        name: 'TaskMaster Pro Launch',
        platform: 'twitter',
        status: 'published',
        scheduledDate: '2023-09-20T09:00:00Z',
        publishedDate: '2023-09-20T09:00:00Z',
        content: 'Introducing TaskMaster Pro: The AI-powered task management solution that helps remote teams collaborate seamlessly. Say goodbye to missed deadlines and hello to productivity! #ProductivityTools #RemoteWork',
        engagementMetrics: {
            impressions: 1205,
            likes: 45,
            shares: 12,
            comments: 8,
            clicks: 67
        }
    },
    {
        id: 'camp-2',
        productId: 'prod-1',
        name: 'TaskMaster Pro Features',
        platform: 'linkedin',
        status: 'published',
        scheduledDate: '2023-09-22T10:30:00Z',
        publishedDate: '2023-09-22T10:30:00Z',
        content: 'TaskMaster Pro is revolutionizing how remote teams work together. Our AI-powered platform offers:\n\n✅ Smart task prioritization\n✅ Automated progress tracking\n✅ Team productivity analytics\n✅ Seamless integration with your existing tools\n\nLearn more at taskmasterpro.com #ProductivityTools #RemoteWork',
        engagementMetrics: {
            impressions: 2340,
            likes: 87,
            shares: 34,
            comments: 15,
            clicks: 129
        }
    },
    {
        id: 'camp-3',
        productId: 'prod-2',
        name: 'HealthTrack Announcement',
        platform: 'twitter',
        status: 'published',
        scheduledDate: '2023-10-05T14:00:00Z',
        publishedDate: '2023-10-05T14:00:00Z',
        content: 'Excited to announce HealthTrack - your personal health companion! Track vitals, manage medications, and receive AI-powered health insights, all in one app. Take control of your health journey today. #HealthTech #DigitalHealth',
        engagementMetrics: {
            impressions: 980,
            likes: 32,
            shares: 8,
            comments: 4,
            clicks: 45
        }
    },
    {
        id: 'camp-4',
        productId: 'prod-2',
        name: 'HealthTrack Benefits Email',
        platform: 'email',
        status: 'scheduled',
        scheduledDate: '2023-10-12T09:00:00Z',
        content: "Subject: Transform Your Health Journey with HealthTrack\n\nDear Health Enthusiast,\n\nWe're excited to introduce HealthTrack, the all-in-one health monitoring app designed to help you take control of your wellness journey.\n\nWith HealthTrack, you can:\n• Monitor vital health metrics in real-time\n• Set medication reminders\n• Receive personalized AI health insights\n• Track your progress over time\n• Share reports with your healthcare provider\n\nJoin thousands of users who are already benefiting from HealthTrack's intuitive design and powerful features.\n\nDownload now at healthtrackapp.io\n\nTo your health,\nThe HealthTrack Team"
    },
    {
        id: 'camp-5',
        productId: 'prod-3',
        name: 'CodeBuddy Introduction',
        platform: 'reddit',
        status: 'draft',
        content: "Hey r/programming! I'm excited to share a project I've been working on: CodeBuddy, an AI programming assistant designed to help developers write, debug, and optimize code.\n\nAs developers ourselves, we know the challenges of debugging tricky issues, optimizing performance bottlenecks, and staying up-to-date with best practices. CodeBuddy addresses these pain points with features like:\n\n- Real-time code suggestions and completions\n- Intelligent debugging assistance\n- Performance optimization recommendations\n- Language-specific best practices\n\nWe're currently in beta and looking for feedback from fellow developers. Would love to hear your thoughts and answer any questions!"
    }
]; 