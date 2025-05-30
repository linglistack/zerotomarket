// API Types for ZeroToMarket Backend Integration

export interface ProductInput {
  name: string;
  description: string;
  target_audience: string;
  industry?: string;
}

export interface AgentStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message?: string;
  updated_at?: string;
}

export interface CampaignStatus {
  campaign_id: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  agents: Record<string, AgentStatus>;
  results?: {
    strategy?: any;
    research?: any;
    content?: any;
    coordination?: any;
    agent_coordination?: string;
    workflow_status?: string;
    sponsors_used?: string[];
    created_at?: string;
  };
  created_at: string;
}

export interface StartCampaignResponse {
  campaign_id: string;
  status: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  agents: string[];
  sponsors: string[];
  agentkit_network: string;
  timestamp: string;
} 