import { createNetwork } from '@inngest/agent-kit';
import { openai } from 'inngest';
import { strategistAgent } from './agents/strategist';
import { researcherAgent } from './agents/researcher';
import { creatorAgent } from './agents/creator';
import { coordinatorAgent } from './agents/coordinator';

export const marketingNetwork = createNetwork({
  agents: [strategistAgent, researcherAgent, creatorAgent, coordinatorAgent],
  defaultModel: openai({
    model: 'gpt-4o-mini',
    defaultParameters: {
      max_completion_tokens: 1000,
      temperature: 0.7,
    },
  })
}); 