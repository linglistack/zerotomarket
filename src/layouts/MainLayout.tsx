import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/Sidebar';
import '../components/components.css';

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: 'background.default',
                    overflow: 'auto'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout; 