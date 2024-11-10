import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const CompletedRequests = () => {
    const [completedRequests, setCompletedRequests] = useState([]); // Default to empty array
    const [errorMessage, setErrorMessage] = useState(""); // For displaying any error messages

    useEffect(() => {
        const fetchCompletedRequests = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                console.log('Fetching completed requests with token:', token); // Log the token
                const response = await fetch('https://newjobjunction.onrender.com/workers/compeleted-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                console.log('Response Data:', data); // Log the fetched data

                // Check for the specific message and set an error state
                if (data.message === "compeleted service requests fetched successfully") {
                    setCompletedRequests(data.acceptedRequests || []); // Use acceptedRequests
                    setErrorMessage(""); // Clear any previous error message
                } else {
                    setErrorMessage("No completed service requests found.");
                }
            } catch (error) {
                console.error("Failed to fetch completed requests:", error);
                setErrorMessage("Failed to load completed requests.");
            }
        };

        fetchCompletedRequests();
    }, []);

    console.log('Completed Requests in state:', completedRequests); // Log the completedRequests in state

    return (
        <Box sx={{ padding: 3 }}>
            {errorMessage ? (
                <Typography variant="body1" color="error">{errorMessage}</Typography>
            ) : completedRequests.length > 0 ? (
                <Grid container spacing={3}>
                    {completedRequests.map((request) => (
                        <Grid item xs={12} sm={6} md={4} key={request.request_id}>
                            <Card sx={{
                                padding: 3,
                                borderRadius: 2,
                                boxShadow: 3,
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {request.user_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Phone: {request.user_phone}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Time Slot: {request.time_slot}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Address: {request.address || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                                        User Data: {request.user_data || "N/A"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No completed requests available.</Typography>
            )}
        </Box>
    );
};

export default CompletedRequests;
