import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';

const PendingRequestsUser = () => {
    const [completedRequests, setCompletedRequests] = useState([]); // State for storing completed requests
    const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
    const [loading, setLoading] = useState(true); // State for loading indicator

    // Fetch completed requests when component mounts
    useEffect(() => {
        const fetchCompletedRequests = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('https://newjobjunction.onrender.com/services/pendingRequests', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    setErrorMessage('Failed to load completed requests.');
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                // Check for the message and update state accordingly
                if (data.message === "pending service requests fetched successfully") {
                    setCompletedRequests(data.acceptedRequests || []); // Use acceptedRequests
                    setErrorMessage(""); // Clear error if requests are fetched successfully
                } else {
                    setErrorMessage("No pending service requests found.");
                }
            } catch (error) {
                setErrorMessage("Failed to load completed requests.");
            }
            setLoading(false); // Set loading to false after fetch is complete
        };

        fetchCompletedRequests();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress /> {/* Display loading spinner */}
                    <Typography variant="h6" sx={{ marginLeft: 2 }}>Loading...</Typography>
                </Box>
            ) : errorMessage ? (
                <Typography>{errorMessage}</Typography>
            ) : completedRequests.length > 0 ? (
                <Grid container spacing={3}>
                    {completedRequests.map((request) => (
                        <Grid item xs={12} sm={6} md={4} key={request.request_id}>
                            <Card sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6"><strong>Request ID:</strong> {request.request_id}</Typography>
                                    <Typography><strong>Payment Type:</strong> {request.payment_type}</Typography>
                                    <Typography><strong>Worker ID:</strong> {request.worker_id}</Typography>
                                    <Typography><strong>Work Type:</strong> {request.work_type}</Typography>
                                    <Typography><strong>Request Date:</strong> {new Date(request.request_date).toLocaleString()}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No pending requests available.</Typography>
            )}
        </Box>
    );
};

export default PendingRequestsUser;
