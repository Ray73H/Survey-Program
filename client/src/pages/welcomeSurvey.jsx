import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Container, Paper, Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { createAnswer } from "../services/answers";
import { getAnswer } from "../services/answers";
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
      const answerData = {
        surveyId: survey._id,
        respondentType: user && user.userId ? "user" : "guest",
        ...(user && user.userId && { respondentId: user.userId })
      };
      
      const response = await createAnswer(answerData);
      console.log("Creating answer with data:", answerData);
      console.log("Answer created successfully");
      navigate("/fillSurvey", { 
        state: { 
          pinCode: survey.pinCode, 
          survey,
          answerId: response.data._id
        } 
      });
    } catch (error) {
      console.error("Error creating answer BROOO:", error);
      if (error.response?.status === 400) {
        const existingAnswer = await getAnswer(survey._id, !!user?.guest, user.userId);
        // console.log("Existing answer:", existingAnswer);
        // console.log("existingAnswer.data:", existingAnswer.data);

        // let answerObj;
        // if (Array.isArray(existingAnswer.data)) {
        //   if (existingAnswer.data.length === 0) {
        //     throw new Error("No existing answer found for this user and survey.");
        //   }
        //   answerObj = existingAnswer.data[0];
        // } else {
        //   answerObj = existingAnswer.data;
        // }

        // console.log("answerObj:", answerObj);
        // console.log("Navigating with answerId:", answerObj._id);

        // console.log("existingAnswer.data[0]:", existingAnswer.data[0]);
        const completed = existingAnswer.data[0].completed;

        

        if (!completed) {

          navigate("/fillSurvey", { 
            state: { 
              pinCode: survey.pinCode, 
              survey,
              answerId: existingAnswer.data[0]._id
            } 
          });
        }
        else {
          // throw new Error("Survey already completed!")
          alert('Survey already completed!')

        }
      }
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
