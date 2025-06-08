import React from "react";
import {
    Box,
    Button,
    Divider,
    Paper,
    TextField,
    Typography,
    FormControl,
    FormControlLabel,
    Switch,
    Select,
    InputLabel,
    MenuItem,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
    Dea
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SurveyBuilderNavbar from "../components/SurveyBuilderNavbar";
import { getSurveyById, updateSurvey, deleteSurvey } from "../services/surveys";
import { useParams } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { DeleteSurveyDialog } from "../components/DeleteSurveyDialog";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Copenhagen');
const now = dayjs.utc();

function SurveyBuilder() {
    const navigate = useNavigate();
    const { surveyId } = useParams();
    const { user } = useUserContext();
    const [survey, setSurvey] = React.useState({
        title: "",
        description: "",
        public: false,
        pinCode: "",
        questions: [],
        deadline: now.add(7, 'day'),
        published: false
    });
    const [originalSurvey, setOriginalSurvey] = React.useState(survey);
    const [isChanged, setIsChanged] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [deadline, setDeadline] = React.useState(dayjs.utc().add(7, 'day'));
    const [showAlert, setShowAlert] = React.useState(false);
    const [updateSucces, setUpdateSucces] = React.useState(true);
    const [serverMsg, setServerMsg] = React.useState("");

    // Initial get call for survey
    React.useEffect(() => {
        const getSurvey = async () => {
            const response = await getSurveyById(surveyId);
            setSurvey(response.data);
            setOriginalSurvey(response.data);  
        };
        getSurvey();
    }, [surveyId]);


    // Change state if there is unsaved data
    React.useEffect(() => {
        setIsChanged(JSON.stringify(survey) !== JSON.stringify(originalSurvey));
    }, [survey, originalSurvey]);

    // Block on tab close or refresh
    React.useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isChanged) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isChanged]);

    const handleAddQuestion = () => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: [
                ...prevSurvey.questions,
                {
                    questionType: "text",
                    id: Date.now(),
                    questionText: "",
                    options: [],
                },
            ],
        }));
    };

    const handleDeleteQuestion = (id) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.filter((q) => q.id !== id),
        }));
    };

    const handleQuestionTextChange = (id, newQuestionText) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === id ? { ...q, questionText: newQuestionText } : q,
            ),
        }));
    };

    const handleQuestionTypeChange = (id, newQuestionType) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === id
                    ? {
                          ...q,
                          questionType: newQuestionType,
                          options: newQuestionType === "text" ? [] : q.options,
                      }
                    : q,
            ),
        }));
    };

    const handleAddOption = (id) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === id ? { ...q, options: [...q.options, ""] } : q,
            ),
        }));
    };

    const handleDeleteOption = (id, optionIndex) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === id ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) } : q,
            ),
        }));
    };

    const handleOptionTextChange = (id, optionIndex, newOptionText) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            questions: prevSurvey.questions.map((q) =>
                q.id === id
                    ? {
                          ...q,
                          options: q.options.map((opt, i) =>
                              i === optionIndex ? newOptionText : opt,
                          ),
                      }
                    : q,
            ),
        }));
    };

    const handleDateChange = ((newDate) => {
        setDeadline(newDate);
        setSurvey((prevSurvey) => ({
                ...prevSurvey,
                deadline: newDate.toJSON(),
        }))
    })


    const catchUpdateErr = (err) => {
        let serverMessage = "";
        if (!err?.response) {
            setServerMsg("No Server Response")
            setUpdateSucces(false);
            setShowAlert(true);
        } else if (err.response?.status===404) {
            serverMessage = err.response?.data?.message ?? "Survey not found";
            setServerMsg(serverMessage);
            setUpdateSucces(false);
            setShowAlert(true);
        } else {
            serverMessage = err.response?.data?.message ?? "Internal server error";
            setServerMsg(serverMessage);
            setUpdateSucces(false);
            setShowAlert(true);
        }
    }

    const handlePublishSurvey = async (e) => {
        e.preventDefault();

        // No title
        if (!survey.title) {
            setServerMsg("The survey must have a title.");
            setUpdateSucces(false);
            setShowAlert(true);
            return;
        }

        // No questions
        if (survey.questions.length === 0) {
            setServerMsg("The survey has no questions");
            setUpdateSucces(false);
            setShowAlert(true);
            return;
        }
        
        // No deadline
        if (!survey.deadline) {
            setServerMsg("Deadline required");
            setUpdateSucces(false);
            setShowAlert(true);
            return;
        }

        try {
            const newPublishedStatus = !survey.published;

            
            const surveyData = {
                userId: user.userId,
                ...survey,
                published: newPublishedStatus,
            };

            const data = await updateSurvey(surveyId, surveyData);

            setSurvey((prevSurvey) => ({
                    ...prevSurvey,
                    published: newPublishedStatus,
            }))

            if (newPublishedStatus) { setServerMsg("Survey Published") } else { setServerMsg("Survey Unpublished") }
            setUpdateSucces(true);
            setShowAlert(true);

        } catch (err) {
            catchUpdateErr(err);
        }
    }

    const handleSaveSurvey = async (e) => {
        e.preventDefault();
        try {
            const surveyData = {
                userId: user.userId,
                ...survey,
            };
    
            const data = await updateSurvey(surveyId, surveyData);
            setSurvey(survey);
            setUpdateSucces(true);
            setServerMsg("Survey Saved")
            setShowAlert(true);
        } catch (err) {
            catchUpdateErr(err);
        }
    };

    const handleDeleteSurvey = async () => {
        await deleteSurvey(surveyId);
        setOpenDeleteDialog(false);
        navigate("/experimenter");
    };

    return (
        <>
            <Box className="p-4">
                <SurveyBuilderNavbar 
                    onDeleteDialogChange={() => setOpenDeleteDialog(true)}
                    handlePublish={handlePublishSurvey}
                    published={survey.published}
                    onSave={handleSaveSurvey}
                    showAlert={showAlert}
                    onCloseAlert={() => {setShowAlert(false); setServerMsg("");}}
                    updateSucces={updateSucces}
                    serverMsg={serverMsg}
                />

                <Divider className="mb-4" />

                <Box className="flex justify-center p-10">
                    <Paper elevation={3} className="p-6 w-full max-w-3xl">
                        <Box
                            component="form"
                            id="survey-form"
                            onSubmit={handleSaveSurvey}
                            className="flex flex-col space-y-6"
                        >
                            <Box className="flex flex-row items-center w-full">
                                <Box className="flex flex-col space-y-1 w-1/2">
                                    <Typography variant="h6">Title</Typography>
                                    <TextField
                                        value={survey.title}
                                        onChange={(e) =>
                                            setSurvey((prevSurvey) => ({
                                                ...prevSurvey,
                                                title: e.target.value,
                                            }))
                                        }
                                        label="Title"
                                        variant="outlined"
                                        required
                                    />
                                </Box>
                                <Box className="flex flex-col space-y-1 justify-end ml-auto">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={survey.public}
                                                onChange={(e) =>
                                                    setSurvey((prevSurvey) => ({
                                                        ...prevSurvey,
                                                        public: e.target.checked,
                                                    }))
                                                }
                                            />
                                        }
                                        label={survey.public ? "Public" : "Private"}
                                    />
                                    {survey.public ? null : (
                                        <Typography variant="subtitle1">
                                            Pin Code: {survey.pinCode}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box className="flex flex-col space-y-1">
                                <Typography variant="h6">Description (optional)</Typography>
                                <TextField
                                    value={survey.description}
                                    onChange={(e) =>
                                        setSurvey((prevSurvey) => ({
                                            ...prevSurvey,
                                            description: e.target.value,
                                        }))
                                    }
                                    variant="outlined"
                                    multiline
                                    minRows={2}
                                    fullWidth
                                />
                            </Box>
                            <Box className="flex flex-col space-y-1">
                                <Typography variant="h6">Deadline </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker 
                                            name="deadline"
                                            id="deadlineID"
                                            minDateTime={now}
                                            value={deadline}
                                            label="Deadline *"
                                            onChange={handleDateChange}
                                            // timezone="system"
                                        />
                                    </LocalizationProvider>
                            </Box>
                            <Box className="flex flex-col space-y-2">
                                <Typography variant="h6">Questions</Typography>
                                {survey.questions.map((question, index) => {
                                    return (
                                        <Accordion
                                            key={index}
                                            defaultExpanded={index === survey.questions.length - 1}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography component="span">
                                                    Question {index + 1}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box className="flex flex-col space-y-4">
                                                    <FormControl className="w-1/3">
                                                        <InputLabel id="question-type-label">
                                                            Question Type
                                                        </InputLabel>
                                                        <Select
                                                            labelId="question-type-label"
                                                            value={question.questionType}
                                                            label="Question Type"
                                                            onChange={(e) =>
                                                                handleQuestionTypeChange(
                                                                    question.id,
                                                                    e.target.value,
                                                                )
                                                            }
                                                        >
                                                            <MenuItem value="text">Text</MenuItem>
                                                            <MenuItem value="multiple">
                                                                Multiple Choice
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <TextField
                                                        fullWidth
                                                        value={question.questionText}
                                                        onChange={(e) =>
                                                            handleQuestionTextChange(
                                                                question.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        variant="outlined"
                                                        label="Question Text"
                                                        multiline
                                                    />
                                                    {question.questionType === "multiple" ? (
                                                        <Box className="flex flex-col space-y-2">
                                                            {question.options.map(
                                                                (option, index) => {
                                                                    return (
                                                                        <Box
                                                                            key={index}
                                                                            className="flex flex-row items-center space-x-2 w-full"
                                                                        >
                                                                            <TextField
                                                                                value={option}
                                                                                onChange={(e) => {
                                                                                    handleOptionTextChange(
                                                                                        question.id,
                                                                                        index,
                                                                                        e.target
                                                                                            .value,
                                                                                    );
                                                                                }}
                                                                                className="flex-grow"
                                                                                variant="outlined"
                                                                                label={`Option ${index + 1}`}
                                                                            />
                                                                            <IconButton
                                                                                onClick={() =>
                                                                                    handleDeleteOption(
                                                                                        question.id,
                                                                                        index,
                                                                                    )
                                                                                }
                                                                                color="error"
                                                                                aria-label="delete option"
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </Box>
                                                                    );
                                                                },
                                                            )}
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                fullWidth
                                                                onClick={() =>
                                                                    handleAddOption(question.id)
                                                                }
                                                            >
                                                                + Add Option
                                                            </Button>
                                                        </Box>
                                                    ) : null}
                                                </Box>
                                            </AccordionDetails>
                                            <AccordionActions>
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteQuestion(question.id)
                                                    }
                                                    color="error"
                                                >
                                                    Delete Question
                                                </Button>
                                            </AccordionActions>
                                        </Accordion>
                                    );
                                })}
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    onClick={handleAddQuestion}
                                >
                                    + Add New Question
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <DeleteSurveyDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDeleteSurvey}
            />
        </>
    );
}

export default SurveyBuilder;
