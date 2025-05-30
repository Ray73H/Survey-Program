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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { getSurveyById, updateSurvey, deleteSurvey } from "../services/surveys";
import { useParams } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { DeleteSurveyDialog } from "../components/DeleteSurveyDialog";
import dayjs from "dayjs";

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
        deadline: Date.now,
        published: false
    });
    const [originalSurvey, setOriginalSurvey] = React.useState(survey);
    const [isChanged, setIsChanged] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [datePickerVal, setDatePickerVal] = React.useState(dayjs());

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

    const handleDeadlineChange = (newDeadline) => {
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            deadline : newDeadline,
            }
        ))
    }

    const handlePublish = () => {
        // add unpublish version
        setSurvey((prevSurvey) => ({
            ...prevSurvey,
            published : true
        }))
    }

    const handleSaveSurvey = async (e) => {
        e.preventDefault();

        const surveyData = {
            userId: user.userId,
            ...survey,
        };

        const data = await updateSurvey(surveyId, surveyData);
        setOriginalSurvey(survey);
        console.log(data);
    };

    const handleDeleteSurvey = async () => {
        await deleteSurvey(surveyId);
        setOpenDeleteDialog(false);
        navigate("/experimenter");
    };

    return (
        <>
            <Box className="p-4">
                <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h5" fontWeight="bold">
                        Survey Builder
                    </Typography>
                    <Box className="space-x-2">
                        <Button
                            color="secondary"
                            onClick={handlePublish}
                            variant="outlined"
                            >
                                Publish Survey
                        </Button>
                        <Button
                            type="submit"
                            form="survey-form"
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </Button>
                        <Button
                            onClick={() => setOpenDeleteDialog(true)}
                            variant="outlined"
                            color="error"
                        >
                            Delete Survey
                        </Button>
                    </Box>
                </Box>

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
                                        <DatePicker
                                        label="Pick a date"
                                        value={datePickerVal}
                                        onChange={(newValue) => {
                                            setDatePickerVal(newValue);
                                            setSurvey({...survey, deadline: newValue});
                                          }}
                                        renderInput={(params) => <TextField {...params} />}
                                        inputFormat="DD/MM/YYYY"
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
