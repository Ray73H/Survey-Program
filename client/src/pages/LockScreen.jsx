import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function LockScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const survey = location.state?.survey;
    const time = location.state?.time_taken;

    const name = survey?.title || 'Survey';
    const description = survey?.description || '';

    return (
        <Box sx={{
            minHeight: "100vh",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Container maxWidth="sm">
                <Paper elevation={8} sx={{
                    p: 5,
                    borderRadius: 5,
                    textAlign: "center",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "#43a047", mb: 2 }} />
                    <Typography variant="h3" color="primary" sx={{ mb: 1, fontWeight: 800 }}>
                        {name}
                    </Typography>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                        Completed!
                    </Typography>
                    {description && (
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            {description}
                        </Typography>
                    )}
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                        Time Taken: <span style={{ fontWeight: 700 }}>{time || '00:00'}</span>
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/experimentee")}
                        sx={{ borderRadius: 3, px: 5, fontWeight: 700 }}
                    >
                        Go to Dashboard
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}

