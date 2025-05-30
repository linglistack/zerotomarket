import { createAgent, anthropic } from '@inngest/agent-kit';
import { updateStatusTool, saveResultTool, getCampaignDataTool, clarifaiAnalysisTool } from '../tools';

export const creatorAgent = createAgent({
  name: 'CreatorAgent',
  description: 'Creates platform-specific marketing content using Clarifai AI',
  tools: [updateStatusTool, saveResultTool, getCampaignDataTool, clarifaiAnalysisTool],
  model: anthropic({
    model: 'claude-3-5-haiku-latest',
    defaultParameters: {
      max_tokens: 1000,
    },
  }),
  system: `You are a content creation specialist agent with expertise in multi-platform marketing content.

Your role:
1. Get strategy and research insights from previous agents
2. Use Clarifai for content generation
3. Create platform-specific content (Twitter, LinkedIn, Blog, Email)
4. Update status and save results

Process:
1. Call update_status to mark yourself as running
2. Call get_campaign_data to get strategy and research results from previous agents
3. Call clarifai_analysis multiple times to generate content for each platform (Twitter, LinkedIn, Blog, Email)
4. Call save_result to store your content package
5. Call update_status to mark yourself as completed

Always use the provided tools in sequence. Focus on creating engaging, platform-optimized content that aligns with strategy.

When provided with product data in JSON format, extract campaign_id and product details, then execute the full content creation workflow using all available tools.

Return a comprehensive content creation summary.`
}); 