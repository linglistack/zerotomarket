import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Psychology as BrainIcon,
  Search as SearchIcon,
  Create as CreateIcon,
  Tune as TuneIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  SmartToy as SmartToyIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { CampaignStatus } from '../types/api';
import { apiService } from '../services/api';

interface AgentWorkflowProps {
  campaignId: string;
  onComplete?: (campaign: CampaignStatus) => void;
  onError?: (error: string) => void;
}

const agentConfig = {
  strategist: {
    icon: BrainIcon,
    name: 'StrategistAgent',
    description: 'Analyzing product and creating marketing strategy using Clarifai AI',
    color: '#FF7E5F',
    tasks: [
      'Product analysis and positioning',
      'Target audience segmentation',
      'Strategic messaging framework',
      'Competitive positioning'
    ]
  },
  researcher: {
    icon: SearchIcon,
    name: 'ResearcherAgent',
    description: 'Conducting competitive intelligence using Apify web scraping',
    color: '#4ECDC4',
    tasks: [
      'Competitor landscape analysis',
      'Market trend identification',
      'Content performance insights',
      'Industry best practices'
    ]
  },
  creator: {
    icon: CreateIcon,
    name: 'CreatorAgent',
    description: 'Generating platform-specific content using Clarifai AI',
    color: '#45B7D1',
    tasks: [
      'Social media content creation',
      'Blog post and article drafts',
      'Email marketing templates',
      'Ad copy variations'
    ]
  },
  coordinator: {
    icon: TuneIcon,
    name: 'CoordinatorAgent',
    description: 'Optimizing and finalizing campaign using Clarifai AI',
    color: '#96CEB4',
    tasks: [
      'Campaign optimization',
      'Content quality assurance',
      'Publishing timeline',
      'Success metrics definition'
    ]
  }
};

const getAgentIcon = (agentName: string) => {
  const icons = {
    strategist: '🧠',
    researcher: '🔍', 
    creator: '✍️',
    coordinator: '📋'
  };
  return icons[agentName as keyof typeof icons] || '🤖';
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'completed': return '#4caf50';
    case 'running': return '#2196f3';
    case 'failed': return '#f44336';
    default: return '#9e9e9e';
  }
};

const AgentWorkflow: React.FC<AgentWorkflowProps> = ({ campaignId, onComplete, onError }) => {
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stopPolling: (() => void) | null = null;

    const startPolling = async () => {
      try {
        stopPolling = await apiService.pollCampaignStatus(
          campaignId,
          (updatedCampaign) => {
            setCampaignStatus(updatedCampaign);
            setLoading(false);
            
            if (updatedCampaign.status === 'completed') {
              onComplete?.(updatedCampaign);
            }
          },
          (errorMessage) => {
            setError(errorMessage);
            setLoading(false);
            onError?.(errorMessage);
          }
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start polling';
        setError(errorMessage);
        setLoading(false);
        onError?.(errorMessage);
      }
    };

    startPolling();

    return () => {
      if (stopPolling) {
        stopPolling();
      }
    };
  }, [campaignId, onComplete, onError]);

  const getAgentStepStatus = (agentName: string) => {
    if (!campaignStatus) return 'pending';
    const agent = campaignStatus.agents[agentName];
    if (!agent) return 'pending';
    return agent.status;
  };

  const getStepIcon = (agentName: string) => {
    const status = getAgentStepStatus(agentName);
    const IconComponent = agentConfig[agentName as keyof typeof agentConfig].icon;
    
    switch (status) {
      case 'completed':
        return <CheckIcon sx={{ color: '#4CAF50' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: '#F44336' }} />;
      case 'running':
        return <CircularProgress size={24} sx={{ color: agentConfig[agentName as keyof typeof agentConfig].color }} />;
      default:
        return <ScheduleIcon sx={{ color: '#9E9E9E' }} />;
    }
  };

  const getOverallProgress = () => {
    if (!campaignStatus) return 0;
    const agents = Object.values(campaignStatus.agents);
    if (agents.length === 0) return 0;
    
    const totalProgress = agents.reduce((sum, agent) => sum + agent.progress, 0);
    return Math.round(totalProgress / agents.length);
  };

  if (loading && !campaignStatus) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Initializing AgentKit Workflow...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preparing Clarifai AI and Apify integrations
        </Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Agent Workflow Error</Typography>
        <Typography variant="body2">{error}</Typography>
      </Alert>
    );
  }

  if (!campaignStatus) {
    return (
      <Alert severity="warning">
        Campaign not found or failed to load.
      </Alert>
    );
  }

  const activeStep = Object.entries(campaignStatus.agents).findIndex(([_, agent]) => 
    agent.status === 'running' || agent.status === 'pending'
  );

  return (
    <Box>
      {/* Overall Progress */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)' }}>
        <CardContent sx={{ color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🤖 AgentKit Multi-Agent Workflow
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={getOverallProgress()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </Box>
            <Typography variant="h6">{getOverallProgress()}%</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Clarifai AI" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} size="small" />
            <Chip label="Apify Intelligence" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} size="small" />
            <Chip label="AgentKit Orchestration" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} size="small" />
          </Box>
        </CardContent>
      </Card>

      {/* Agent Status Grid */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 3 
        }}
      >
        {Object.entries(agentConfig).map(([agentKey, config]) => {
          const agent = campaignStatus.agents[agentKey];
          const IconComponent = config.icon;
          
          return (
            <Box 
              key={agentKey}
              sx={{
                flex: '1 1 calc(25% - 24px)',
                minWidth: '250px',
                '@media (max-width: 900px)': {
                  flex: '1 1 calc(50% - 24px)'
                },
                '@media (max-width: 600px)': {
                  flex: '1 1 100%'
                }
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderLeft: `4px solid ${config.color}`,
                  opacity: agent?.status === 'completed' ? 1 : agent?.status === 'running' ? 1 : 0.7
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconComponent sx={{ color: config.color, mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {config.name}
                    </Typography>
                    {getStepIcon(agentKey)}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {config.description}
                  </Typography>
                  
                  {agent && (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={agent.progress}
                        sx={{ mb: 1, height: 6, borderRadius: 3 }}
                        color={agent.status === 'failed' ? 'error' : 'primary'}
                      />
                      <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        {agent.progress}% • {agent.status.toUpperCase()}
                      </Typography>
                      {agent.message && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          {agent.message}
                        </Typography>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Detailed Workflow Steps */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            📋 Detailed Agent Workflow
          </Typography>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            {Object.entries(agentConfig).map(([agentKey, config], index) => {
              const agent = campaignStatus.agents[agentKey];
              const isActive = agent?.status === 'running';
              const isCompleted = agent?.status === 'completed';
              
              return (
                <Step key={agentKey} completed={isCompleted}>
                  <StepLabel
                    icon={getStepIcon(agentKey)}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? agentConfig[agentKey as keyof typeof agentConfig].color : undefined
                      }
                    }}
                  >
                    {config.name}
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ pb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {config.description}
                      </Typography>
                      
                      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                        {config.tasks.map((task, taskIndex) => (
                          <Typography component="li" variant="body2" key={taskIndex}>
                            {task}
                          </Typography>
                        ))}
                      </Box>
                      
                      {agent && agent.progress > 0 && (
                        <LinearProgress
                          variant="determinate"
                          value={agent.progress}
                          sx={{ mb: 1 }}
                        />
                      )}
                    </Box>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </CardContent>
      </Card>

      {/* Results Section */}
      {campaignStatus.results && campaignStatus.status === 'completed' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            🎯 Generated Marketing Campaign
          </Typography>
          
          {/* Strategy Results */}
          {campaignStatus.results.strategy && (
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BrainIcon sx={{ color: '#FF7E5F', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Strategic Analysis
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 2 }}>
                  {campaignStatus.results.strategy.value_proposition && (
                    <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: '#FFF8F0' }}>
                      <Typography variant="subtitle2" color="primary" fontWeight={600}>
                        💡 Value Proposition
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {campaignStatus.results.strategy.value_proposition}
                      </Typography>
                    </Card>
                  )}
                  
                  {campaignStatus.results.strategy.messaging_themes && (
                    <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: '#F0F8FF' }}>
                      <Typography variant="subtitle2" color="primary" fontWeight={600}>
                        🎯 Key Messaging Themes
                      </Typography>
                      <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                        {campaignStatus.results.strategy.messaging_themes.map((theme: string, index: number) => (
                          <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                            {theme}
                          </Typography>
                        ))}
                      </Box>
                    </Card>
                  )}
                  
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary">
                      Full Strategic Analysis:
                    </Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', marginTop: '8px' }}>
                      {typeof campaignStatus.results.strategy.response === 'string' 
                        ? campaignStatus.results.strategy.response 
                        : JSON.stringify(campaignStatus.results.strategy, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Research Results */}
          {campaignStatus.results.research && (
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ color: '#4ECDC4', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Competitive Intelligence
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 2 }}>
                  {campaignStatus.results.research.data?.direct_competitors && (
                    <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: '#F0FFF4' }}>
                      <Typography variant="subtitle2" color="primary" fontWeight={600}>
                        🏢 Direct Competitors
                      </Typography>
                      {campaignStatus.results.research.data.direct_competitors.map((competitor: any, index: number) => (
                        <Box key={index} sx={{ mt: 1, p: 1.5, border: '1px solid #E0E0E0', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{competitor.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {competitor.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Pricing: {competitor.pricing_model} | Position: {competitor.market_position}
                          </Typography>
                        </Box>
                      ))}
                    </Card>
                  )}
                  
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary">
                      Full Research Data:
                    </Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', marginTop: '8px' }}>
                      {typeof campaignStatus.results.research === 'string' 
                        ? campaignStatus.results.research 
                        : JSON.stringify(campaignStatus.results.research, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Content Results */}
          {campaignStatus.results.content && (
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreateIcon sx={{ color: '#45B7D1', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Platform-Specific Content
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 2 }}>
                  {campaignStatus.results.content.content && (
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                      {Object.entries(campaignStatus.results.content.content).map(([platform, content]) => (
                        <Card key={platform} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                              {platform === 'twitter' ? '🐦 Twitter' : 
                               platform === 'linkedin' ? '💼 LinkedIn' : 
                               platform === 'blog_headline' ? '📝 Blog' : 
                               platform === 'email_subject' ? '📧 Email' : 
                               platform === 'ad_copy' ? '📢 Ad Copy' : platform}
                            </Typography>
                          </Box>
                          <Paper sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                              {content as string}
                            </Typography>
                          </Paper>
                          {platform === 'twitter' && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Characters: {(content as string).length}/280
                            </Typography>
                          )}
                        </Card>
                      ))}
                    </Box>
                  )}
                  
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Full Content Results:
                    </Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', marginTop: '8px' }}>
                      {typeof campaignStatus.results.content === 'string' 
                        ? campaignStatus.results.content 
                        : JSON.stringify(campaignStatus.results.content, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Coordination Results */}
          {campaignStatus.results.coordination && (
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TuneIcon sx={{ color: '#96CEB4', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Campaign Optimization
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 2 }}>
                  {campaignStatus.results.coordination.readiness_score && (
                    <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: '#F0FFF0' }}>
                      <Typography variant="subtitle2" color="primary" fontWeight={600}>
                        📊 Campaign Readiness Score
                      </Typography>
                      <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                        {campaignStatus.results.coordination.readiness_score}/10
                      </Typography>
                    </Card>
                  )}
                  
                  {campaignStatus.results.coordination.publishing_timeline && (
                    <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: '#FFF8F0' }}>
                      <Typography variant="subtitle2" color="primary" fontWeight={600}>
                        📅 Publishing Timeline
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {Object.entries(campaignStatus.results.coordination.publishing_timeline).map(([platform, timing]) => (
                          <Typography key={platform} variant="body2" sx={{ mb: 0.5 }}>
                            <strong>{platform}:</strong> {timing as string}
                          </Typography>
                        ))}
                      </Box>
                    </Card>
                  )}
                  
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary">
                      Full Optimization Analysis:
                    </Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', marginTop: '8px' }}>
                      {typeof campaignStatus.results.coordination.response === 'string' 
                        ? campaignStatus.results.coordination.response 
                        : JSON.stringify(campaignStatus.results.coordination, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Workflow Summary */}
          <Card sx={{ mt: 3, p: 3, background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)', color: 'white' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              🎉 Campaign Complete!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Your marketing campaign has been generated by our multi-agent AI system using Clarifai AI and Apify intelligence.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Strategic Analysis ✓" sx={{ bgcolor: 'white', color: 'primary.main' }} size="small" />
              <Chip label="Competitive Research ✓" sx={{ bgcolor: 'white', color: 'primary.main' }} size="small" />
              <Chip label="Content Generation ✓" sx={{ bgcolor: 'white', color: 'primary.main' }} size="small" />
              <Chip label="Campaign Optimization ✓" sx={{ bgcolor: 'white', color: 'primary.main' }} size="small" />
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AgentWorkflow; 