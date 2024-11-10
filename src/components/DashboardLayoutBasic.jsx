import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Box, Button, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline,
    createTheme, ThemeProvider, Avatar, Divider, useMediaQuery,
} from '@mui/material';
import { Dashboard as DashboardIcon, ShoppingCart as ShoppingCartIcon, Menu as MenuIcon, } from '@mui/icons-material';
import { themeSettings } from '../theme';
import WorkerRequest from './WorkerRequest';
import CompletedRequests from './CompletedRequests';
import MainContent from './MainContent';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';

function DashboardLayoutBasic() {
    const [activePage, setActivePage] = useState('requests');
    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

    // Get the stored theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    const [isDarkTheme, setIsDarkTheme] = useState(storedTheme === 'dark');

    // User session and theme context
    const userType = sessionStorage.getItem('userType');
    const demoSession = {
        user: {
            image: './assets/profile1.png',
            name: 'Chief Explorer',
        },
    };

    const [session, setSession] = useState(demoSession);
    const authentication = useMemo(() => ({
        signIn: () => setSession(demoSession),
        signOut: () => {
            setSession(null);
            sessionStorage.clear();
            navigate('/');
        },
    }), [navigate]);

    const handleButtonClick = (page) => {
        setActivePage(page);
        if (isMobile) setIsSidebarOpen(false);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Toggle theme function, saves to localStorage
    const toggleTheme = () => {
        const newTheme = !isDarkTheme ? 'dark' : 'light';
        setIsDarkTheme(!isDarkTheme);
        localStorage.setItem('theme', newTheme); // Save theme to localStorage
    };

    // Set the theme based on the selected mode
    const theme = createTheme(themeSettings(isDarkTheme ? 'dark' : 'light'));

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                {/* Navbar */}
                <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            JobJunction
                        </Typography>
                        <Button color="inherit" onClick={toggleTheme}>
                            {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                        <AuthenticationContext.Provider value={authentication}>
                            <SessionContext.Provider value={session}>
                                <Account />
                            </SessionContext.Provider>
                        </AuthenticationContext.Provider>
                    </Toolbar>
                </AppBar>

                {/* Sidebar */}
                <Drawer
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                            marginTop: 8,
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={isSidebarOpen}
                >
                    <Toolbar />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                        <Avatar src={demoSession.user.image} alt="Profile" sx={{ width: 80, height: 80, mb: 1 }} />
                        <Typography variant="h6">{demoSession.user.name}</Typography>
                    </Box>
                    <Divider />
                    <List>
                        <ListItem button onClick={() => handleButtonClick('requests')}>
                            <ListItemIcon><DashboardIcon /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={() => handleButtonClick('orders')}>
                            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                            <ListItemText primary="Completed Orders" />
                        </ListItem>
                    </List>
                </Drawer>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        padding: 3,
                        marginTop: 8, // Offset to prevent overlap with AppBar
                    }}
                >
                    {userType === 'worker' ? (
                        activePage === 'requests' ? (
                            <WorkerRequest /> // Show WorkerRequest when "Dashboard" is clicked
                        ) : activePage === 'orders' ? (
                            <CompletedRequests /> // Show CompletedRequests when "Completed Orders" is clicked
                        ) : null
                    ) : userType === 'user' ? (
                        <MainContent /> // Show Blog for 'user' type
                    ) : null}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

DashboardLayoutBasic.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutBasic;
