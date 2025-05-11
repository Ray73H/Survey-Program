import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function JoinSurvey() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSurveyId, setMenuSurveyId] = useState(null);
  const [itemId, setItemId] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedId(itemId.trim());
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enter survey PIN
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Survey PIN"
            variant="outlined"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          />
          <Button variant="contained" type="submit" onClick={() => navigate("/surveybuilder")}>
            Join
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
