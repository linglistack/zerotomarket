import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    LinearProgress,
    Chip,
    Alert,
    Divider,
    Tab,
    Tabs,
    Grid
} from '@mui/material';
import {
    Campaign as CampaignIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { mockProducts } from '../mock-data/productData';
import { mockAgents } from '../types/agent';

const statusColors = {
    analyzing: 'primary',
    researching: 'secondary',
    creating: 'info',
    publishing: 'warning',
    completed: 'success'
};

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
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
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

const Dashboard: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [agents, setAgents] = useState(mockAgents);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const toggleAgentRunning = (agentId: string) => {
        setAgents(agents.map(agent =>
            agent.id === agentId
                ? { ...agent, status: { ...agent.status, isRunning: !agent.status.isRunning, error: undefined } }
                : agent
        ));
    };

    const getAgentStatusColor = (agent: typeof agents[0]) => {
        if (agent.status.error) return 'error';
        if (agent.status.isRunning) return 'success';
        return 'default';
    };

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                New! You can now chat with our AI to analyze your product and generate marketing content. Try it in any product's details page.
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 600
                    }}
                >
                    ZeroToMarket Dashboard
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/products/new"
                    startIcon={<CampaignIcon />}
                    sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                        px: 3
                    }}
                >
                    New Marketing Campaign
                </Button>
            </Box>

            <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="dashboard tabs"
                        sx={{
                            '& .MuiTab-root': { py: 2 },
                            '& .Mui-selected': { fontWeight: 600 },
                            px: 2
                        }}
                    >
                        <Tab label="Campaigns" />
                        <Tab label="AI Agents" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, p: 2 }}>
                        {mockProducts.map((product) => (
                            <Box key={product.id} sx={{ width: { xs: '100%', md: 'calc(50% - 24px)', lg: 'calc(33.333% - 24px)' } }}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 6px 20px rgba(255, 126, 95, 0.08)'
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h6" component="h2">
                                                {product.name}
                                            </Typography>
                                            <Chip
                                                label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                                color={statusColors[product.status] as any}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {product.description.length > 120
                                                ? `${product.description.substring(0, 120)}...`
                                                : product.description}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>Target:</strong> {product.targetCustomer.length > 60
                                                ? `${product.targetCustomer.substring(0, 60)}...`
                                                : product.targetCustomer}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <span>Progress:</span>
                                                <span>{product.progress}%</span>
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={product.progress}
                                                sx={{ height: 8, borderRadius: 5 }}
                                            />
                                        </Box>
                                    </CardContent>
                                    <Divider />
                                    <CardActions sx={{ px: 2, py: 1.5 }}>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to={`/products/${product.id}`}
                                            sx={{ borderRadius: 1.5 }}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to={`/content`}
                                            sx={{ borderRadius: 1.5 }}
                                        >
                                            Content
                                        </Button>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to={`/competitors`}
                                            sx={{ borderRadius: 1.5 }}
                                        >
                                            Insights
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" component="h2">
                                AI Agent Status
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={() => console.log('Refresh agents status')}
                                size="small"
                                sx={{ borderRadius: 2 }}
                            >
                                Refresh Status
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {agents.map(agent => (
                                <Box key={agent.id} sx={{ width: { xs: '100%', md: 'calc(50% - 16px)' } }}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 2,
                                            borderLeft: agent.status.isRunning ? '4px solid #4caf50' : agent.status.error ? '4px solid #f44336' : 'none',
                                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={600} component="h3">
                                                        {agent.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {agent.description.length > 100
                                                            ? `${agent.description.substring(0, 100)}...`
                                                            : agent.description}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={agent.status.isRunning ? 'Running' : agent.status.error ? 'Error' : 'Idle'}
                                                    color={getAgentStatusColor(agent)}
                                                    size="small"
                                                />
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <span>Progress:</span>
                                                    <span>{agent.status.progress}%</span>
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={agent.status.progress}
                                                    color={agent.status.error ? 'error' : 'primary'}
                                                    sx={{ height: 8, borderRadius: 5 }}
                                                />
                                            </Box>

                                            {agent.status.currentTask && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    <strong>Current Task:</strong> {agent.status.currentTask}
                                                </Typography>
                                            )}

                                            {agent.status.error && (
                                                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                                                    <strong>Error:</strong> {agent.status.error}
                                                </Typography>
                                            )}

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color={agent.status.isRunning ? "warning" : "success"}
                                                    onClick={() => toggleAgentRunning(agent.id)}
                                                    size="small"
                                                    sx={{ borderRadius: 2, px: 2 }}
                                                >
                                                    {agent.status.isRunning ? 'Pause' : 'Start'}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </TabPanel>
            </Card>
        </Box>
    );
};

export default Dashboard; 