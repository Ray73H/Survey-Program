import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { getThreeUncompletedSurveyAnswers } from "../services/answers.js";
import { getAnswer } from "../services/answers";
import { format } from "date-fns";
import { getSurveyById } from "../services/surveys.js";


const Experimentee = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuSurveyId, setMenuSurveyId] = useState(null);
    const [surveyID, setSurveyId] = useState(null);
    const [surveys, setSurveys] = useState([]);

    const navigate = useNavigate();
    const { user } = useUserContext();

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuSurveyId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuSurveyId(null);
    };

    const handleGoToSurvey = async (id) => {
         try {
            const res = await getSurveyById(id);
            const sur = res.data;
            const existingAnswer = await getAnswer(id, !!user?.guest, user.userId);
                navigate("/fillSurvey", {
                                state: {
                                    pinCode: sur.pinCode,
                                    sur,
                                    answerId: existingAnswer.data[0]._id,
                                },
                            });
        } catch {
            alert("Something went wrong");
            }
    };

    const displayStartButton = () => {
        return (
            <Box>
                <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                    Continue answering surveys
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        overflowX: "auto",
                        pb: 2,
                        scrollSnapType: "x mandatory",
                    }}
                >
                    <Box
                        onClick={() => navigate("/join")}
                        sx={{
                            minWidth: 250,
                            height: 180,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e3f2fd",
                            cursor: "pointer",
                            borderRadius: 2,
                            scrollSnapAlign: "start",
                            flexShrink: 0,
                            transition: "0.2s",
                            "&:hover": {
                                backgroundColor: "#bbdefb",
                            },
                        }}
                    ></Box>
                </Box>
            </Box>
        );
    };

    const displaySurveys = (surveyList) => {
        if (!surveyList || surveyList.length === 0) return null;
        return (
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    pb: 2,
                    scrollSnapType: "x mandatory",
                }}
            >
                {surveyList.map((survey) => (
                    <Card
                        key={survey.surveyId}
                        sx={{
                            minWidth: 280,
                            flexShrink: 0,
                            scrollSnapAlign: "start",
                            position: "relative",
                        }}
                    >
                        <Tooltip title="Continue taking survey">
                        <IconButton
                            size="small"
                            onClick={() => handleGoToSurvey(survey.surveyId)}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 1,
                            }}
                        >
                            <ContentPasteGoIcon/>
                        </IconButton>
                        </Tooltip>
                        <CardMedia
                            sx={{ height: 140, backgroundColor: "#ccc" }}
                            title="Survey Preview"
                        />

                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                {survey.surveyAuthor} • {format(survey.createdAt, "dd MMM yyyy")}
                            </Typography>
                            <Typography variant="h6">{survey.surveyTitle}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {survey.surveyDescription}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    };

    const fetchSurveys = async () => {
        try {
            const response = await getThreeUncompletedSurveyAnswers(user?.guest, user.userId);
            setSurveys(response.data);
        } catch (error) {
            alert(error);
            setSurveys([]);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, [user.userId]);

    return (
        <Box sx={{ padding: 4, flexGrow: 1 }}>
            <Typography variant="h5" gutterBottom>
                Welcome {user.name}
            </Typography>

            <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                Your Unfinished Surveys
            </Typography>
            {(surveys == null || surveys.length === 0) && (
                <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>
                    You have no unfinished surveys. Join new surveys in the navigation bar.
                </Typography>
            )}

            {surveys != null && surveys.length > 0 && displaySurveys(surveys)}
        </Box>
    );
};

export default Experimentee;
