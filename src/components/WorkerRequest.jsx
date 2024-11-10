import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import NewRequests from './NewRequests';

const WorkerRequest = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewRequests, setShowNewRequests] = useState(false);

    const handleGetNewWork = () => {
        setShowNewRequests(true);
    };

    // Fetch pending requests on component mount
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                if (!jwtToken) {
                    console.error('No token found. User is not authenticated.');
                    return;
                }

                setIsLoading(true);

                const response = await fetch('https://newjobjunction.onrender.com/workers/pending-requests', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                const data = await response.json();
                console.log("API Response:", data);

                if (data.acceptedRequests) {
                    setPendingRequests(data.acceptedRequests);
                } else {
                    console.error('No accepted requests found in the response');
                }
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Handle the completion of a request
    const markAsCompleted = async (requestId) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('No token found. User is not authenticated.');
            return;
        }

        try {
            // Mark the request as completed
            const response = await fetch('https://newjobjunction.onrender.com/workers/mark-completed', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({ requestId: requestId }),
            });

            const result = await response.json();
            console.log('Mark as completed response:', result);

            if (response.ok) {
                // After completing the request, send a completion email to the user
                await sendCompletionEmail(requestId);

                // Update the UI to reflect the status change
                setPendingRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.request_id === requestId
                            ? { ...request, completed_status: true }
                            : request
                    )
                );
            } else {
                console.error('Failed to mark request as completed:', result.message);
            }
        } catch (error) {
            console.error('Error marking request as completed:', error);
        }
    };

    // Send a completion email to the user
    const sendCompletionEmail = async (requestId) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No token found. User is not authenticated.');
            return;
        }

        try {
            // API call to send completion email
            const response = await fetch('https://newjobjunction.onrender.com/workers/send-completion-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ requestId: requestId }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Completion email sent successfully:', result);
            } else {
                console.error('Failed to send completion email:', result.message);
            }
        } catch (error) {
            console.error('Error sending completion email:', error);
        }
    };

    return (
        <Box sx={{ padding: 3, margin: 2 }}>
            {!showNewRequests ? (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2, padding: '8px 16px', borderRadius: 2 }}
                    onClick={handleGetNewWork}
                >
                    Get New Work
                </Button>
            ) : (
                <NewRequests />
            )}

            <Typography variant="h2" gutterBottom sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                Worker Request Page
            </Typography>

            <Grid container spacing={2}>
                {isLoading ? (
                    <Typography variant="body1">Loading...</Typography>
                ) : pendingRequests.length === 0 ? (
                    <Typography variant="body1">No pending requests available.</Typography>
                ) : (
                    pendingRequests.map((request) => (
                        <Grid item xs={12} sm={6} md={4} key={request.request_id}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', padding: 3, boxShadow: 3, borderRadius: 2 }}>
                                <CardContent sx={{ paddingBottom: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        {request.user_name}
                                    </Typography>
                                    <Typography variant="body2">{request.email}</Typography>
                                    <Typography variant="body2">{request.area}</Typography>
                                    <Typography variant="body2">Phone: {request.user_phone}</Typography>
                                    <Typography variant="body2">Address: {request.address || 'N/A'}</Typography>
                                    {!request.completed_status && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginTop: 2, borderRadius: 1, padding: '8px 20px' }}
                                            onClick={() => markAsCompleted(request.request_id)}
                                        >
                                            Completed
                                        </Button>
                                    )}
                                    {request.completed_status && (
                                        <Typography variant="body2" color="green" sx={{ marginTop: 2 }}>
                                            Request Completed
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>

    );
};

export default WorkerRequest;
