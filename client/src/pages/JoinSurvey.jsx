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
import { getSurveyByPinCode} from "../services/surveys";
import { createAnswer } from "../services/answers";
import { getAnswer } from "../services/answers";
import { useUserContext } from "../contexts/UserContext";
import { addSurveyAccess } from "../services/users";

export default function JoinSurvey() {
  const [itemId, setItemId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await getSurveyByPinCode(itemId.trim());
      const survey = response.data;
      // Update surveyAccess for the user in the database
      if (user.userId && survey._id) {
        await addSurveyAccess(user.userId, survey._id);
      }
      try {
        const answerData = {
          surveyId: survey._id,
          respondentType: user && user.userId ? "user" : "guest",
          ...(user && user.userId && { respondentId: user.userId })
        };
        const createRes = await createAnswer(answerData);
        navigate("/welcome", {
          state: {
            pinCode: survey.pinCode,
            survey,
            answerId: createRes.data._id
          }
        });
      } catch (error) {
        if (error.response?.status === 400) {
          const existingAnswer = await getAnswer(survey._id, !!user?.guest, user.userId);
          const completed = existingAnswer.data[0].completed;
          if (!completed) {
            navigate("/welcome", {
              state: {
                pinCode: survey.pinCode,
                survey,
                answerId: existingAnswer.data[0]._id
              }
            });
          } else {
            alert('Survey already completed!');
          }
        } else {
          alert('Error creating answer.');
        }
      }
    } catch (err) {
      setError("Invalid pin code. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? "Checking..." : "Join"}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Paper>
    </Container>
  );
}

