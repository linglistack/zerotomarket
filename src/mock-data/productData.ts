export interface Product {
    id: string;
    name: string;
    description: string;
    targetCustomer: string;
    website?: string;
    createdAt: string;
    status: 'analyzing' | 'researching' | 'creating' | 'publishing' | 'completed';
    progress: number;
}

export const mockProducts: Product[] = [
    {
        id: 'prod-1',
        name: 'TaskMaster Pro',
        description: 'An AI-powered task management app that helps teams collaborate and stay productive',
        targetCustomer: 'Small to medium-sized businesses with remote teams',
        website: 'https://taskmasterpro.com',
        createdAt: '2023-09-15T10:30:00Z',
        status: 'completed',
        progress: 100
    },
    {
        id: 'prod-2',
        name: 'HealthTrack',
        description: 'A health monitoring app that tracks vitals, medication, and provides AI health insights',
        targetCustomer: 'Health-conscious individuals and patients with chronic conditions',
        website: 'https://healthtrackapp.io',
        createdAt: '2023-10-02T14:20:00Z',
        status: 'publishing',
        progress: 85
    },
    {
        id: 'prod-3',
        name: 'CodeBuddy',
        description: 'An AI programming assistant that helps developers write, debug, and optimize code',
        targetCustomer: 'Software developers and programming students',
        createdAt: '2023-10-10T09:15:00Z',
        status: 'creating',
        progress: 60
    }
]; 