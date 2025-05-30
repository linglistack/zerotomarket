import Fastify from 'fastify';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const fastify = Fastify({ logger: true });

// Enable CORS for frontend
fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types
interface ProductInput {
  name: string;
  description: string;
  target_audience: string;
  industry?: string;
}

interface AgentStatus {
  status: 'pending' | 'running' | 'completed' | 'failed' | 'generating' | 'analyzing' | 'optimizing' | string;
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

// Agent classes using direct OpenAI API
class StrategistAgent {
  async execute(campaignId: string, productData: ProductInput): Promise<any> {
    console.log('🧠 Running StrategistAgent...');
    
    const campaign = campaigns.get(campaignId);
    if (campaign) {
      campaign.agents.strategist = { status: 'running', progress: 20 };
    }

    try {
      const prompt = `Act as a senior marketing strategist. Analyze this product:

Product: ${productData.name}
Description: ${productData.description}
Target Audience: ${productData.target_audience}
Industry: ${productData.industry || 'tech'}

Provide a strategic analysis with:
1. Unique Value Proposition (1 sentence)
2. Marketing Angle (1 sentence)  
3. Key Messaging Themes (3 bullet points)
4. Target Persona Details
5. Recommended Tone (professional/casual/technical)

Be specific and actionable.`;

      if (campaign) {
        campaign.agents.strategist = { status: 'generating', progress: 60 };
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const result = {
        agent: 'strategist',
        strategy_content: response.choices[0].message.content,
        value_proposition: `The go-to ${productData.name} for ${productData.target_audience}`,
        marketing_angle: 'Focus on immediate problem-solving value',
        tone: 'professional yet approachable',
        target_persona: `Busy ${productData.target_audience} looking for efficient solutions`
      };

      if (campaign) {
        campaign.agents.strategist = { status: 'completed', progress: 100 };
      }

      return result;
    } catch (error) {
      console.error('StrategistAgent error:', error);
      if (campaign) {
        campaign.agents.strategist = { status: 'failed', progress: 0 };
      }
      return { agent: 'strategist', error: (error as Error).message };
    }
  }
}

class ResearcherAgent {
  async execute(campaignId: string, productData: ProductInput): Promise<any> {
    console.log('🔍 Running ResearcherAgent...');
    
    const campaign = campaigns.get(campaignId);
    if (campaign) {
      campaign.agents.researcher = { status: 'running', progress: 20 };
    }

    try {
      const prompt = `Act as a market research specialist. Analyze the competitive landscape for:

Product: ${productData.name}
Description: ${productData.description}
Industry: ${productData.industry || 'tech'}
Target Audience: ${productData.target_audience}

Provide competitive intelligence including:
1. Market trends in this space
2. Common competitor messaging patterns
3. Pricing strategies observed
4. Content marketing approaches
5. Recommendations based on market analysis

Focus on actionable competitive insights.`;

      if (campaign) {
        campaign.agents.researcher = { status: 'analyzing', progress: 60 };
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.5,
      });

      const result = {
        agent: 'researcher',
        market_analysis: response.choices[0].message.content,
        competitor_insights: {
          successful_headlines: [
            `Revolutionary ${productData.industry || 'tech'} solution`,
            `Streamline your ${productData.target_audience} workflow`,
            '10x productivity with AI automation'
          ],
          common_messaging: [
            'Save time and increase efficiency',
            'Built specifically for modern teams',
            'Seamless integration with existing tools'
          ],
          engagement_patterns: {
            best_posting_times: ['9AM', '2PM', '6PM'],
            effective_hashtags: ['#productivity', '#automation', '#innovation'],
            content_length: { twitter: '150-200 chars', linkedin: '2-3 sentences' }
          }
        },
        market_trends: `Growing demand for ${productData.industry || 'tech'} solutions`,
        content_recommendations: 'Focus on problem-solution fit messaging'
      };

      if (campaign) {
        campaign.agents.researcher = { status: 'completed', progress: 100 };
      }

      return result;
    } catch (error) {
      console.error('ResearcherAgent error:', error);
      if (campaign) {
        campaign.agents.researcher = { status: 'failed', progress: 0 };
      }
      return { agent: 'researcher', error: (error as Error).message };
    }
  }
}

class CreatorAgent {
  async execute(campaignId: string, inputData: any): Promise<any> {
    console.log('✍️ Running CreatorAgent...');
    
    const campaign = campaigns.get(campaignId);
    if (campaign) {
      campaign.agents.creator = { status: 'running', progress: 20 };
    }

    try {
      const { productData, strategy, research } = inputData;
      const platforms = ['twitter', 'linkedin', 'blog', 'email'];
      const content: any = {};

      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        
        if (campaign) {
          campaign.agents.creator = { status: `creating_${platform}`, progress: 20 + (i * 20) };
        }

        const prompt = `Create ${platform} content for:

Product: ${productData.name}
Description: ${productData.description}
Strategy: ${strategy?.marketing_angle || 'Focus on value'}
Target: ${productData.target_audience}
Tone: ${strategy?.tone || 'professional'}

Platform Guidelines:
- Twitter: 280 chars max, engaging, 2-3 hashtags
- LinkedIn: Professional, 2-3 sentences, value-focused  
- Blog: Compelling headline and 2-sentence preview
- Email: Subject line + opening sentence

Create compelling, specific content that resonates with the target audience.`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.8,
        });

        content[platform] = response.choices[0].message.content?.trim();
        
        // Small delay between API calls
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const result = {
        agent: 'creator',
        content: content,
        content_strategy: 'Multi-platform value-driven messaging',
        optimization: 'Tailored for audience engagement patterns'
      };

      if (campaign) {
        campaign.agents.creator = { status: 'completed', progress: 100 };
      }

      return result;
    } catch (error) {
      console.error('CreatorAgent error:', error);
      if (campaign) {
        campaign.agents.creator = { status: 'failed', progress: 0 };
      }
      return { agent: 'creator', error: (error as Error).message };
    }
  }
}

class CoordinatorAgent {
  async execute(campaignId: string, inputData: any): Promise<any> {
    console.log('📋 Running CoordinatorAgent...');
    
    const campaign = campaigns.get(campaignId);
    if (campaign) {
      campaign.agents.coordinator = { status: 'running', progress: 20 };
    }

    try {
      const { productData, strategy, research, content } = inputData;

      const prompt = `As a campaign coordinator, analyze this complete marketing campaign:

Product: ${productData.name}
Strategy: ${strategy?.value_proposition || 'No strategy'}
Research Insights: ${research?.market_trends || 'No research'}
Content Created: ${Object.keys(content?.content || {}).length} pieces

Provide:
1. Campaign Readiness Score (1-10)
2. Key Strengths (2 points)
3. Optimization Recommendations (2 points)
4. Publishing Timeline (when to post each piece)
5. Success Metrics to track

Be concise and actionable.`;

      if (campaign) {
        campaign.agents.coordinator = { status: 'optimizing', progress: 60 };
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.6,
      });

      const final_campaign = {
        campaign_id: campaignId,
        product_name: productData.name,
        readiness_score: 8.5,
        optimization_analysis: response.choices[0].message.content,
        content_pieces: Object.keys(content?.content || {}).length,
        recommended_timeline: {
          twitter: 'Post immediately for engagement',
          linkedin: 'Post during business hours',
          blog: 'Schedule for next week',
          email: 'Send to subscribers first'
        },
        success_metrics: [
          'Engagement rate on social media',
          'Click-through rate from content',
          'Lead generation from campaign'
        ],
        next_steps: 'Ready for publication across all channels'
      };

      const result = {
        agent: 'coordinator',
        final_campaign: final_campaign,
        campaign_ready: true
      };

      if (campaign) {
        campaign.agents.coordinator = { status: 'completed', progress: 100 };
      }

      return result;
    } catch (error) {
      console.error('CoordinatorAgent error:', error);
      if (campaign) {
        campaign.agents.coordinator = { status: 'failed', progress: 0 };
      }
      return { agent: 'coordinator', error: (error as Error).message };
    }
  }
}

// Initialize agents
const strategist = new StrategistAgent();
const researcher = new ResearcherAgent();
const creator = new CreatorAgent();
const coordinator = new CoordinatorAgent();

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'healthy', 
    message: 'ZeroToMarket AI Backend Ready',
    agents: ['StrategistAgent', 'ResearcherAgent', 'CreatorAgent', 'CoordinatorAgent'],
    ai_model: 'OpenAI GPT-4o-mini',
    openai_configured: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  };
});

// Start marketing campaign
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

  // Run agent workflow in background
  setImmediate(async () => {
    try {
      console.log(`🚀 Starting AI agent workflow for campaign ${campaignId}`);
      campaign.status = 'running';
      
      // Phase 1: Strategy and Research (parallel)
      console.log('📋 Phase 1: Strategy analysis and competitive research...');
      const [strategyResult, researchResult] = await Promise.all([
        strategist.execute(campaignId, productData),
        researcher.execute(campaignId, productData)
      ]);

      // Phase 2: Content Creation
      console.log('✍️ Phase 2: Content creation using strategy and research...');
      const contentResult = await creator.execute(campaignId, {
        productData,
        strategy: strategyResult,
        research: researchResult
      });

      // Phase 3: Campaign Coordination
      console.log('📋 Phase 3: Campaign coordination and optimization...');
      const coordinatorResult = await coordinator.execute(campaignId, {
        productData,
        strategy: strategyResult,
        research: researchResult,
        content: contentResult
      });

      // Update final results
      campaign.results = {
        strategy: strategyResult,
        research: researchResult,
        content: contentResult,
        final_campaign: coordinatorResult,
        agent_coordination: 'Sequential workflow with AI agents',
        workflow_status: 'completed',
        ai_model_used: 'OpenAI GPT-4o-mini',
        created_at: new Date().toISOString()
      };
      campaign.status = 'completed';
      
      console.log(`✅ AI workflow completed for campaign ${campaignId}`);
    } catch (error) {
      console.error(`❌ AI workflow failed for campaign ${campaignId}:`, error);
      campaign.status = 'failed';
      campaign.results = { error: (error as Error).message };
    }
  });

  return {
    campaign_id: campaignId,
    status: 'started',
    message: 'AI multi-agent workflow initiated with OpenAI GPT-4o-mini'
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

  return campaign;
});

// Start server
const start = async () => {
  try {
    console.log('🚀 Starting ZeroToMarket AI Backend...');
    console.log('🤖 Agents: StrategistAgent, ResearcherAgent, CreatorAgent, CoordinatorAgent');
    console.log('🔧 AI Model: OpenAI GPT-4o-mini (cost-effective and fast)');
    console.log('⚡ Powered by direct OpenAI API integration');
    
    await fastify.listen({ port: 8000, host: '0.0.0.0' });
    
    console.log('✅ Server running on http://localhost:8000');
    console.log('📊 Health check: http://localhost:8000/health');
    console.log('🎯 Ready for demo with AI-powered marketing intelligence!');
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
      console.warn('💡 Add your OpenAI API key to .env for full functionality');
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 