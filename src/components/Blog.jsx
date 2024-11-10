import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import MainContent from './MainContent';  // Your custom content for the Blog page
import { themeSettings } from '../theme'; // Import themeSettings from theme.js

export default function Blog(props) {
    const [mode, setMode] = React.useState('light'); // Set initial mode as light

    // You can update the mode state based on user preference (dark/light mode toggle)
    // For simplicity, we'll keep it light for now.

    const theme = themeSettings(mode); // Generate theme with current mode

    return (
        <ThemeProvider theme={theme}> {/* Apply the theme */}
            <CssBaseline enableColorScheme />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                <MainContent />
            </Container>
        </ThemeProvider>
    );
}
