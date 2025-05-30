import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Divider,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem
} from '@mui/material';
import {
    Article as ArticleIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    Facebook as FacebookIcon,
    Email as EmailIcon,
    Reddit as RedditIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';
import { mockCampaigns } from '../mock-data/campaignData';
import { mockProducts } from '../mock-data/productData';

const ContentLibrary: React.FC = () => {
    const { productId } = useParams<{ productId?: string }>();
    const [selectedProduct, setSelectedProduct] = useState<string | undefined>(productId);
    const [filteredCampaigns, setFilteredCampaigns] = useState(mockCampaigns);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [platformFilter, setPlatformFilter] = useState<string>('all');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        let filtered = mockCampaigns;

        if (selectedProduct) {
            filtered = filtered.filter(campaign => campaign.productId === selectedProduct);
        }

        if (searchTerm) {
            filtered = filtered.filter(campaign =>
                campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(campaign => campaign.status === statusFilter);
        }

        if (platformFilter !== 'all') {
            filtered = filtered.filter(campaign => campaign.platform === platformFilter);
        }

        setFilteredCampaigns(filtered);
    }, [selectedProduct, searchTerm, statusFilter, platformFilter]);

    const handleProductChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        setSelectedProduct(value === 'all' ? undefined : value);
    };

    const handleStatusFilterChange = (event: SelectChangeEvent) => {
        setStatusFilter(event.target.value);
    };

    const handlePlatformFilterChange = (event: SelectChangeEvent) => {
        setPlatformFilter(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // In a real app, you would show a notification
        console.log('Copied to clipboard');
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'twitter':
                return <TwitterIcon />;
            case 'linkedin':
                return <LinkedInIcon />;
            case 'facebook':
                return <FacebookIcon />;
            case 'email':
                return <EmailIcon />;
            case 'reddit':
                return <RedditIcon />;
            default:
                return null;
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'twitter':
                return '#1DA1F2';
            case 'linkedin':
                return '#0A66C2';
            case 'facebook':
                return '#4267B2';
            case 'email':
                return '#EA4335';
            case 'reddit':
                return '#FF4500';
            default:
                return '#757575';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'success';
            case 'scheduled':
                return 'warning';
            case 'draft':
                return 'default';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Content Library
                </Typography>
                <Button variant="contained" color="primary">
                    Create New Content
                </Button>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Search content..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ flexGrow: 1, minWidth: '200px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="product-filter-label">Product</InputLabel>
                    <Select
                        labelId="product-filter-label"
                        id="product-filter"
                        value={selectedProduct || 'all'}
                        label="Product"
                        onChange={handleProductChange}
                    >
                        <MenuItem value="all">All Products</MenuItem>
                        {mockProducts.map(product => (
                            <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={statusFilter}
                        label="Status"
                        onChange={handleStatusFilterChange}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="scheduled">Scheduled</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="platform-filter-label">Platform</InputLabel>
                    <Select
                        labelId="platform-filter-label"
                        id="platform-filter"
                        value={platformFilter}
                        label="Platform"
                        onChange={handlePlatformFilterChange}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="twitter">Twitter</MenuItem>
                        <MenuItem value="linkedin">LinkedIn</MenuItem>
                        <MenuItem value="facebook">Facebook</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="reddit">Reddit</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                {filteredCampaigns.map(campaign => (
                    <Card key={campaign.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                height: 6,
                                backgroundColor: getPlatformColor(campaign.platform),
                            }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" component="h2">
                                    {campaign.name}
                                </Typography>
                                <IconButton size="small" sx={{ color: getPlatformColor(campaign.platform) }}>
                                    {getPlatformIcon(campaign.platform)}
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
                                <Chip
                                    label={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                    color={getStatusColor(campaign.status) as any}
                                    size="small"
                                />
                                <Chip
                                    label={campaign.platform.charAt(0).toUpperCase() + campaign.platform.slice(1)}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {campaign.status === 'published' ? (
                                    <>Published: {formatDate(campaign.publishedDate)}</>
                                ) : campaign.status === 'scheduled' ? (
                                    <>Scheduled: {formatDate(campaign.scheduledDate)}</>
                                ) : (
                                    <>Draft</>
                                )}
                            </Typography>

                            <Divider sx={{ my: 1.5 }} />

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 2,
                                    height: '100px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {campaign.content}
                            </Typography>

                            {campaign.engagementMetrics && (
                                <Box sx={{ mt: 'auto' }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Engagement:
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption">
                                            👁️ {campaign.engagementMetrics.impressions}
                                        </Typography>
                                        <Typography variant="caption">
                                            👍 {campaign.engagementMetrics.likes}
                                        </Typography>
                                        <Typography variant="caption">
                                            🔄 {campaign.engagementMetrics.shares}
                                        </Typography>
                                        <Typography variant="caption">
                                            💬 {campaign.engagementMetrics.comments}
                                        </Typography>
                                        <Typography variant="caption">
                                            🔗 {campaign.engagementMetrics.clicks}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                        <CardActions>
                            <IconButton size="small" onClick={() => copyToClipboard(campaign.content)}>
                                <CopyIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <ShareIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {filteredCampaigns.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No content matches your filters.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters to see more results.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ContentLibrary; 