import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import BookServiceForm from './BookServiceForm'; // Import the BookServiceForm component
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PendingRequestsUser from './PendingRequestsUser';
import CompletedRequestsUser from './CompletedRequestsUser';

const cardData = [
    {
        img: "/assets/painter.jpg",
        tag: 'Painter',
        title: 'Transform Your Space with Professional Painting',
        description: (
            <>
                Enhance your environment with expert painting services. <br />
                Price range: 200 - 1000 Rs.
            </>
        ),
    },
    {
        img: "/assets/carpenter.jpg",
        tag: 'Carpenter',
        title: 'Quality Craftsmanship with Our Carpentry Services',
        description: (
            <>
                Custom carpentry solutions for all your needs. <br />
                Price range: 200 - 1000 Rs.
            </>
        ),
    },
];

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid #00796b',
    },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
}));

const StyledTypography = styled(Typography)(() => ({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}));

export default function MainContent() {
    const [focusedCardIndex, setFocusedCardIndex] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [activePage, setActivePage] = useState('services');
    const theme = useTheme();

    const [workType, setWorkType] = useState("");


    const handleFocus = (index) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    const handleBookNowClick = (type) => {
        setWorkType(type); // Set the work_type based on the clicked card
        setIsFormVisible(true); // Show the dialog when the button is clicked
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);  // Hide the dialog when the close action is triggered
    };

    const handleBackClick = () => {
        setActivePage('services'); // Go back to the services page
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3 }}>
            <Box>
                {/* Navigation Buttons */}
                <Button
                    onClick={() => setActivePage('requests')}
                    variant="contained"
                    color="primary"
                    sx={{ margin: 1 }}
                >
                    Pending Requests
                </Button>

                <Button
                    onClick={() => setActivePage('orders')}
                    variant="contained"
                    color="primary"
                    sx={{ margin: 1 }}
                >
                    Completed Orders
                </Button>

                {/* Back Button */}
                {activePage !== 'services' && (
                    <Button
                        onClick={handleBackClick}
                        variant="contained"
                        color="primary"
                        sx={{ margin: 1 }}
                    >
                        Back to Our Services
                    </Button>
                )}

            </Box>

            {/* Conditionally render the content based on activePage */}
            {activePage === 'requests' ? (
                <PendingRequestsUser />
            ) : activePage === 'orders' ? (
                <CompletedRequestsUser /> // Ensure correct rendering of CompletedRequestUser
            ) : (
                <>
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            marginBottom: 3,
                        }}
                        gutterBottom
                    >
                        Our Services
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {/* First Card */}
                        <Grid item xs={12} sm={6} md={5}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt={cardData[0].tag}
                                    image={cardData[0].img}
                                    aspect-ratio="16 / 9"
                                    sx={{
                                        borderBottom: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h3" component="div">
                                        {cardData[0].tag}
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {cardData[0].title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {cardData[0].description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ marginTop: 2 }}
                                        onClick={() => handleBookNowClick("painting")}
                                    >
                                        Book Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Second Card */}
                        <Grid item xs={12} sm={6} md={5}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt={cardData[1].tag}
                                    image={cardData[1].img}
                                    aspect-ratio="16 / 9"
                                    sx={{
                                        borderBottom: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h3" component="div">
                                        {cardData[1].tag}
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {cardData[1].title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {cardData[1].description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ marginTop: 2 }}
                                        onClick={() => handleBookNowClick("carpentry")}
                                    >
                                        Book Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}

            {/* Dialog/Popup for the form */}
            <Dialog open={isFormVisible} onClose={handleCloseForm}>
                <DialogContent>
                    {workType && <BookServiceForm workType={workType} />}
                </DialogContent>
            </Dialog>

            {/* Apply a blur effect on the background when the form is visible */}
            {isFormVisible && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 100,
                    }}
                />
            )}
        </Box>
    );
}
