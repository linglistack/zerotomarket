import React, { useState } from 'react';
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
    InputAdornment
} from '@mui/material';
import {
    ChatBubbleOutline as ChatIcon,
    FormatListBulleted as FormIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Check as CheckIcon,
    Description as DescriptionIcon,
    Public as WebsiteIcon,
    Group as AudienceIcon
} from '@mui/icons-material';
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
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        targetCustomer: '',
        website: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        targetCustomer: ''
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateStep = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (activeStep === 0) {
            if (!formData.name.trim()) {
                newErrors.name = 'Campaign name is required';
                isValid = false;
            }
            if (formData.description.trim().length < 10) {
                newErrors.description = 'Description should be at least 10 characters';
                isValid = false;
            }
        }

        if (activeStep === 1) {
            if (!formData.targetCustomer.trim()) {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Submitting campaign:', formData);

        // Redirect to dashboard with success message
        navigate('/', { state: { success: true, message: `Campaign "${formData.name}" has been created and analysis has started.` } });
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
                            <TextField
                                fullWidth
                                label="Campaign Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.name}
                                helperText={errors.name || "A clear, concise name for your marketing campaign"}
                                required
                                sx={{ mb: 4 }}
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon color="primary" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Campaign Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description || 'Describe the goals and key messages of your campaign'}
                                required
                                sx={{ mb: 4 }}
                                InputProps={{
                                    sx: { borderRadius: 2 }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Website or Landing Page URL"
                                name="website"
                                value={formData.website}
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
                    <Card variant="outlined" sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{
                            bgcolor: 'primary.light',
                            p: 3,
                            backgroundImage: 'linear-gradient(135deg, rgba(255, 126, 95, 0.2) 0%, rgba(254, 180, 123, 0.2) 100%)'
                        }}>
                            <Typography variant="h6" fontWeight={600} color="primary.dark">
                                Target Audience
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Define who your campaign is targeting to ensure content relevance.
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 4 }}>
                            <TextField
                                fullWidth
                                label="Target Audience"
                                name="targetCustomer"
                                value={formData.targetCustomer}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rows={4}
                                error={!!errors.targetCustomer}
                                helperText={errors.targetCustomer || 'Describe your ideal customer demographics, interests, and pain points'}
                                required
                                sx={{ mb: 4 }}
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AudienceIcon color="primary" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Alert
                                severity="info"
                                sx={{
                                    mt: 2,
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                The more specific you are about your target audience, the better our AI can tailor marketing content to resonate with them.
                            </Alert>
                        </CardContent>
                    </Card>
                );
            case 2:
                return (
                    <Card variant="outlined" sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{
                            bgcolor: 'primary.light',
                            p: 3,
                            backgroundImage: 'linear-gradient(135deg, rgba(255, 126, 95, 0.2) 0%, rgba(254, 180, 123, 0.2) 100%)'
                        }}>
                            <Typography variant="h6" fontWeight={600} color="primary.dark">
                                Review & Launch Campaign
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Review your campaign details before launching.
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ mt: 2, mb: 4 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                                        <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, bgcolor: 'background.default' }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight={600} color="primary">Campaign Name</Typography>
                                                <Typography paragraph>{formData.name}</Typography>

                                                <Typography variant="subtitle1" fontWeight={600} color="primary">Website</Typography>
                                                <Typography paragraph>{formData.website || 'None provided'}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                                        <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, bgcolor: 'background.default' }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight={600} color="primary">Target Audience</Typography>
                                                <Typography paragraph>{formData.targetCustomer}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                    <Box sx={{ width: '100%', mt: { xs: 0, md: 2 } }}>
                                        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'background.default' }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight={600} color="primary">Campaign Description</Typography>
                                                <Typography paragraph>{formData.description}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>
                            </Box>
                            <Alert
                                severity="info"
                                sx={{
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                Once launched, our AI agents will analyze your campaign details, research competitors, and begin crafting a targeted marketing strategy.
                            </Alert>
                        </CardContent>
                    </Card>
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
                        <CampaignChat />
                    </TabPanel>
                </Box>
            </Paper>
        </Container>
    );
};

export default MarketingCampaign; 