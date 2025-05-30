import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Tabs,
    Tab,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Button
} from '@mui/material';
import {
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    Reddit as RedditIcon,
    Language as WebsiteIcon,
    Lightbulb as InsightIcon,
    ArrowUpward as TrendingUpIcon
} from '@mui/icons-material';
import { mockCompetitorPosts, mockCompetitorInsights } from '../mock-data/competitorData';
import { mockProducts } from '../mock-data/productData';

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
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const CompetitorInsights: React.FC = () => {
    const { productId } = useParams<{ productId?: string }>();
    const [tabValue, setTabValue] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<string | undefined>(productId);
    const [insights, setInsights] = useState(mockCompetitorInsights);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [selectedPlatform, setSelectedPlatform] = useState('All');

    useEffect(() => {
        if (selectedProduct) {
            setInsights(mockCompetitorInsights.filter(insight => insight.productId === selectedProduct));
        } else {
            setInsights(mockCompetitorInsights);
        }
        setLoading(false);
    }, [selectedProduct]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleProductChange = (productId: string | undefined) => {
        setSelectedProduct(productId);
    };

    const getIconForSource = (source: string) => {
        switch (source) {
            case 'twitter':
                return <TwitterIcon />;
            case 'linkedin':
                return <LinkedInIcon />;
            case 'reddit':
                return <RedditIcon />;
            case 'website':
            case 'producthunt':
            default:
                return <WebsiteIcon />;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const displayedInsights = insights.filter(insight => {
        const matchesSearch = insight.competitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             insight.keyInsight.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = selectedIndustry === 'All' || insight.source === selectedIndustry.toLowerCase();
        const matchesPlatform = selectedPlatform === 'All' || insight.source === selectedPlatform.toLowerCase();
        
        return matchesSearch && matchesIndustry && matchesPlatform;
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Competitor Insights
                </Typography>
                <Box>
                    <Button
                        variant={selectedProduct ? "outlined" : "contained"}
                        onClick={() => handleProductChange(undefined)}
                        sx={{ mr: 1 }}
                    >
                        All Products
                    </Button>
                    {mockProducts.map(product => (
                        <Button
                            key={product.id}
                            variant={selectedProduct === product.id ? "contained" : "outlined"}
                            onClick={() => handleProductChange(product.id)}
                            sx={{ mr: 1 }}
                        >
                            {product.name}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="competitor insights tabs">
                        <Tab label="Key Insights" {...a11yProps(0)} />
                        <Tab label="Competitor Content" {...a11yProps(1)} />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {displayedInsights.map((insight) => (
                            <Box key={insight.id} sx={{ width: { xs: '100%', md: 'calc(50% - 16px)' } }}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                <InsightIcon />
                                            </Avatar>
                                            <Typography variant="h6">
                                                {insight.competitorName}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body1" paragraph>
                                            <strong>Key Insight:</strong> {insight.keyInsight}
                                        </Typography>

                                        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 2 }}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                                                <strong>Recommended Action:</strong>
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {insight.recommendedAction}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Chip
                                                label={`Source: ${insight.source}`}
                                                size="small"
                                                variant="outlined"
                                            />
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
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {mockCompetitorPosts.map((post, index) => (
                            <React.Fragment key={post.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: post.source === 'twitter' ? '#1DA1F2' : post.source === 'linkedin' ? '#0A66C2' : post.source === 'reddit' ? '#FF4500' : 'gray' }}>
                                            {getIconForSource(post.source)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle1">
                                                    {post.competitorName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(post.date)}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{ display: 'block', my: 1 }}
                                                >
                                                    {post.content}
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                    <Chip
                                                        label={`Engagement: ${post.engagementScore}/100`}
                                                        size="small"
                                                        color={post.engagementScore > 85 ? "success" : "primary"}
                                                    />
                                                    {post.tags.map((tag, i) => (
                                                        <Chip key={i} label={tag} size="small" variant="outlined" />
                                                    ))}
                                                </Box>
                                                <Box sx={{ mt: 1 }}>
                                                    <Button size="small" href={post.url} target="_blank" rel="noopener noreferrer">
                                                        View Original
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < mockCompetitorPosts.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default CompetitorInsights; 