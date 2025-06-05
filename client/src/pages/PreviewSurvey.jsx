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
  TextField,
  Button,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from '@mui/icons-material/Close';
import { getSurveyById } from "../services/surveys";
import { useNavigate } from "react-router-dom";

export default function PreviewSurvey() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const navigate = useNavigate();

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

  // Timer effect - just for display purposes in preview
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePreviewChange = (value) => {
    setPreviewAnswers((prev) => ({ ...prev, [currentQuestionIndex]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

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

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey?.questions?.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

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
              <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => {navigate('/experimenter')}}          
                      sx={{ mt: 0 }}
                    >
                      <Tooltip title="Exit preview mode">
                        <CloseIcon/>
                      </Tooltip>
                      </Button>
                      <Box sx={{ height: 16 }} />
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

        {/* Progress bar */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Question {currentQuestionIndex + 1} of {survey.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {/* Current question */}
        <Box sx={{ mt: 2 }}>
          <Stack spacing={4}>
            {currentQuestion && (
              <Paper
                sx={{
                  p: 4,
                  mb: 3,
                  background: "#f8fafc",
                  borderRadius: 3,
                  boxShadow: "0 2px 8px 0 rgba(31, 38, 135, 0.05)",
                }}
              >
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                  {currentQuestion.questionText}
                </Typography>
                {currentQuestion.questionType === "multiple" ? (
                  <RadioGroup
                    value={previewAnswers[currentQuestionIndex] || ""}
                    onChange={(e) => handlePreviewChange(e.target.value)}
                  >
                    {currentQuestion.options.map((opt, i) => (
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
                    minRows={3}
                    label={focusedIdx === currentQuestionIndex || (previewAnswers[currentQuestionIndex] && previewAnswers[currentQuestionIndex].length > 0) ? "" : "Your answer"}
                    value={previewAnswers[currentQuestionIndex] || ""}
                    onFocus={() => setFocusedIdx(currentQuestionIndex)}
                    onBlur={() => setFocusedIdx(null)}
                    onChange={(e) => handlePreviewChange(e.target.value)}
                    variant="outlined"
                    InputLabelProps={{ shrink: false }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              </Paper>
            )}

            {/* Navigation buttons */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                startIcon={<ArrowBackIcon />}
                sx={{ minWidth: 120 }}
              >
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  variant="contained"
                  color="primary"
                  disabled
                  sx={{ 
                    minWidth: 150, 
                    fontWeight: 700, 
                    fontSize: "1.1rem",
                    '&.Mui-disabled': {
                      backgroundColor: '#e0e0e0',
                      color: '#9e9e9e'
                    }
                  }}
                >
                  Preview Mode
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ minWidth: 120 }}
                >
                  Next
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
