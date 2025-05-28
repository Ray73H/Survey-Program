import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Container, Paper, Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getAnswer } from "../services/answers";
import { updateAnswer } from "../services/answers";
import { useUserContext } from "../contexts/UserContext";


export default function WelcomeSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const survey = location.state?.survey;
  const { user } = useUserContext();

  React.useEffect(() => {
    if (!survey) {
      navigate("/join");
    }
  }, [survey, navigate]);

  const handleFillOut = async () => {
    try {
      const existingAnswer = await getAnswer(survey._id, !!user?.guest, user.userId);
      const completed = existingAnswer.data[0].completed;
      const started = existingAnswer.data[0].started;
      const answerId = existingAnswer.data[0]._id


      if (!completed) {

        if (!started){
          const answerData = {
            started : true
          };

          await updateAnswer(answerId, answerData);
          
              }

      navigate("/fillSurvey", { 
        state: { 
          pinCode: survey.pinCode, 
          survey,
          answerId: answerId
        } 
      });
      } 
      
      else {
        alert('Survey already completed!');
      }
    } catch (error) {
      console.error("THIS SHOULD NOT HAPPEN !?!", error);
      alert("ERROR: NO SURVEY FOUND!!!")
    }
  };

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
          onClick={handleFillOut}
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
