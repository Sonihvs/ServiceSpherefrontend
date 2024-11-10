import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import WorkerRequest from './WorkerRequest';

const CompletedRequestsUser = () => {
    const [completedRequests, setCompletedRequests] = useState([]); // State for storing completed requests
    const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [activePage, setActivePage] = useState('completed'); // State for managing active page

    useEffect(() => {
        const fetchCompletedRequests = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('https://newjobjunction.onrender.com/services/compeleted-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    setErrorMessage('Failed to load completed requests.');
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                console.log("Fetched data:", data); // Log the data structure

                // Check the response message to match the actual response
                if (data.message === "compeleted service requests fetched successfully" && data.acceptedRequests) {
                    setCompletedRequests(data.acceptedRequests); // Assign acceptedRequests array
                    setErrorMessage(""); // Clear any previous error
                } else {
                    setErrorMessage("No completed service requests found.");
                }
            } catch (error) {
                console.error("Fetch error:", error); // Log any error that occurs
                setErrorMessage("Failed to load completed requests.");
            } finally {
                setLoading(false); // Ensure loading is stopped after fetching
            }
        };

        fetchCompletedRequests();
    }, []);

    const handlePageSwitch = (page) => {
        setActivePage(page);
    };

    return (
        <Box sx={{ padding: 3 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginLeft: 2 }}>Loading...</Typography>
                </Box>
            ) : (
                <>
                    {activePage === 'completed' ? (
                        <>
                            {errorMessage ? (
                                <Typography>{errorMessage}</Typography>
                            ) : completedRequests.length > 0 ? (
                                <Grid container spacing={3}>
                                    {completedRequests.map((request) => (
                                        <Grid item xs={12} sm={6} md={4} key={request.request_id}>
                                            <Card sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="h6"><strong>Request ID:</strong> {request.request_id}</Typography>
                                                    <Typography><strong>User Name:</strong> {request.user_name}</Typography>
                                                    <Typography><strong>User Phone:</strong> {request.user_phone}</Typography>
                                                    <Typography><strong>Email:</strong> {request.email}</Typography>
                                                    <Typography><strong>Request Date:</strong> {new Date(request.request_date).toLocaleString()}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography>No completed requests available.</Typography>
                            )}
                        </>
                    ) : (
                        <WorkerRequest />
                    )}
                </>
            )}
        </Box>
    );
};

export default CompletedRequestsUser;
