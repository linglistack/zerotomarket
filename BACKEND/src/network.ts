import { createNetwork, anthropic } from '@inngest/agent-kit';
import { strategistAgent } from './agents/strategist';
import { researcherAgent } from './agents/researcher';
import { creatorAgent } from './agents/creator';
import { coordinatorAgent } from './agents/coordinator';

export const marketingNetwork = createNetwork({
  name: 'ZeroToMarket Marketing Network',
  agents: [strategistAgent, researcherAgent, creatorAgent, coordinatorAgent],
  defaultModel: anthropic({
    model: 'claude-3-5-haiku-latest',
    defaultParameters: {
      max_tokens: 1000,
    },
  }),
}); 