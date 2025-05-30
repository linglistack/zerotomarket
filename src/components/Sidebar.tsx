import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Box,
    Typography,
    alpha,
    Avatar,
    ListItemButton
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Campaign as CampaignIcon,
    Insights as InsightsIcon,
    LibraryBooks as ContentIcon,
    AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Marketing Campaign', icon: <CampaignIcon />, path: '/products/new' },
        { text: 'Competitor Insights', icon: <InsightsIcon />, path: '/competitors' },
        { text: 'Content Library', icon: <ContentIcon />, path: '/content' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: 'background.paper',
                    borderRight: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
                },
            }}
        >

            <Box sx={{ overflow: 'auto', p: 2, py: 4 }}>
                <List sx={{ px: 1 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <ListItem
                                key={item.text}
                                component={Link}
                                to={item.path}
                                sx={{
                                    color: isActive ? 'primary.main' : 'text.primary',
                                    textDecoration: 'none',
                                    backgroundColor: isActive
                                        ? alpha('#FF7E5F', 0.1)
                                        : 'transparent',
                                    borderRadius: 3,
                                    mb: 1.5,
                                    py: 1.5,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: isActive
                                            ? alpha('#FF7E5F', 0.15)
                                            : alpha('#FF7E5F', 0.05),
                                        transform: 'translateX(5px)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    minWidth: '45px',
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 24
                                    }
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '1rem'
                                    }}
                                />
                                {isActive && (
                                    <Box
                                        sx={{
                                            width: 4,
                                            height: 36,
                                            backgroundColor: 'primary.main',
                                            borderRadius: '0 4px 4px 0',
                                            position: 'absolute',
                                            left: 0
                                        }}
                                    />
                                )}
                            </ListItem>
                        );
                    })}
                </List>

                <Box
                    sx={{
                        mt: 8,
                        mx: 2,
                        p: 3,
                        bgcolor: 'background.default',
                        borderRadius: 3,
                        boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.03)'
                    }}
                >
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        ZeroToMarket AI
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        Our AI is analyzing your campaigns to optimize your marketing performance.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 2,
                            p: 1,
                            bgcolor: alpha('#FF7E5F', 0.08),
                            borderRadius: 2
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                textAlign: 'center',
                                color: 'primary.main',
                                fontSize: '0.75rem',
                                fontWeight: 500
                            }}
                        >
                            ZeroToMarket v0.1
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar; 