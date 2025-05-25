import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import { updateSurvey } from "../services/surveys";

const now = dayjs();

export function PublishSurveyDialog({ open, onClose, survey, setSurvey, surveyId, userId}) {
    const [errMsg, setErrMsg] = useState("");
    const [date, setDate] = useState(dayjs().add(7, 'day'));
    const [pinCode, setPinCode] = useState("")

    useEffect(() => {
            setErrMsg("");
        }, [survey])

    const handlePublishSurvey = async (e) => {
        e.preventDefault();

        // No title
        if (!survey.title) {
            setErrMsg("The survey must have a title.");
            return;
        }

        // No questions
        if (survey.questions.length === 0) {
            setErrMsg("The survey has no questions");
            return;
        }
        
        // No deadline
        if (!survey.deadline) {
            setErrMsg("Deadline required");
            return;
        }

        try {
            const surveyData = {
                userId: userId,
                published: true,
                ...survey,
            };

            const data = await updateSurvey(surveyId, surveyData);
            console.log(data.data?.pinCode)

            setPinCode(data.data?.pinCode)
            setSurvey((prevSurvey) => ({
                    ...prevSurvey,
                    published: true,
            }))
            // handlePublishedSurvey(data.data?.pinCode);
            // Open succesful published survey dialog - Giving a pin code (URL? How are people supposed to share the survey - in particular with guest users)
        } catch (err) {
            let serverMessage = "";
            if (!err?.response) {
                setErrMsg("No Server Response")
            } else if (err.response?.status===404) {
                serverMessage = err.response?.data?.message ?? "Survey not found";
                setErrMsg(serverMessage);
            } else {
                serverMessage = err.response?.data?.message ?? "Internal server error";
                setErrMsg(serverMessage);
            }
        }
    }

    const handleDateChange = ((newDate) => {
        setDate(newDate);
        setSurvey((prevSurvey) => ({
                ...prevSurvey,
                deadline: newDate.toJSON(),
        }))
    })

    // const handlePublishedSurvey = ((pin) => {
    //     setPinCode()
    //     setSurvey((prevSurvey) => ({
    //             ...prevSurvey,
    //             published: true,
    //     }))
    // })


    return (
        <>
            { !survey.published ? 
            <Dialog 
                open={open} 
                onClose={onClose}
                slotProps={{
                  paper: {
                    component: 'form',
                    onSubmit: handlePublishSurvey,
                  },
                }}
            >
                <DialogTitle>Publish Survey</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To publish this survey, please set a dealine and choose if the survey should be public or private.
                    </DialogContentText>
                    <Box sx={{m: 3, display: "flex", 
                              flexDirection: "row",
                              alignItems: "left",
                              justifyContent: "space-between"}}>
                        <FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker 
                                    name="deadline"
                                    id="deadlineID"
                                    minDateTime={now}
                                    value={date}
                                    label="Deadline *"
                                    onChange={handleDateChange}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={survey.public}
                                        onChange={(e) => 
                                                    setSurvey((prevSurvey) => ({
                                                            ...prevSurvey,
                                                            public: e.target.checked,
                                                    }))}
                                    />
                                }
                                label={survey.public ? "Public" : "Private"}
                            />
                        </FormControl>
                    </Box>
                    {errMsg && 
                        <Alert sx={{width: "100%"}} severity="error" aria-live="assertive">{errMsg}</Alert>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button color="primary" type="submit">Publish</Button>
                </DialogActions>
            </Dialog>
            :
            <Dialog
                open={open} 
                onClose={onClose}
            >
                <DialogTitle>Your survey is now published!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your pin code is: {pinCode}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            }
        </>
    );
}
