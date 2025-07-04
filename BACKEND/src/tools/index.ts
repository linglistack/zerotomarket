import { createTool } from '@inngest/agent-kit';
import { z } from 'zod';

// Global campaign storage for demo
const campaignStorage = new Map<string, any>();

// Tool to update agent status in campaign state
export const updateStatusTool = createTool({
  name: 'update_status',
  description: 'Update the status and progress of an agent in the campaign',
  parameters: z.object({
    campaign_id: z.string(),
    agent_name: z.string(), 
    status: z.enum(['pending', 'running', 'completed', 'failed']),
    progress: z.number().min(0).max(100),
    message: z.string().optional()
  }),
  handler: async ({ campaign_id, agent_name, status, progress, message }, opts) => {
    console.log(`🤖 ${agent_name} - Campaign ${campaign_id}: ${status} (${progress}%)`);
    if (message) console.log(`   ${message}`);
    
    // Store status update
    const campaignKey = `${campaign_id}_status_${agent_name}`;
    campaignStorage.set(campaignKey, { status, progress, message, updated_at: new Date().toISOString() });
    
    return `Updated ${agent_name} status to ${status} (${progress}%)`;
  }
});

// Tool to save agent results
export const saveResultTool = createTool({
  name: 'save_result',
  description: 'Save the result of an agent execution',
  parameters: z.object({
    campaign_id: z.string(),
    agent_name: z.string(),
    result: z.any()
  }),
  handler: async ({ campaign_id, agent_name, result }, opts) => {
    console.log(`💾 Saving result for ${agent_name} in campaign ${campaign_id}`);
    
    // Store agent result
    const resultKey = `${campaign_id}_result_${agent_name}`;
    campaignStorage.set(resultKey, result);
    
    return `Saved result for ${agent_name}`;
  }
});

// Tool to get campaign data
export const getCampaignDataTool = createTool({
  name: 'get_campaign_data',
  description: 'Get campaign data and previous agent results',
  parameters: z.object({
    campaign_id: z.string()
  }),
  handler: async ({ campaign_id }, opts) => {
    console.log(`📊 Getting campaign data for ${campaign_id}`);
    
    // Retrieve all data for this campaign
    const campaignData = {};
    for (const [key, value] of campaignStorage.entries()) {
      if (key.startsWith(campaign_id)) {
        const keyPart = key.replace(`${campaign_id}_`, '');
        (campaignData as any)[keyPart] = value;
      }
    }
    
    return {
      campaign_id,
      data: campaignData
    };
  }
});

// MCP Tool for Clarifai integration
export const clarifaiAnalysisTool = createTool({
  name: 'clarifai_analysis',
  description: 'Use Clarifai AI for content analysis and generation',
  parameters: z.object({
    prompt: z.string(),
    model_type: z.enum(['strategy', 'content', 'optimization']).default('strategy')
  }),
  handler: async ({ prompt, model_type }, opts) => {
    console.log(`🧠 Clarifai ${model_type} analysis...`);
    
    // Simulate Clarifai API call
    // In production, use clarifai-nodejs SDK here
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponses = {
      strategy: `Strategic insights: ${prompt.substring(0, 50)}... [Generated by Clarifai AI]`,
      content: `Content generated: ${prompt.substring(0, 50)}... [Optimized by Clarifai]`,
      optimization: `Optimization recommendations: ${prompt.substring(0, 50)}... [Analyzed by Clarifai]`
    };
    
    return {
      model_type,
      response: mockResponses[model_type],
      clarifai_powered: true
    };
  }
});

// MCP Tool for Apify integration  
export const apifyScrapeTool = createTool({
  name: 'apify_scrape',
  description: 'Use Apify for competitive intelligence and web scraping',
  parameters: z.object({
    target: z.string(),
    scrape_type: z.enum(['competitors', 'trends', 'content']).default('competitors')
  }),
  handler: async ({ target, scrape_type }, opts) => {
    console.log(`🕷️ Apify scraping ${scrape_type} for: ${target}`);
    
    // Simulate Apify scraping
    // In production, use apify-client here
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData = {
      competitors: [
        `Top competitor for ${target}`,
        `Emerging player in ${target} space`,
        `Market leader analysis`
      ],
      trends: [
        `Growing trend: AI integration in ${target}`,
        `Market shift: User-centric design`,
        `Emerging: Automation focus`
      ],
      content: [
        `Popular content themes in ${target}`,
        `Engagement patterns discovered`,
        `Content optimization insights`
      ]
    };
    
    return {
      target,
      scrape_type,
      data: mockData[scrape_type],
      apify_powered: true
    };
  }
});

// Export storage access for server
export { campaignStorage }; 