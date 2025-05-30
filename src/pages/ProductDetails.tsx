import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Tabs,
    Tab,
    Paper,
    Button,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Alert
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Assignment as AssignmentIcon,
    TrendingUp as InsightsIcon,
    Campaign as CampaignIcon
} from '@mui/icons-material';
import { mockProducts } from '../mock-data/productData';
import { mockCampaigns } from '../mock-data/campaignData';
import { mockCompetitorInsights } from '../mock-data/competitorData';
import { mockAgents } from '../types/agent';
import ProductChat from '../components/ProductChat';

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
            id={`product-tabpanel-${index}`}
            aria-labelledby={`product-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `product-tab-${index}`,
        'aria-controls': `product-tabpanel-${index}`,
    };
}

const ProductDetails: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [product, setProduct] = useState<typeof mockProducts[0] | undefined>();
    const [productCampaigns, setProductCampaigns] = useState<typeof mockCampaigns>([]);
    const [productInsights, setProductInsights] = useState<typeof mockCompetitorInsights>([]);

    useEffect(() => {
        // In a real app, this would be an API call
        const foundProduct = mockProducts.find(p => p.id === productId);
        if (!foundProduct) {
            // Product not found, redirect to dashboard
            navigate('/');
            return;
        }

        setProduct(foundProduct);
        setProductCampaigns(mockCampaigns.filter(campaign => campaign.productId === productId));
        setProductInsights(mockCompetitorInsights.filter(insight => insight.productId === productId));
    }, [productId, navigate]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!product) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography>Loading product details...</Typography>
            </Box>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'analyzing':
                return 'primary';
            case 'researching':
                return 'secondary';
            case 'creating':
                return 'info';
            case 'publishing':
                return 'warning';
            case 'completed':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1">
                        {product.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Created on {formatDate(product.createdAt)}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip
                            label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            color={getStatusColor(product.status) as any}
                            sx={{ mr: 2 }}
                        />
                        <Typography variant="body2">
                            <strong>Progress:</strong> {product.progress}%
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={product.progress}
                        sx={{ height: 8, borderRadius: 5, mb: 3 }}
                    />

                    <Typography variant="body1" gutterBottom>
                        <strong>Description:</strong>
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Target Customer:</strong>
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.targetCustomer}
                    </Typography>

                    {product.website && (
                        <>
                            <Typography variant="body1" gutterBottom>
                                <strong>Website:</strong>
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <a href={product.website} target="_blank" rel="noopener noreferrer">
                                    {product.website}
                                </a>
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>

            <Paper sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
                        <Tab label="Product Chat" icon={<AssignmentIcon />} iconPosition="start" {...a11yProps(0)} />
                        <Tab label="Competitor Insights" icon={<InsightsIcon />} iconPosition="start" {...a11yProps(1)} />
                        <Tab label="Content" icon={<CampaignIcon />} iconPosition="start" {...a11yProps(2)} />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h6" gutterBottom>
                        Product Chat
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Chat with our AI to generate marketing content based on your product information.
                    </Typography>

                    <ProductChat />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {productInsights.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {productInsights.map((insight) => (
                                <Box key={insight.id} sx={{ width: { xs: '100%', md: 'calc(50% - 16px)' } }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {insight.competitorName}
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                <strong>Key Insight:</strong> {insight.keyInsight}
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                <strong>Recommended Action:</strong> {insight.recommendedAction}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Chip label={`Source: ${insight.source}`} size="small" variant="outlined" />
                                                <Chip
                                                    label={`Confidence: ${Math.round(insight.confidence * 100)}%`}
                                                    color={insight.confidence > 0.8 ? "success" : "primary"}
                                                    size="small"
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No competitor insights available yet.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Our AI agents are still researching competitors for this product.
                            </Typography>
                            <Button
                                variant="contained"
                                component={Link}
                                to={`/insights/${productId}`}
                            >
                                View All Insights
                            </Button>
                        </Box>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    {productCampaigns.length > 0 ? (
                        <List>
                            {productCampaigns.map((campaign) => (
                                <ListItem key={campaign.id}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="subtitle1">{campaign.name}</Typography>
                                                <Chip
                                                    label={campaign.platform.charAt(0).toUpperCase() + campaign.platform.slice(1)}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                                <Chip
                                                    label={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                    color={campaign.status === 'published' ? 'success' : campaign.status === 'scheduled' ? 'warning' : 'default'}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {campaign.content.substring(0, 100)}...
                                                </Typography>
                                                {campaign.status === 'published' && campaign.publishedDate && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                        Published on {formatDate(campaign.publishedDate)}
                                                    </Typography>
                                                )}
                                                {campaign.status === 'scheduled' && campaign.scheduledDate && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                        Scheduled for {formatDate(campaign.scheduledDate)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                    <IconButton edge="end" aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No content has been created yet.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Our AI agents will start generating content once the research phase is complete.
                            </Typography>
                            <Button
                                variant="contained"
                                component={Link}
                                to={`/content/${productId}`}
                            >
                                View Content Library
                            </Button>
                        </Box>
                    )}
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default ProductDetails; 