import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Button,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Refresh as RefreshIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { mockAgents } from '../types/agent';

const AgentMonitoring: React.FC = () => {
    const [agents, setAgents] = useState(mockAgents);

    const toggleAgentRunning = (agentId: string) => {
        setAgents(agents.map(agent =>
            agent.id === agentId
                ? { ...agent, status: { ...agent.status, isRunning: !agent.status.isRunning, error: undefined } }
                : agent
        ));
    };

    const restartAgent = (agentId: string) => {
        setAgents(agents.map(agent =>
            agent.id === agentId
                ? { ...agent, status: { ...agent.status, isRunning: true, progress: 0, error: undefined } }
                : agent
        ));
    };

    const getAgentStatusColor = (agent: typeof agents[0]) => {
        if (agent.status.error) return 'error';
        if (agent.status.isRunning) return 'success';
        return 'default';
    };

    const getLastUpdatedFormatted = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Agent Monitoring
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={() => console.log('Refresh agents status')}
                >
                    Refresh Status
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {agents.map(agent => (
                    <Box key={agent.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)' } }}>
                        <Card
                            sx={{
                                height: '100%',
                                borderLeft: agent.status.isRunning ? '4px solid #4caf50' : agent.status.error ? '4px solid #f44336' : 'none'
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" component="h2">
                                            {agent.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {agent.description}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={agent.status.isRunning ? 'Running' : agent.status.error ? 'Error' : 'Idle'}
                                        color={getAgentStatusColor(agent)}
                                        size="small"
                                        icon={agent.status.error ? <WarningIcon fontSize="small" /> : undefined}
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
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Current Task:</strong> {agent.status.currentTask}
                                        </Typography>
                                    </Box>
                                )}

                                {agent.status.error && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="error">
                                            <strong>Error:</strong> {agent.status.error}
                                        </Typography>
                                    </Box>
                                )}

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Last Updated:</strong> {getLastUpdatedFormatted(agent.status.lastUpdated)}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Capabilities:
                                    </Typography>
                                    <Box component="ul" sx={{ mt: 0, pl: 2 }}>
                                        {agent.capabilities.map((capability, index) => (
                                            <Typography component="li" variant="body2" key={index}>
                                                {capability}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    {agent.status.error ? (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<RefreshIcon />}
                                            onClick={() => restartAgent(agent.id)}
                                            size="small"
                                        >
                                            Restart
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color={agent.status.isRunning ? "warning" : "success"}
                                            startIcon={agent.status.isRunning ? <PauseIcon /> : <PlayIcon />}
                                            onClick={() => toggleAgentRunning(agent.id)}
                                            size="small"
                                        >
                                            {agent.status.isRunning ? 'Pause' : 'Start'}
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Paper sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Agent System Overview
                </Typography>
                <Typography variant="body2" paragraph>
                    ZeroToMarket employs a system of autonomous agents working together to create and execute your marketing strategy. Each agent specializes in different aspects of the marketing process.
                </Typography>

                <List>
                    <ListItem>
                        <ListItemText
                            primary="StrategistAgent"
                            secondary="Analyzes your product to determine the optimal marketing angles, target audience segments, and brand voice."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="ResearchAgent"
                            secondary="Scans competitor content and marketing strategies to gather insights and inspiration for your marketing campaign."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="CreatorAgent"
                            secondary="Generates platform-specific marketing content based on insights from the Strategist and Research agents."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="PublisherAgent"
                            secondary="Handles the scheduling and publishing of content across various platforms, monitoring performance metrics."
                        />
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default AgentMonitoring; 