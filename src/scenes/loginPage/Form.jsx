import { useState } from "react";
import { Box, Typography, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Required"),
    password: yup.string().required("Required"),
});

const signupSchema = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup.string().email("Invalid Email").required("Required"),
    phone: yup.string().length(10, "Phone number must be 10 digits").required("Required"),
    password: yup.string().required("Required"),
    city: yup.string().required("Required"),
});

const initialLoginValues = {
    email: "",
    password: "",
};

const initialSignupValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
};

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const [loading, setLoading] = useState(false); // Add loading state
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const login = async (values, onSubmitProps) => {
        setLoading(true); // Start loading
        const loggedInResponse = await fetch(`https://newjobjunction.onrender.com/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        const loggedIn = await loggedInResponse.json();

        // Log the response to see if 'loggedIn.user' and 'loggedIn.user.email' are correct
        console.log("Logged in response:", loggedIn);

        onSubmitProps.resetForm();
        setLoading(false); // End loading

        if (loggedIn) { // Ensure loggedIn.user exists
            sessionStorage.setItem('userType', 'user');
            localStorage.setItem("jwtToken", loggedIn.token);

            // Store the email in sessionStorage correctly

            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );

            // Navigate to the dashboard page
            navigate("/DashBoardPage");
        } else {
            console.log("Login failed. User data is missing or incorrect.");
        }
    };

    const signup = async (values, onSubmitProps) => {
        const savedUserResponse = await fetch(`https://newjobjunction.onrender.com/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();
        if (savedUser) {
            setPageType("login");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await signup(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialLoginValues : initialSignupValues}
            validationSchema={isLogin ? loginSchema : signupSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span" },
                        }}
                    >
                        {isRegister && (
                            <>
                                <TextField
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={Boolean(touched.name) && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Phone"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.phone}
                                    name="phone"
                                    error={Boolean(touched.phone) && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="City"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.city}
                                    name="city"
                                    error={Boolean(touched.city) && Boolean(errors.city)}
                                    helperText={touched.city && errors.city}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </>
                        )}

                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.dark,
                                },
                            }}
                        >
                            {isLogin
                                ? "Don't have an account? Sign Up here."
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;
