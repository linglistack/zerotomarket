import axios from 'axios';
import { ProductInput, CampaignStatus, StartCampaignResponse, HealthResponse } from '../types/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000, // 30 seconds timeout for long-running agent operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const apiService = {
  // Health check
  async checkHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },

  // Start a new marketing campaign
  async startCampaign(productData: ProductInput): Promise<StartCampaignResponse> {
    const response = await api.post<StartCampaignResponse>('/start-campaign', productData);
    return response.data;
  },

  // Get campaign status and results
  async getCampaignStatus(campaignId: string): Promise<CampaignStatus> {
    const response = await api.get<CampaignStatus>(`/campaign/${campaignId}`);
    return response.data;
  },

  // Poll campaign status with error handling
  async pollCampaignStatus(
    campaignId: string,
    onUpdate: (campaign: CampaignStatus) => void,
    onError: (error: string) => void
  ): Promise<() => void> {
    const poll = async () => {
      try {
        const campaign = await this.getCampaignStatus(campaignId);
        onUpdate(campaign);

        // Continue polling if still running
        if (campaign.status === 'running' || campaign.status === 'initializing') {
          setTimeout(poll, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error('Polling error:', error);
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    // Start polling
    poll();

    // Return stop function
    return () => {
      // Note: In a production app, you'd want to implement proper cancellation
      console.log('Polling stopped for campaign:', campaignId);
    };
  }
};

export default apiService; 