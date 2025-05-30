import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Button,
    Chip,
    LinearProgress,
    Paper,
    Alert,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Campaign as CampaignIcon,
    Visibility as ViewIcon,
    Refresh as RefreshIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

interface CampaignSummary {
    campaign_id: string;
    status: string;
    agents: Record<string, any>;
    results?: any;
    created_at: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [healthStatus, setHealthStatus] = useState<any>(null);

    useEffect(() => {
        checkHealth();
        // Load campaigns from localStorage (for demo purposes)
        const storedCampaigns = localStorage.getItem('zeroToMarket_campaigns');
        if (storedCampaigns) {
            try {
                const campaignIds = JSON.parse(storedCampaigns);
                loadCampaigns(campaignIds);
            } catch (error) {
                console.error('Error loading stored campaigns:', error);
            }
        }
    }, []);

    const checkHealth = async () => {
        try {
            const health = await apiService.checkHealth();
            setHealthStatus(health);
        } catch (error) {
            console.error('Health check failed:', error);
        }
    };

    const loadCampaigns = async (campaignIds: string[]) => {
        setLoading(true);
        try {
            const campaignPromises = campaignIds.map(id => 
                apiService.getCampaignStatus(id).catch(error => {
                    console.error(`Error loading campaign ${id}:`, error);
                    return null;
                })
            );
            const results = await Promise.all(campaignPromises);
            const validCampaigns = results.filter(campaign => campaign !== null) as CampaignSummary[];
            setCampaigns(validCampaigns);
        } catch (error) {
            console.error('Error loading campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'running': return 'primary';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    const getAgentProgress = (agents: Record<string, any>) => {
        if (!agents) return 0;
        const agentList = Object.values(agents);
        const totalProgress = agentList.reduce((sum, agent) => sum + (agent.progress || 0), 0);
        return Math.round(totalProgress / agentList.length);
    };

    const handleViewCampaign = (campaignId: string) => {
        // Store the campaign ID and navigate to NewProduct page
        sessionStorage.setItem('viewCampaignId', campaignId);
        navigate('/new-product');
    };

    const handleRefresh = () => {
        const storedCampaigns = localStorage.getItem('zeroToMarket_campaigns');
        if (storedCampaigns) {
            try {
                const campaignIds = JSON.parse(storedCampaigns);
                loadCampaigns(campaignIds);
            } catch (error) {
                console.error('Error refreshing campaigns:', error);
            }
        }
        checkHealth();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        🚀 Marketing Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitor your AI-powered marketing campaigns
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh data">
                        <IconButton onClick={handleRefresh} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/new-product')}
                        sx={{
                            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(255, 126, 95, 0.3)'
                            }
                        }}
                    >
                        New Campaign
                    </Button>
                </Box>
            </Box>

            {/* System Status */}
            {healthStatus && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 3, borderRadius: 2 }}
                    icon={<AnalyticsIcon />}
                >
                    <Typography variant="body2">
                        AI Agent System Online • {healthStatus.agents} • Backend: {healthStatus.status}
                    </Typography>
                </Alert>
            )}

            {/* Loading Indicator */}
            {loading && (
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Loading campaigns...</Typography>
                    <LinearProgress />
                </Paper>
            )}

            {/* Campaigns Grid */}
            {campaigns.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {campaigns.map((campaign, index) => (
                        <Card 
                            key={campaign.campaign_id}
                            sx={{ 
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 8px 25px rgba(255, 126, 95, 0.15)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                {/* Campaign Header */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight={600} color="primary.dark">
                                        Campaign {index + 1}
                                    </Typography>
                                    <Chip 
                                        label={campaign.status.toUpperCase()} 
                                        color={getStatusColor(campaign.status)}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>

                                {/* Campaign Info */}
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Created: {new Date(campaign.created_at).toLocaleDateString()}
                                </Typography>

                                {/* Progress Bar */}
                                {campaign.status === 'running' && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Progress: {getAgentProgress(campaign.agents)}%
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={getAgentProgress(campaign.agents)}
                                            sx={{ borderRadius: 1 }}
                                        />
                                    </Box>
                                )}

                                {/* Agent Status */}
                                {campaign.agents && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Agents:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {Object.entries(campaign.agents).map(([agentName, agentData]: [string, any]) => (
                                                <Chip
                                                    key={agentName}
                                                    label={`${agentName}: ${agentData.status}`}
                                                    size="small"
                                                    variant="outlined"
                                                    color={agentData.status === 'completed' ? 'success' : 'default'}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Results Summary */}
                                {campaign.status === 'completed' && campaign.results && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Campaign Results:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {campaign.results.strategy && (
                                                <Chip label="Strategy ✓" size="small" color="success" variant="outlined" />
                                            )}
                                            {campaign.results.research && (
                                                <Chip label="Research ✓" size="small" color="success" variant="outlined" />
                                            )}
                                            {campaign.results.content && (
                                                <Chip label="Content ✓" size="small" color="success" variant="outlined" />
                                            )}
                                            {campaign.results.final_campaign && (
                                                <Chip label="Optimized ✓" size="small" color="success" variant="outlined" />
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                {/* Actions */}
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<ViewIcon />}
                                    onClick={() => handleViewCampaign(campaign.campaign_id)}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, rgba(255, 126, 95, 0.1) 0%, rgba(254, 180, 123, 0.1) 100%)'
                                        }
                                    }}
                                >
                                    View Campaign
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                /* Empty State */
                <Paper sx={{ 
                    p: 6, 
                    textAlign: 'center', 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(255, 126, 95, 0.05) 0%, rgba(254, 180, 123, 0.05) 100%)'
                }}>
                    <CampaignIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" fontWeight={600} color="primary.dark" gutterBottom>
                        Welcome to ZeroToMarket
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                        Create your first AI-powered marketing campaign! Our agents will handle strategy, research, content creation, and optimization automatically.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/new-product')}
                        sx={{
                            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(255, 126, 95, 0.3)'
                            }
                        }}
                    >
                        Create Your First Campaign
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default Dashboard; 