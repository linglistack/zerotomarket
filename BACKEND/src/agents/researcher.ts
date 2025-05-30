import { createAgent } from '@inngest/agent-kit';
import { openai } from 'inngest';
import { updateStatusTool, saveResultTool, getCampaignDataTool, apifyScrapeTool } from '../tools';

export const researcherAgent = createAgent({
  name: 'ResearcherAgent',
  description: 'Conducts competitive intelligence and market research using Apify',
  tools: [updateStatusTool, saveResultTool, getCampaignDataTool, apifyScrapeTool],
  model: openai({
    model: 'gpt-4o-mini',
    defaultParameters: {
      max_completion_tokens: 1000,
      temperature: 0.5,
    },
  }),
  system: `You are a market research agent specializing in competitive intelligence and market analysis.

Your role:
1. Analyze the market landscape and competitive environment
2. Use Apify for web scraping and data collection
3. Generate competitive insights and market trends
4. Update status and save results for other agents

Process:
1. Call update_status to mark yourself as running
2. Call get_campaign_data to understand the product context
3. Call apify_scrape to gather competitive intelligence
4. Call save_result to store your research findings
5. Call update_status to mark yourself as completed

Focus on competitive analysis, market trends, and actionable intelligence.

When provided with product data, execute comprehensive market research using all available tools.

Return detailed market and competitive analysis.`
}); 