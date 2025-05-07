import React from "react";
import { Box, Button, Divider, Paper, TextField, Typography } from "@mui/material";
import { FormControlLabel, Switch } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

function SurveyBuilder() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [questions, setQuestions] = React.useState([]);
    const [isPublic, setIsPublic] = React.useState(false);

    const handleAddQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            {
                questionType: "text",
                id: Date.now(),
                questionText: "",
                options: [],
            },
        ]);
    };

    const handleDeleteQuestion = (id) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const handleQuestionTextChange = (id, newQuestionText) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, questionText: newQuestionText } : q)),
        );
    };

    const handleQuestionTypeChange = (id, newQuestionType) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id
                    ? {
                          ...q,
                          questionType: newQuestionType,
                          options: newQuestionType === "text" ? [] : q.options,
                      }
                    : q,
            ),
        );
    };

    const handleAddOption = (id) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, options: [...q.options, ""] } : q)),
        );
    };

    const handleDeleteOption = (id, optionIndex) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) } : q,
            ),
        );
    };

    const handleOptionTextChange = (id, optionIndex, newOptionText) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id
                    ? {
                          ...q,
                          options: q.options.map((opt, i) =>
                              i === optionIndex ? newOptionText : opt,
                          ),
                      }
                    : q,
            ),
        );
    };

    const handleSave = (e) => {
        e.preventDefault();

        const surveyData = {
            title,
            description,
            isPublic,
        };
    };

    return (
        <Box className="p-4">
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h5" fontWeight="bold">
                    Survey Builder
                </Typography>
                <Box className="space-x-2">
                    <Button type="submit" form="survey-form" variant="contained" color="primary">
                        Save
                    </Button>
                    <Button variant="outlined" color="error">
                        Cancel
                    </Button>
                </Box>
            </Box>

            <Divider className="mb-4" />

            <Box className="flex justify-center p-10">
                <Paper elevation={3} className="p-6 w-full max-w-3xl">
                    <Box
                        component="form"
                        id="survey-form"
                        onSubmit={handleSave}
                        className="flex flex-col space-y-6"
                    >
                        <Box className="flex flex-row items-center w-full">
                            <Box className="flex flex-col space-y-1 w-1/2">
                                <Typography variant="h6">Title</Typography>
                                <TextField
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    variant="outlined"
                                    required
                                />
                            </Box>
                            <Box className="ml-auto">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                        />
                                    }
                                    label={isPublic ? "Public" : "Private"}
                                />
                            </Box>
                        </Box>
                        <Box className="flex flex-col space-y-1">
                            <Typography variant="h6">Description (optional)</Typography>
                            <TextField
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                variant="outlined"
                                multiline
                                minRows={2}
                                fullWidth
                            />
                        </Box>
                        <Box className="flex flex-col space-y-2">
                            <Typography variant="h6">Questions</Typography>
                            {questions.map((question, index) => {
                                return (
                                    <Accordion
                                        key={index}
                                        defaultExpanded={index === questions.length - 1}
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
                                                        {question.options.map((option, index) => {
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
                                                                                e.target.value,
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
                                                        })}
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
                                                onClick={() => handleDeleteQuestion(question.id)}
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
    );
}

export default SurveyBuilder;
