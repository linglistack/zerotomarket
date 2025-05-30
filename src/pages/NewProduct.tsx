import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Tab,
    Tabs,
    Card,
    CardContent,
    Container,
    InputAdornment,
    CircularProgress,
    MenuItem
} from '@mui/material';
import {
    ChatBubbleOutline as ChatIcon,
    FormatListBulleted as FormIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Check as CheckIcon,
    Description as DescriptionIcon,
    Public as WebsiteIcon,
    Group as AudienceIcon,
    RocketLaunch as RocketIcon,
    CheckCircle as CheckCircleIcon,
    Rocket as LaunchIcon,
    Business as BusinessIcon,
    TrendingUp as TrendingUpIcon,
    SmartToy as AgentIcon
} from '@mui/icons-material';
import AgentWorkflow from '../components/AgentWorkflow';
import { apiService } from '../services/api';
import { ProductInput, CampaignStatus } from '../types/api';
import CampaignChat from '../components/ProductChat';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`campaign-creation-tabpanel-${index}`}
            aria-labelledby={`campaign-creation-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const steps = ['Campaign Details', 'Target Audience', 'Review & Launch'];

const MarketingCampaign: React.FC = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [product, setProduct] = useState<ProductInput>({
        name: '',
        description: '',
        target_audience: '',
        industry: 'tech'
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        targetCustomer: ''
    });
    const [campaignStatus, setCampaignStatus] = useState<any>(null);
    const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
    const [campaignHistory, setCampaignHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if we're viewing a specific campaign from dashboard
        const viewCampaignId = sessionStorage.getItem('viewCampaignId');
        if (viewCampaignId) {
            sessionStorage.removeItem('viewCampaignId'); // Clean up
            handleCampaignCreated(viewCampaignId);
        }
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

        // Clear error when user types
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateStep = () => {
        const newErrors = {
            name: '',
            description: '',
            targetCustomer: ''
        };
        let isValid = true;

        if (activeStep === 0) {
            if (!product.name.trim()) {
                newErrors.name = 'Campaign name is required';
                isValid = false;
            }
            if (product.description.trim().length < 10) {
                newErrors.description = 'Description should be at least 10 characters';
                isValid = false;
            }
        }

        if (activeStep === 1) {
            if (!product.target_audience.trim()) {
                newErrors.targetCustomer = 'Target audience information is required';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep()) {
            setLoading(true);
            try {
                const response = await apiService.startCampaign(product);
                
                // Start polling for campaign status
                const campaignId = response.campaign_id;
                const campaign = await apiService.getCampaignStatus(campaignId);
                setCampaignStatus(campaign);
                
            } catch (error) {
                console.error('Error creating campaign:', error);
                // Handle error - could show an alert here
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCampaignCreated = (campaignId: string) => {
        console.log('Campaign created from chat:', campaignId);
        setActiveCampaignId(campaignId);
        setCampaignHistory(prev => [...prev, campaignId]);
        
        // Fetch campaign status to trigger AgentWorkflow display
        apiService.getCampaignStatus(campaignId).then(campaign => {
            setCampaignStatus(campaign);
        }).catch(error => {
            console.error('Error fetching campaign status:', error);
        });
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Card variant="outlined" sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{
                            bgcolor: 'primary.light',
                            p: 3,
                            backgroundImage: 'linear-gradient(135deg, rgba(255, 126, 95, 0.2) 0%, rgba(254, 180, 123, 0.2) 100%)'
                        }}>
                            <Typography variant="h6" fontWeight={600} color="primary.dark">
                                Campaign Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Define your marketing campaign name, description, and website.
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Campaign Name"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    margin="normal"
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    placeholder="e.g., TaskFlow Pro Launch Campaign"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Industry"
                                    name="industry"
                                    value={product.industry}
                                    onChange={handleChange}
                                    margin="normal"
                                    select
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                >
                                    <MenuItem value="tech">Technology</MenuItem>
                                    <MenuItem value="saas">SaaS</MenuItem>
                                    <MenuItem value="ecommerce">E-commerce</MenuItem>
                                    <MenuItem value="fintech">Fintech</MenuItem>
                                    <MenuItem value="healthcare">Healthcare</MenuItem>
                                    <MenuItem value="education">Education</MenuItem>
                                </TextField>
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Campaign Description"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.description}
                                helperText={errors.description}
                                placeholder="Describe your product, its key features, and the problem it solves..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Website or Landing Page URL"
                                name="target_audience"
                                value={product.target_audience}
                                onChange={handleChange}
                                margin="normal"
                                placeholder="https://example.com"
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WebsiteIcon color="primary" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </CardContent>
                    </Card>
                );
            case 1:
                return (
                    <>
                        <Box sx={{
                            bgcolor: 'primary.main',
                            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                            borderRadius: 3,
                            p: 3,
                            mb: 4,
                            color: 'white'
                        }}>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                📍 Define Your Target Audience
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Help our AI agents understand who you're trying to reach so they can create targeted messaging.
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 4 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Target Audience"
                                name="target_audience"
                                value={product.target_audience}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.targetCustomer}
                                helperText={errors.targetCustomer || 'Who is your ideal customer? Include demographics, roles, pain points, and behaviors.'}
                                placeholder="e.g., Small business owners (25-45) struggling with project management, remote team leaders, startup founders looking to scale operations..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </CardContent>
                    </>
                );
            case 2:
                return (
                    <>
                        <Box sx={{
                            bgcolor: 'primary.main',
                            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                            borderRadius: 3,
                            p: 3,
                            mb: 4,
                            color: 'white'
                        }}>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                ✅ Review & Launch Campaign
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Review your campaign details before our AI agents create your marketing content.
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                            <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{
                                    bgcolor: 'primary.light',
                                    p: 2,
                                    backgroundImage: 'linear-gradient(135deg, rgba(255, 126, 95, 0.1) 0%, rgba(254, 180, 123, 0.1) 100%)'
                                }}>
                                    <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                                        Campaign Details
                                    </Typography>
                                </Box>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600} color="primary">Campaign Name</Typography>
                                    <Typography paragraph>{product.name}</Typography>

                                    <Typography variant="subtitle1" fontWeight={600} color="primary">Industry</Typography>
                                    <Typography paragraph>{product.industry}</Typography>

                                    <Typography variant="subtitle1" fontWeight={600} color="primary">Description</Typography>
                                    <Typography paragraph>{product.description}</Typography>
                                </CardContent>
                            </Card>

                            <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{
                                    bgcolor: 'secondary.light',
                                    p: 2,
                                    backgroundImage: 'linear-gradient(135deg, rgba(255, 126, 95, 0.1) 0%, rgba(254, 180, 123, 0.1) 100%)'
                                }}>
                                    <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                                        Target Audience
                                    </Typography>
                                </Box>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600} color="primary">Audience Description</Typography>
                                    <Typography paragraph>{product.target_audience}</Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <Alert
                            severity="success"
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                    color: 'success.main'
                                }
                            }}
                        >
                            <Typography variant="body2" fontWeight={600}>
                                Ready to Launch! 🚀
                            </Typography>
                            Our AI agents will create a comprehensive marketing campaign including strategy analysis, competitive research, and platform-specific content.
                        </Alert>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    mb: 4,
                    fontWeight: 600,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Create Marketing Campaign
            </Typography>

            <Paper
                sx={{
                    p: 0,
                    mb: 3,
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(255, 126, 95, 0.1)',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="campaign creation method tabs"
                        sx={{
                            '& .MuiTab-root': {
                                py: 2.5,
                                fontSize: '1rem'
                            },
                            '& .Mui-selected': {
                                fontWeight: 600,
                                color: 'primary.main'
                            },
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px 3px 0 0'
                            }
                        }}
                        centered
                        variant="fullWidth"
                    >
                        <Tab icon={<FormIcon />} label="Step-by-Step" iconPosition="start" />
                        <Tab icon={<ChatIcon />} label="Chat with AI" iconPosition="start" />
                    </Tabs>
                </Box>

                <Box sx={{ p: 4 }}>
                    <TabPanel value={tabValue} index={0}>
                        <Stepper
                            activeStep={activeStep}
                            sx={{
                                mb: 5,
                                '& .MuiStepLabel-label': {
                                    mt: 1,
                                    fontWeight: 500
                                },
                                '& .MuiStepIcon-root': {
                                    fontSize: 30,
                                    color: 'primary.light'
                                },
                                '& .MuiStepIcon-text': {
                                    fill: '#fff'
                                },
                                '& .Mui-active': {
                                    color: 'primary.main !important'
                                },
                                '& .Mui-completed': {
                                    color: 'primary.main !important'
                                }
                            }}
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <form onSubmit={handleSubmit}>
                            {renderStepContent()}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1.2,
                                        opacity: activeStep === 0 ? 0.5 : 1
                                    }}
                                >
                                    Back
                                </Button>

                                <Box>
                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            endIcon={<CheckIcon />}
                                            sx={{
                                                borderRadius: 2,
                                                px: 4,
                                                py: 1.2,
                                                background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    boxShadow: '0 6px 20px rgba(255, 126, 95, 0.3)'
                                                }
                                            }}
                                        >
                                            Launch Campaign
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1.2,
                                                background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 20px rgba(255, 126, 95, 0.3)'
                                                }
                                            }}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </form>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Alert
                            severity="info"
                            sx={{
                                mb: 4,
                                py: 2,
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                    color: 'primary.main'
                                }
                            }}
                        >
                            Describe your marketing goals, product, or paste a URL. Our AI will help you create a comprehensive marketing campaign.
                        </Alert>
                        <CampaignChat onCampaignCreated={handleCampaignCreated} />
                    </TabPanel>
                </Box>
            </Paper>

            {campaignStatus && (
                <Paper sx={{ 
                    mt: 4, 
                    p: 0, 
                    borderRadius: 4, 
                    boxShadow: '0 8px 32px rgba(255, 126, 95, 0.1)',
                    overflow: 'hidden'
                }}>
                    {/* Campaign Header */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                        color: 'white',
                        p: 3
                    }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            🤖 AI Agent Campaign Workflow
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Campaign ID: {campaignStatus.campaign_id}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Status: {campaignStatus.status?.toUpperCase()} • Created: {new Date(campaignStatus.created_at).toLocaleString()}
                        </Typography>
                    </Box>

                    {/* Agent Workflow */}
                    <Box sx={{ p: 4 }}>
                        <AgentWorkflow 
                            campaignId={campaignStatus.campaign_id}
                            onComplete={(completedCampaign) => {
                                console.log('Campaign completed:', completedCampaign);
                                // Update the campaign status
                                setCampaignStatus(completedCampaign);
                            }}
                            onError={(error) => {
                                console.error('Campaign error:', error);
                                // Could show error notification
                            }}
                        />
                    </Box>
                </Paper>
            )}

            {/* Campaign History */}
            {campaignHistory.length > 0 && (
                <Paper sx={{ 
                    mt: 3, 
                    p: 3, 
                    borderRadius: 4, 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}>
                    <Typography variant="h6" fontWeight={600} color="primary.dark" gutterBottom>
                        📋 Campaign History
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        All campaigns created in this session
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {campaignHistory.map((id, index) => (
                            <Button
                                key={id}
                                variant={activeCampaignId === id ? "contained" : "outlined"}
                                size="small"
                                onClick={() => {
                                    setActiveCampaignId(id);
                                    // Fetch and show this campaign
                                    apiService.getCampaignStatus(id).then(campaign => {
                                        setCampaignStatus(campaign);
                                    });
                                }}
                                sx={{
                                    borderRadius: 2,
                                    ...(activeCampaignId === id && {
                                        background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                                    })
                                }}
                            >
                                Campaign {index + 1}
                            </Button>
                        ))}
                    </Box>
                </Paper>
            )}

            {loading && (
                <Box sx={{ mt: 4, p: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(255, 126, 95, 0.1)' }}>
                    <Typography variant="h6" fontWeight={600} color="primary.dark" gutterBottom>
                        Creating Campaign...
                    </Typography>
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
};

export default MarketingCampaign; 