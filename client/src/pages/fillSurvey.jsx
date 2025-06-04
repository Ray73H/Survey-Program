import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
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
  Stack,
  LinearProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getSurveyByPinCode } from "../services/surveys";
import { updateAnswer, getAnswer } from "../services/answers";
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

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
    const fetchSurveyAndAnswers = async () => {
      try {
        // First get the survey
        const surveyResponse = await getSurveyByPinCode(pinCode);
        console.log("Survey response:", surveyResponse.data);
        setSurvey(surveyResponse.data);
        
        // Then get the answers using the survey's _id
        const answersResponse = await getAnswer(surveyResponse.data._id, !user?.userId, user?.userId);
        console.log("Answers response:", answersResponse.data);
        
        // If there are existing answers, load them into the state
        if (answersResponse.data && Array.isArray(answersResponse.data)) {
          const loadedAnswers = {};
          answersResponse.data.forEach((answerObj) => {
            if (answerObj.answers && Array.isArray(answerObj.answers)) {
              answerObj.answers.forEach((answer) => {
                // Convert questionNumber to 0-based index
                const questionIndex = answer.questionNumber - 1;
                loadedAnswers[questionIndex] = answer.answer;
              });
            }
          });
          console.log("Processed answers to load:", loadedAnswers);
          setAnswers(loadedAnswers);
        }
      } catch (err) {
        console.error("Error loading survey or answers:", err);
        setError("Failed to load survey. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyAndAnswers();
  }, [pinCode, user]);

  // Add a useEffect to monitor answers state changes
  React.useEffect(() => {
    console.log("Current answers state:", answers);
  }, [answers]);

  const handleChange = (value) => {
    setAnswers((prev) => {
      const updated = { ...prev, [currentQuestionIndex]: value };
      // Save to DB on every change
      if (answerId) {
        const formattedAnswers = Object.entries(updated).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          questionNumber: parseInt(questionId) + 1,
          answer,
          timestamp: new Date()
        }));
        updateAnswer(answerId, { answers: formattedAnswers }).catch((err) => {
          // Optionally log or show error, but don't block UI
          console.error('Failed to autosave answer', err);
        });
      }
      return updated;
    });
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

  const isLastQuestion = currentQuestionIndex === survey?.questions?.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Stop timer on submit
  const handleSubmit = async () => {
    setSubmitting(true);
    clearInterval(timerRef.current);

    try {
      // Format answers according to the schema
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        questionNumber: parseInt(questionId) + 1,
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

      navigate("/lockScreen", { 
        state: { 
          survey, 
          time_taken: formatTime(elapsed)
        } } ); 
      // alert(`Survey submitted! Time taken: ${formatTime(elapsed)}`);
      // navigate("/experimentee");
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

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

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
          onClick={() => {
            const f = window.confirm("Go back to the dashboard without submitting?"); 
            
            f && navigate('/experimentee')}}

          sx={{ mt: 0 }}
        >
          <HomeIcon/>
    
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
                    value={answers[currentQuestionIndex] || ""}
                    onChange={(e) => handleChange(e.target.value)}
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
                    label={focusedIdx === currentQuestionIndex || (answers[currentQuestionIndex] && answers[currentQuestionIndex].length > 0) ? "" : "Your answer"}
                    value={answers[currentQuestionIndex] || ""}
                    onFocus={() => setFocusedIdx(currentQuestionIndex)}
                    onBlur={() => setFocusedIdx(null)}
                    onChange={(e) => handleChange(e.target.value)}
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
                  size="large"
                  disabled={submitting}
                  onClick={() => {
                    const confirmed = window.confirm("Are you sure you want to submit the survey? Once submitted, you cannot make any changes.");
                    if (confirmed) {
                      handleSubmit();
                    }
                  }}
                  sx={{ minWidth: 150, fontWeight: 700, fontSize: "1.1rem" }}
                >
                  {submitting ? "Submitting..." : "Submit Survey"}
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
