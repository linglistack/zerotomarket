import { z } from 'zod';

// Product input schema
export const ProductInputSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  target_audience: z.string().min(1, "Target audience is required"),
  industry: z.string().default("tech")
});

export type ProductInput = z.infer<typeof ProductInputSchema>;

// Campaign status tracking
export interface AgentStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  last_update?: string;
  message?: string;
}

export interface CampaignState {
  campaign_id: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  agents: {
    strategist: AgentStatus;
    researcher: AgentStatus;
    creator: AgentStatus;
    coordinator: AgentStatus;
  };
  results: {
    strategy?: any;
    research?: any;
    content?: any;
    final_campaign?: any;
    workflow_status?: string;
  };
  created_at: string;
  updated_at: string;
}

// Agent result types
export interface StrategyResult {
  agent: 'strategist';
  strategy_content: string;
  value_proposition: string;
  marketing_angle: string;
  tone: string;
  target_persona: string;
}

export interface ResearchResult {
  agent: 'researcher';
  competitor_insights: {
    successful_headlines: string[];
    common_messaging: string[];
    engagement_patterns: {
      best_posting_times: string[];
      effective_hashtags: string[];
      content_length: Record<string, string>;
    };
  };
  market_trends: string;
  content_recommendations: string;
}

export interface ContentResult {
  agent: 'creator';
  content: Record<string, string>;
  content_strategy: string;
  optimization: string;
}

export interface CoordinatorResult {
  agent: 'coordinator';
  final_campaign: {
    campaign_id: string;
    product_name: string;
    readiness_score: number;
    optimization_analysis: string;
    content_pieces: number;
    recommended_timeline: Record<string, string>;
    success_metrics: string[];
    next_steps: string;
  };
  campaign_ready: boolean;
} 