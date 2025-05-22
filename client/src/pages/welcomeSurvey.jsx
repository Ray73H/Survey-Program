import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Container, Paper, Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function WelcomeSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const survey = location.state?.survey;

  React.useEffect(() => {
    if (!survey) {
      navigate("/join");
    }
  }, [survey, navigate]);

  if (!survey) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={6}
        sx={{
          p: 6,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#333",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Welcome to {survey.title}
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "#333",
            textAlign: "center",
            mb: 2,
          }}
        >
          {survey.description}
        </Typography>
      </Paper>
      <Stack direction="row" spacing={30} sx={{ mt: 2 }}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={() => navigate("/fillSurvey", { state: { pinCode: survey.pinCode, survey } })}
        >
          Fill out
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/Experimentee")}
        >
          back to dashboard
        </Button>
      </Stack>
    </Container>
  );
}
