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
    InputAdornment
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    Link as LinkIcon,
    InsertPhoto as PhotoIcon,
    VideoLibrary as VideoIcon,
    SmartToy as BotIcon
} from '@mui/icons-material';

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
}

const CampaignChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hello! I can help you create a marketing campaign. You can paste a website URL, upload images/videos, or describe your goals, product, or target audience.',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
    const [tabValue, setTabValue] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = () => {
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

        // Simulate AI response after a short delay
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now().toString(),
                content: generateAIResponse(newMessage),
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const generateAIResponse = (userMessage: Message): string => {
        if (userMessage.attachments?.some(a => a.type === 'link')) {
            return "I've analyzed your website URL. Based on this, I can help you develop a targeted marketing campaign across multiple channels. Would you like me to suggest campaign objectives and content strategies aligned with your brand positioning?";
        } else if (userMessage.attachments?.some(a => a.type === 'image')) {
            return "Thanks for sharing this visual. I can incorporate these elements into your marketing campaign. Would you like me to suggest campaign themes, messaging angles, and channel-specific content strategies that highlight these visuals?";
        } else {
            return "Thanks for the information about your campaign goals. I can help you develop a comprehensive marketing strategy with targeted messaging, channel recommendations, and content ideas. What specific objectives are you looking to achieve with this campaign?";
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
                                    <Typography variant="body1">
                                        {message.content}
                                    </Typography>

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
                        endIcon={<SendIcon />}
                        onClick={handleSendMessage}
                        disabled={isUploading || (inputValue.trim() === '' && !uploadPreview)}
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
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CampaignChat; 