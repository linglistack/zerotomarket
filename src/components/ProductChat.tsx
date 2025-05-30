import React, { useState, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Avatar,
    List,
    ListItem,
    Divider,
    IconButton,
    Card,
    CardContent,
    Tab,
    Tabs,
    InputAdornment,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    Link as LinkIcon,
    InsertPhoto as PhotoIcon,
    VideoLibrary as VideoIcon,
    SmartToy as BotIcon,
    Launch as LaunchIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { ProductInput } from '../types/api';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    attachments?: {
        type: 'image' | 'video' | 'link';
        url: string;
        preview?: string;
    }[];
    isTyping?: boolean;
    campaignId?: string;
    showCampaignButton?: boolean;
}

interface CampaignChatProps {
    onCampaignCreated?: (campaignId: string) => void;
}

const CampaignChat: React.FC<CampaignChatProps> = ({ onCampaignCreated }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hello! I can help you create a marketing campaign. You can paste a website URL, upload images/videos, or describe your goals, product, or target audience. Our AI agents will analyze your input and create personalized marketing strategies.',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
    const [tabValue, setTabValue] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [createdCampaigns, setCreatedCampaigns] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' && !uploadPreview) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: 'user',
            timestamp: new Date(),
            attachments: uploadPreview
                ? [{
                    type: inputMode === 'url' ? 'link' : 'image',
                    url: uploadPreview,
                    preview: uploadPreview
                }]
                : undefined
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setUploadPreview(null);
        setIsProcessing(true);

        // Add typing indicator
        const typingMessage: Message = {
            id: 'typing-' + Date.now(),
            content: 'AI agents are analyzing your input and creating your campaign...',
            sender: 'ai',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            const aiResponse = await generateAIResponse(newMessage);
            
            // Remove typing indicator and add real response
            setMessages(prev => prev.filter(m => !m.isTyping).concat(aiResponse));
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages(prev => prev.filter(m => !m.isTyping).concat({
                id: Date.now().toString(),
                content: 'I apologize, but I encountered an error processing your request. Please try again or check that the backend services are running.',
                sender: 'ai',
                timestamp: new Date()
            }));
        } finally {
            setIsProcessing(false);
        }
    };

    const generateAIResponse = async (userMessage: Message): Promise<Message> => {
        try {
            // Determine the input type and content
            let analysisInput = userMessage.content;
            const hasUrlAttachment = userMessage.attachments?.some(a => a.type === 'link');
            
            if (hasUrlAttachment) {
                const urlAttachment = userMessage.attachments?.find(a => a.type === 'link');
                analysisInput = urlAttachment?.url || userMessage.content;
            }

            // Create a campaign to get AI analysis
            const productInput: ProductInput = {
                name: hasUrlAttachment ? 'Website Analysis Campaign' : 'Chat Campaign',
                description: analysisInput,
                target_audience: 'General audience',
                industry: 'tech'
            };

            // Start a campaign
            const campaignResponse = await apiService.startCampaign(productInput);
            const campaignId = campaignResponse.campaign_id;

            // Track created campaign
            setCreatedCampaigns(prev => [...prev, campaignId]);
            
            // Save to localStorage for dashboard persistence
            const existingCampaigns = localStorage.getItem('zeroToMarket_campaigns');
            let campaignIds: string[] = [];
            if (existingCampaigns) {
                try {
                    campaignIds = JSON.parse(existingCampaigns);
                } catch (error) {
                    console.error('Error parsing stored campaigns:', error);
                }
            }
            campaignIds.push(campaignId);
            localStorage.setItem('zeroToMarket_campaigns', JSON.stringify(campaignIds));
            
            if (onCampaignCreated) {
                onCampaignCreated(campaignId);
            }

            // Poll for initial results to show quick preview
            let attempts = 0;
            const maxAttempts = 8;
            
            while (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const campaign = await apiService.getCampaignStatus(campaignId);
                
                if (campaign.results?.strategy) {
                    const strategy = campaign.results.strategy;
                    
                    let response = '';
                    
                    if (hasUrlAttachment) {
                        response = `🌐 **Campaign Created Successfully!**\n\n`;
                        if (analysisInput.toLowerCase().includes('tesla')) {
                            response += `I've created a comprehensive Tesla marketing campaign with:\n\n`;
                        } else {
                            response += `I've created a marketing campaign for your website with:\n\n`;
                        }
                    } else {
                        response = `🚀 **Marketing Campaign Ready!**\n\n`;
                        response += `I've created a complete marketing campaign with:\n\n`;
                    }

                    // Add key insights preview
                    if (strategy.value_proposition) {
                        response += `**Value Proposition:** ${strategy.value_proposition}\n\n`;
                    }

                    if (strategy.messaging_themes && Array.isArray(strategy.messaging_themes)) {
                        response += `**Key Messaging Themes:**\n`;
                        strategy.messaging_themes.slice(0, 3).forEach((theme: string, index: number) => {
                            response += `${index + 1}. ${theme}\n`;
                        });
                        response += '\n';
                    }

                    response += `✅ **Campaign includes:**\n• Strategic positioning analysis\n• Competitive research insights\n• Platform-specific content (Twitter, LinkedIn, Email, Blog)\n• Publishing timeline and optimization tips\n\n`;
                    response += `**Your campaign is processing in the background and will be fully ready soon!**`;

                    return {
                        id: Date.now().toString(),
                        content: response,
                        sender: 'ai',
                        timestamp: new Date(),
                        campaignId: campaignId,
                        showCampaignButton: true
                    };
                }
                
                attempts++;
            }

            // Return campaign created message even if no quick results
            return {
                id: Date.now().toString(),
                content: `🚀 **Campaign Created Successfully!**\n\nI've started creating your comprehensive marketing campaign. This includes:\n\n• Strategic positioning analysis with Clarifai AI\n• Competitive intelligence gathering with Apify\n• Platform-specific content generation\n• Campaign optimization recommendations\n\n**Your campaign is processing and will be ready shortly!**`,
                sender: 'ai',
                timestamp: new Date(),
                campaignId: campaignId,
                showCampaignButton: true
            };

        } catch (error) {
            console.error('Error in generateAIResponse:', error);
            
            // Provide helpful fallback
            if (userMessage.attachments?.some(a => a.type === 'link')) {
                const url = userMessage.attachments?.find(a => a.type === 'link')?.url;
                if (url?.toLowerCase().includes('tesla')) {
                    return {
                        id: Date.now().toString(),
                        content: `🚗 **Tesla Analysis Request Received**\n\nI'm ready to create a comprehensive Tesla marketing campaign! Our AI agents will provide:\n\n• Electric vehicle market analysis\n• Sustainability messaging strategies\n• Tech innovation positioning\n• Competitive EV landscape insights\n\nLet me start creating your Tesla campaign now! This may take a few moments as our agents gather intelligence.`,
                        sender: 'ai',
                        timestamp: new Date()
                    };
                }
            }
            
            return {
                id: Date.now().toString(),
                content: `💬 **Ready to Create Your Campaign!**\n\nI can build a comprehensive marketing campaign using our AI agent system. Just provide:\n\n• Your product or service details\n• Target audience information\n• Marketing goals\n• Website URL (optional)\n\nOur agents will handle strategy, research, content creation, and optimization automatically!`,
                sender: 'ai',
                timestamp: new Date()
            };
        }
    };

    const handleViewCampaign = (campaignId: string) => {
        if (onCampaignCreated) {
            onCampaignCreated(campaignId);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setInputMode(newValue === 0 ? 'text' : 'url');
        setInputValue('');
        setUploadPreview(null);
    };

    const handleAttachmentClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadPreview(e.target?.result as string);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Campaign Status Alert */}
            {createdCampaigns.length > 0 && (
                <Alert 
                    severity="success" 
                    sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        '& .MuiAlert-message': { width: '100%' }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2">
                            {createdCampaigns.length} campaign{createdCampaigns.length > 1 ? 's' : ''} created and processing
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {createdCampaigns.slice(-3).map((campaignId, index) => (
                                <Chip
                                    key={campaignId}
                                    label={`Campaign ${index + 1}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    icon={<ViewIcon />}
                                    onClick={() => handleViewCampaign(campaignId)}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Alert>
            )}

            <Paper sx={{
                flex: 1,
                mb: 2,
                p: 2,
                overflow: 'auto',
                maxHeight: '60vh',
                bgcolor: 'background.default',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
            }}>
                <List>
                    {messages.map((message, index) => (
                        <React.Fragment key={message.id}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                                    mb: 2,
                                    px: 1,
                                    animation: 'fadeIn 0.3s ease forwards',
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: 0
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                                        ml: message.sender === 'user' ? 2 : 0,
                                        mr: message.sender === 'ai' ? 2 : 0,
                                        width: 40,
                                        height: 40,
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    {message.sender === 'user' ? 'U' : <BotIcon />}
                                </Avatar>
                                <Box
                                    sx={{
                                        maxWidth: '80%',
                                        bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                                        borderRadius: message.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                        p: 2,
                                        boxShadow: message.sender === 'user'
                                            ? '0 4px 12px rgba(255, 126, 95, 0.2)'
                                            : '0 4px 12px rgba(0, 0, 0, 0.05)',
                                        color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                                        position: 'relative',
                                        '&::after': message.sender === 'user' ? {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            right: '-8px',
                                            width: 20,
                                            height: 20,
                                            backgroundColor: 'primary.light',
                                            borderBottomLeftRadius: 16,
                                            zIndex: -1
                                        } : message.sender === 'ai' ? {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '-8px',
                                            width: 20,
                                            height: 20,
                                            backgroundColor: 'background.paper',
                                            borderBottomRightRadius: 16,
                                            zIndex: -1
                                        } : {}
                                    }}
                                >
                                    {message.isTyping ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={16} />
                                    <Typography variant="body1">
                                        {message.content}
                                    </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    whiteSpace: 'pre-wrap',
                                                    '& strong': { fontWeight: 600 },
                                                    '& **': { fontWeight: 600 }
                                                }}
                                            >
                                                {message.content.split('**').map((part, i) => 
                                                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                                                )}
                                            </Typography>

                                            {/* Campaign Action Buttons */}
                                            {message.showCampaignButton && message.campaignId && (
                                                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<ViewIcon />}
                                                        onClick={() => handleViewCampaign(message.campaignId!)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                boxShadow: '0 4px 14px rgba(255, 126, 95, 0.3)'
                                                            }
                                                        }}
                                                    >
                                                        View Full Campaign
                                                    </Button>
                                                    <Chip
                                                        label="Campaign Created"
                                                        color="success"
                                                        size="small"
                                                        icon={<LaunchIcon />}
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </Box>
                                            )}
                                        </>
                                    )}

                                    {message.attachments && message.attachments.map((attachment, i) => (
                                        <Box key={i} sx={{ mt: 2 }}>
                                            {attachment.type === 'image' && (
                                                <Box
                                                    component="img"
                                                    src={attachment.url}
                                                    alt="Uploaded content"
                                                    sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 1 }}
                                                />
                                            )}
                                            {attachment.type === 'video' && (
                                                <Box
                                                    component="video"
                                                    controls
                                                    sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 1 }}
                                                >
                                                    <source src={attachment.url} />
                                                </Box>
                                            )}
                                            {attachment.type === 'link' && (
                                                <Card variant="outlined" sx={{ mt: 1 }}>
                                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                                        <Typography variant="body2">
                                                            <LinkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                                            {attachment.url}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Box>
                                    ))}

                                    <Typography variant="caption" color={message.sender === 'user' ? 'primary.contrastText' : 'text.secondary'} sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            </ListItem>
                            {index < messages.length - 1 && <Divider variant="middle" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            {uploadPreview && (
                <Paper sx={{ p: 1, mb: 2, display: 'flex', alignItems: 'center', borderRadius: 3, bgcolor: 'background.paper' }}>
                    {inputMode === 'text' ? (
                        <Box
                            component="img"
                            src={uploadPreview}
                            alt="Upload preview"
                            sx={{ height: 50, width: 'auto', mr: 1, borderRadius: 1 }}
                        />
                    ) : (
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinkIcon sx={{ mr: 0.5 }} fontSize="small" />
                            {uploadPreview}
                        </Typography>
                    )}
                    <Button
                        size="small"
                        color="error"
                        onClick={() => setUploadPreview(null)}
                    >
                        Remove
                    </Button>
                </Paper>
            )}

            <Paper sx={{ p: 1, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="input mode tabs">
                    <Tab
                        icon={<PhotoIcon />}
                        label="Upload & Describe"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<LinkIcon />}
                        label="Website URL"
                        iconPosition="start"
                    />
                </Tabs>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-end' }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={inputMode === 'text'
                            ? "Describe your campaign goals, product, or target audience..."
                            : "Paste your website or landing page URL..."}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'background.default',
                                '&.Mui-focused': {
                                    boxShadow: '0 0 0 3px rgba(255, 126, 95, 0.2)'
                                }
                            }
                        }}
                        InputProps={{
                            startAdornment: inputMode === 'url' ? (
                                <InputAdornment position="start">
                                    <LinkIcon color="action" />
                                </InputAdornment>
                            ) : undefined
                        }}
                    />

                    {inputMode === 'text' && (
                        <>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleAttachmentClick}
                                sx={{ ml: 1 }}
                                disabled={isUploading}
                            >
                                <AttachFileIcon />
                            </IconButton>
                        </>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        onClick={handleSendMessage}
                        disabled={isUploading || isProcessing || (inputValue.trim() === '' && !uploadPreview)}
                        sx={{
                            ml: 1,
                            height: 56,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                            px: 3,
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #E56548 0%, #FFA987 100%)',
                                boxShadow: '0 4px 14px rgba(255, 126, 95, 0.3)'
                            },
                            '&:disabled': {
                                background: 'rgba(0, 0, 0, 0.12)',
                                color: 'rgba(0, 0, 0, 0.26)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isProcessing ? 'Processing...' : 'Send'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CampaignChat; 