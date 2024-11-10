import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const BookServiceForm = ({ workType }) => {  // Accept workType as a prop
    const [formData, setFormData] = useState({
        user_phone: "",
        email: "",
        user_name: "",
        area: "mandvi",
        payment_type: "Online",
        work_type: workType || "",  // Set initial value to workType prop
        city: "",
        user_id: "",
        address: "",
        time_slot: "9 AM to 11 AM",
        user_data: dayjs("2024/11/11", "YYYY/MM/DD"),
    });

    const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility

    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken) {
            setFormData((prevData) => ({
                ...prevData,
                user_id: jwtToken,
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (newDate) => {
        setFormData({
            ...formData,
            user_data: newDate,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            alert("Please login to book a service.");
            return;
        }

        const requestBody = {
            ...formData,
            userId: formData.user_id,
        };

        console.log("Booking Service Request Body:", requestBody);  // Log request body

        try {
            const response = await fetch("https://newjobjunction.onrender.com/services/book-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            console.log("Booking Service Response Status:", response.status);  // Log response status

            if (response.ok) {
                // Open dialog on successful submission
                setOpenDialog(true);

                // Reset form data
                setFormData({
                    user_phone: "",
                    email: "",
                    user_name: "",
                    area: "mandvi",
                    payment_type: "",
                    work_type: "",
                    city: "",
                    user_id: jwtToken,
                    address: "",
                    time_slot: "9 AM to 11 AM",
                    user_data: "",
                });
            } else {
                const errorData = await response.json();
                console.log("Failed to book service, error data:", errorData);  // Log error response data
                alert("Failed to book service. Please try again.");
            }
        } catch (error) {
            console.error("Error booking service:", error);  // Log error object
            alert("Error: " + error.message);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "800px", margin: "0 auto", padding: 2, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom>Book Service</Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            type="email"
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone"
                            name="user_phone"
                            value={formData.user_phone}
                            onChange={handleChange}
                            fullWidth
                            required
                            type="tel"
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            fullWidth
                            required
                            select
                            sx={{ marginBottom: 2 }}
                        >
                            <MenuItem value="Mandvi">Mandvi</MenuItem>
                            <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                            <MenuItem value="Rajkot">Rajkot</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            fullWidth
                            required
                            select
                            sx={{ marginBottom: 2 }}
                        >
                            <MenuItem value="mandvi">Mandvi</MenuItem>
                            <MenuItem value="bopal">Bopal</MenuItem>
                            <MenuItem value="trikonbag">TrikonBag</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Payment Type"
                            name="payment_type"
                            value={formData.payment_type}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Work Type"
                            name="work_type"
                            value={formData.work_type}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    {/* New fields */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Time Slot</InputLabel>
                            <Select
                                label="Time Slot"
                                name="time_slot"
                                value={formData.time_slot}
                                onChange={handleChange}
                            >
                                <MenuItem value="9 AM to 11 AM">9 AM to 11 AM</MenuItem>
                                <MenuItem value="2 PM to 5 PM">2 PM to 5 PM</MenuItem>
                                <MenuItem value="5 PM to 8 PM">5 PM to 8 PM</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="User Date"
                                name="user_data"
                                value={formData.user_data}
                                onChange={handleDateChange}
                                fullWidth
                                required
                                inputFormat="YYYY/MM/DD"  // Set the format to yyyy/mm/dd
                                minDate={dayjs()}  // Set minimum date as today's date
                                sx={{ marginBottom: 2 }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Book Now
                </Button>
            </form>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>Your Request Submitted Successfully. You will receive a confirmation mail on your registered email ID.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookServiceForm;
