import Fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { marketingNetwork } from './network';
import { strategistAgent } from './agents/strategist';
import { researcherAgent } from './agents/researcher';
import { creatorAgent } from './agents/creator';
import { coordinatorAgent } from './agents/coordinator';
import { 
  campaignStorage, 
  updateStatusTool, 
  saveResultTool, 
  getCampaignDataTool, 
  clarifaiAnalysisTool, 
  apifyScrapeTool 
} from './tools';

const fastify = Fastify({ logger: true });

// Enable CORS for frontend
fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// Types
interface ProductInput {
  name: string;
  description: string;
  target_audience: string;
  industry?: string;
}

interface AgentStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message?: string;
  updated_at?: string;
}

interface CampaignStatus {
  campaign_id: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  agents: Record<string, AgentStatus>;
  results?: any;
  created_at: string;
}

// In-memory campaign tracking
const campaigns = new Map<string, CampaignStatus>();

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'healthy', 
    message: 'ZeroToMarket AgentKit Backend Ready',
    agents: ['StrategistAgent', 'ResearcherAgent', 'CreatorAgent', 'CoordinatorAgent'],
    sponsors: ['Clarifai', 'Apify'],
    agentkit_network: marketingNetwork ? 'loaded' : 'error',
    timestamp: new Date().toISOString()
  };
});

// Start marketing campaign with AgentKit workflow
fastify.post<{ Body: ProductInput }>('/start-campaign', async (request, reply) => {
  const productData = request.body;
  const campaignId = uuidv4();

  // Initialize campaign tracking
  const campaign: CampaignStatus = {
    campaign_id: campaignId,
    status: 'initializing',
    agents: {
      strategist: { status: 'pending', progress: 0 },
      researcher: { status: 'pending', progress: 0 },
      creator: { status: 'pending', progress: 0 },
      coordinator: { status: 'pending', progress: 0 }
    },
    created_at: new Date().toISOString()
  };

  campaigns.set(campaignId, campaign);

  // Run the campaign through AgentKit network
  setImmediate(async () => {
    try {
      campaign.status = 'running';
      
      // Create the prompt for the marketing network
      const prompt = `Create a complete marketing campaign for this product:

Product: ${productData.name}
Description: ${productData.description}
Target Audience: ${productData.target_audience}
Industry: ${productData.industry || 'tech'}
Campaign ID: ${campaignId}

Execute the following workflow:
1. StrategistAgent: Analyze product and create strategic positioning using Clarifai
2. ResearcherAgent: Conduct competitive intelligence using Apify  
3. CreatorAgent: Generate platform-specific content using Clarifai
4. CoordinatorAgent: Optimize and finalize campaign using Clarifai

Each agent should use their respective sponsor tools and save results for the next agent.`;

      // Run agents sequentially using AgentKit
      console.log('🧠 Running StrategistAgent with Clarifai...');
      const strategyResult = await strategistAgent.run(prompt);
      campaign.agents.strategist = { status: 'completed', progress: 100 };

      console.log('🕷️ Running ResearcherAgent with Apify...');
      const researchResult = await researcherAgent.run(prompt);
      campaign.agents.researcher = { status: 'completed', progress: 100 };

      console.log('✍️ Running CreatorAgent with Clarifai...');
      const contentResult = await creatorAgent.run(prompt);
      campaign.agents.creator = { status: 'completed', progress: 100 };

      console.log('📋 Running CoordinatorAgent with Clarifai...');
      const coordinatorResult = await coordinatorAgent.run(prompt);
      campaign.agents.coordinator = { status: 'completed', progress: 100 };
      
      // Update campaign with results
      campaign.status = 'completed';
      campaign.results = {
        strategy: strategyResult,
        research: researchResult,
        content: contentResult,
        coordination: coordinatorResult,
        agent_coordination: 'Complete AgentKit workflow with sponsor tool integration',
        workflow_status: 'completed',
        sponsors_used: ['Clarifai AI', 'Apify Intelligence'],
        created_at: new Date().toISOString()
      };
      
      console.log(`🎯 AgentKit workflow completed for campaign ${campaignId}`);
      
    } catch (error) {
      console.error(`❌ AgentKit workflow failed for campaign ${campaignId}:`, error);
      campaign.status = 'failed';
      campaign.results = { error: (error as Error).message };
    }
  });

  return {
    campaign_id: campaignId,
    status: 'started',
    message: 'AgentKit multi-agent workflow initiated with Clarifai + Apify integration'
  };
});

// Get campaign status and results
fastify.get<{ Params: { campaign_id: string } }>('/campaign/:campaign_id', async (request, reply) => {
  const { campaign_id } = request.params;
  const campaign = campaigns.get(campaign_id);

  if (!campaign) {
    reply.code(404);
    return { error: 'Campaign not found' };
  }

  // Update agent statuses from campaign storage
  updateCampaignStatusFromStorage(campaign_id, campaign);

  return campaign;
});

// Update campaign status from storage
function updateCampaignStatusFromStorage(campaignId: string, campaign: CampaignStatus) {
  const agentNames = ['strategist', 'researcher', 'creator', 'coordinator'];
  
  agentNames.forEach(agentName => {
    const statusKey = `${campaignId}_status_${agentName}`;
    const statusData = campaignStorage.get(statusKey);
    
    if (statusData) {
      campaign.agents[agentName] = {
        status: statusData.status,
        progress: statusData.progress,
        message: statusData.message,
        updated_at: statusData.updated_at
      };
    }
  });
}

// Start server
const start = async () => {
  try {
    console.log('🚀 Starting ZeroToMarket AgentKit Backend...');
    console.log('🤖 Agents: StrategistAgent, ResearcherAgent, CreatorAgent, CoordinatorAgent');
    console.log('🔧 Sponsors: Clarifai (AI), Apify (Intelligence)');
    console.log('⚡ Powered by AgentKit multi-agent orchestration');
    
    await fastify.listen({ port: 8000, host: '0.0.0.0' });
    
    console.log('✅ Server running on http://localhost:8000');
    console.log('📊 Health check: http://localhost:8000/health');
    console.log('🎯 Ready for hackathon demo with real sponsor integration!');
    
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 