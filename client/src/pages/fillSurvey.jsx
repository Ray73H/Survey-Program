import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Stack
} from "@mui/material";
import { getSurveyByPinCode } from "../services/surveys";
import { updateAnswer } from "../services/answers";
import { useUserContext } from "../contexts/UserContext";

export default function FillSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const pinCode = location.state?.pinCode;
  const answerId = location.state?.answerId; // Get the answer ID from location state
  const [survey, setSurvey] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [answers, setAnswers] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0); // seconds
  const timerRef = React.useRef();
  const [focusedIdx, setFocusedIdx] = React.useState(null);

  // Timer effect
  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  React.useEffect(() => {
    if (!pinCode) {
      setError("No pin code provided.");
      setLoading(false);
      return;
    }
    const fetchSurvey = async () => {
      try {
        const response = await getSurveyByPinCode(pinCode);
        setSurvey(response.data);
      } catch (err) {
        setError("Failed to load survey. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [pinCode]);

  const handleChange = (idx, value) => {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  // Stop timer on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    clearInterval(timerRef.current);

    try {
      // Format answers according to the schema
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer,
        timestamp: new Date()
      }));

      const answerData = {
        surveyId: survey._id,
        respondentType: user && user.userId ? "user" : "guest",
        ...(user && user.userId && { respondentId: user.userId }),
        answers: formattedAnswers,
        completed: true,
        completedAt: new Date()
      };

      if (!answerId) {
        throw new Error("No answer ID found");
      }

      await updateAnswer(answerId, answerData);
      alert(`Survey submitted! Time taken: ${formatTime(elapsed)}`);
      navigate("/experimentee");
    } catch (error) {
      setError("Failed to submit survey. Please try again.");
      setSubmitting(false);
    }
  };

  // Format seconds to mm:ss
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!survey) return null;

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 6 }, width: "100%", maxWidth: 700, borderRadius: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {survey.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {survey.description}
            </Typography>
          </Box>
          <Box textAlign="right" minWidth={120}>
            <Paper elevation={0} sx={{ p: 1.5, background: "#f5f7fa", borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Author: {survey.author || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Time: {formatTime(elapsed)}
              </Typography>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Questions:
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {survey.questions && survey.questions.length > 0 ? (
                survey.questions.map((q, idx) => (
                  <Paper
                    key={q.id || idx}
                    sx={{
                      p: 3,
                      mb: 1,
                      background: "#f8fafc",
                      borderRadius: 3,
                      boxShadow: "0 2px 8px 0 rgba(31, 38, 135, 0.05)",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                      {idx + 1}. {q.questionText}
                    </Typography>
                    {q.questionType === "multiple" ? (
                      <RadioGroup
                        value={answers[idx] || ""}
                        onChange={(e) => handleChange(idx, e.target.value)}
                      >
                        {q.options.map((opt, i) => (
                          <FormControlLabel
                            key={i}
                            value={opt}
                            control={<Radio color="primary" />}
                            label={opt}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label={focusedIdx === idx || (answers[idx] && answers[idx].length > 0) ? "" : "Your answer"}
                        value={answers[idx] || ""}
                        onFocus={() => setFocusedIdx(idx)}
                        onBlur={() => setFocusedIdx(null)}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: false }}
                      />
                    )}
                  </Paper>
                ))
              ) : (
                <Typography>No questions found for this survey.</Typography>
              )}
              {survey.questions && survey.questions.length > 0 && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={submitting}
                  sx={{ mt: 2, alignSelf: "center", minWidth: 200, fontWeight: 700, fontSize: "1.1rem" }}
                >
                  {submitting ? "Submitting..." : "Submit Survey"}
                </Button>
              )}
            </Stack>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}
