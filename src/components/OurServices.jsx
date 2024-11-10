import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

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

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

const OurServices = ({ handleBookNowClick, focusedCardIndex, handleFocus, handleBlur }) => {
    return (
        <Grid container spacing={2}>
            {cardData.map((card, index) => (
                <Grid item xs={12} md={6} key={index}>
                    <StyledCard
                        onFocus={() => handleFocus(index)}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={focusedCardIndex === index ? 'Mui-focused' : ''}
                    >
                        <CardMedia
                            component="img"
                            alt={card.tag}
                            image={card.img}
                            sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                        />
                        <StyledCardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {card.tag}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                {card.title}
                            </Typography>
                            <StyledTypography variant="body2" color="text.secondary">
                                {card.description}
                            </StyledTypography>
                            <Button
                                variant="contained"
                                onClick={() => handleBookNowClick(card.tag)}
                            >
                                Book Now
                            </Button>
                        </StyledCardContent>
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
};

OurServices.propTypes = {
    handleBookNowClick: PropTypes.func.isRequired,
    focusedCardIndex: PropTypes.number,
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
};

export default OurServices;
