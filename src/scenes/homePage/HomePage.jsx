import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor={theme.palette.background.default}
        >
            <Typography variant="h4" gutterBottom>
                Welcome to Job Junction
            </Typography>
            <Typography variant="subtitle1" marginBottom={3}>
                Please choose your login type:
            </Typography>
            <Box display="flex" gap={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/login-worker")}
                >
                    Login as Worker
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/login-user")}
                >
                    Login as User
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
