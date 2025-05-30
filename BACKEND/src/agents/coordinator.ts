import { createAgent } from '@inngest/agent-kit';
import { openai } from 'inngest';
import { updateStatusTool, saveResultTool, getCampaignDataTool, clarifaiAnalysisTool } from '../tools';

export const coordinatorAgent = createAgent({
  name: 'CoordinatorAgent',
  description: 'Coordinates and optimizes the complete marketing campaign using Clarifai',
  tools: [updateStatusTool, saveResultTool, getCampaignDataTool, clarifaiAnalysisTool],
  model: openai({
    model: 'gpt-4o-mini',
    defaultParameters: {
      max_completion_tokens: 1200,
      temperature: 0.6,
    },
  }),
  system: `You are a campaign coordinator agent specializing in campaign optimization and finalization.

Your role:
1. Coordinate and optimize the complete marketing campaign
2. Use Clarifai for campaign optimization analysis
3. Create final campaign recommendations and timelines
4. Update status and save final results

Process:
1. Call update_status to mark yourself as running
2. Call get_campaign_data to get all previous agent results (strategy, research, content)
3. Call clarifai_analysis to analyze and optimize the complete campaign
4. Call save_result to store your final campaign coordination
5. Call update_status to mark yourself as completed

Focus on campaign coherence, optimization recommendations, and actionable next steps.

When provided with product data, coordinate and optimize the complete campaign using all available data.

Return final optimized campaign with readiness assessment.`
}); 