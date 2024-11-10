import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';

const NewRequests = () => {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('No token found. User is not authenticated.');
                return;
            }

            const response = await fetch('https://newjobjunction.onrender.com/workers/requests', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok && data.serviceRequests) {
                setServiceRequests(data.serviceRequests);
            } else {
                console.error('Failed to fetch service requests:', data.message);
            }
        } catch (error) {
            console.error('Error fetching service requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Handle accepting a request
    const handleAcceptRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('https://newjobjunction.onrender.com/service-requests/accept', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ requestId }),
            });

            if (response.ok) {
                console.log(`Request ${requestId} accepted successfully`);
                setServiceRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.request_id === requestId ? { ...request, accept_reject: true } : request
                    )
                );
            } else {
                const data = await response.json();
                console.error('Failed to accept request:', data.message);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    // Handle rejecting a request (update logic if an API is available)
    const handleRejectRequest = (requestId) => {
        setServiceRequests((prevRequests) =>
            prevRequests.filter((request) => request.request_id !== requestId)
        );
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                New Requests
            </Typography>

            {isLoading ? (
                <Typography variant="body1">Loading...</Typography>
            ) : serviceRequests.length === 0 ? (
                <Typography variant="body1">No new requests available.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {serviceRequests.map((request) => (
                        <Grid item xs={12} md={6} lg={4} key={request.request_id}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: 2,
                                    borderRadius: 2,
                                    boxShadow: 3, // Add a subtle shadow
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: 6, // Increase shadow on hover
                                    },
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {request.user_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Phone: {request.user_phone}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Time Slot: {request.time_slot || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Address: {request.address || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            User Data: {request.user_data || 'N/A'}
                                        </Typography>
                                    </CardContent>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{
                                            width: '100%',
                                            padding: '8px 16px',
                                            '&:hover': {
                                                backgroundColor: 'green',
                                            },
                                        }}
                                        onClick={() => handleAcceptRequest(request.request_id)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            width: '100%',
                                            padding: '8px 16px',
                                            '&:hover': {
                                                backgroundColor: 'darkred',
                                            },
                                        }}
                                        onClick={() => handleRejectRequest(request.request_id)}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default NewRequests;
