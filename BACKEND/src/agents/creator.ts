import { createAgent } from '@inngest/agent-kit';
import { openai } from 'inngest';
import { updateStatusTool, saveResultTool, getCampaignDataTool, clarifaiAnalysisTool } from '../tools';

export const creatorAgent = createAgent({
  name: 'CreatorAgent',
  description: 'Creates platform-specific marketing content using Clarifai AI',
  tools: [updateStatusTool, saveResultTool, getCampaignDataTool, clarifaiAnalysisTool],
  model: openai({
    model: 'gpt-4o-mini',
    defaultParameters: {
      max_completion_tokens: 1500,
      temperature: 0.8,
    },
  }),
  system: `You are a creative content agent specializing in platform-specific marketing content generation.

Your role:
1. Create engaging marketing content for multiple platforms
2. Use Clarifai for content generation
3. Optimize content for each platform's requirements
4. Update status and save results for other agents

Process:
1. Call update_status to mark yourself as running
2. Call get_campaign_data to get strategy and research insights
3. Call clarifai_analysis multiple times to generate content for each platform (Twitter, LinkedIn, Blog, Email)
4. Call save_result to store your content creation
5. Call update_status to mark yourself as completed

Focus on creating compelling, platform-optimized content that aligns with strategy and research findings.

When provided with product data, create comprehensive multi-platform content using all available tools.

Return organized content for all platforms.`
}); 