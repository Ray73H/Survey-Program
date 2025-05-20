import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Stack,
  TextField
} from "@mui/material";
import { getSurveyById } from "../services/surveys";

export default function PreviewSurvey() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [focusedIdx, setFocusedIdx] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await getSurveyById(surveyId);
        setSurvey(response.data);
      } catch (err) {
        setError("Failed to load survey. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [surveyId]);

  const handlePreviewChange = (idx, value) => {
    setPreviewAnswers((prev) => ({ ...prev, [idx]: value }));
  };

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
            </Paper>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Questions:
          </Typography>
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
                      value={previewAnswers[idx] || ""}
                      onChange={(e) => handlePreviewChange(idx, e.target.value)}
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
                      label={focusedIdx === idx || (previewAnswers[idx] && previewAnswers[idx].length > 0) ? "" : "Your answer"}
                      value={previewAnswers[idx] || ""}
                      onFocus={() => setFocusedIdx(idx)}
                      onBlur={() => setFocusedIdx(null)}
                      onChange={(e) => handlePreviewChange(idx, e.target.value)}
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                    />
                  )}
                </Paper>
              ))
            ) : (
              <Typography>No questions found for this survey.</Typography>
            )}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
