import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Avatar,
    useTheme
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const theme = useTheme();

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
                boxShadow: '0 4px 20px rgba(255, 126, 95, 0.2)'
            }}
        >
            <Toolbar>
                <Box
                    component="img"
                    src="/logo192.png"
                    alt="Logo"
                    sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 600,
                        letterSpacing: '0.5px'
                    }}
                >
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/products/new"
                        sx={{
                            mr: 2,
                            borderRadius: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.25)'
                            },
                            fontWeight: 500
                        }}
                    >
                        New Product
                    </Button>

                    <IconButton
                        color="inherit"
                        sx={{
                            mr: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        sx={{
                            mr: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>

                    <Avatar
                        alt="User Profile"
                        src="/avatar.png"
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'white',
                            color: theme.palette.primary.main,
                            border: '2px solid white'
                        }}
                    >
                        U
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 