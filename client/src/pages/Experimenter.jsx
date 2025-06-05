import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Menu,
    MenuItem,
    CardMedia,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import {
    createSurvey,
    deleteSurvey,
    exportSurvey,
    getOngoingSurveys,
    getUnpublishedSurveys,
    importSurvey,
} from "../services/surveys";
import { DeleteSurveyDialog } from "../components/DeleteSurveyDialog";

const Experimenter = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuSurveyId, setMenuSurveyId] = useState(null);
    const [ongoingSurveys, setOngoingSurveys] = useState([]);
    const [unpublishedSurveys, setUnpublishedSurveys] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteSurveyId, setDeleteSurveyId] = useState("");
    const navigate = useNavigate();
    const { user } = useUserContext();

    const fetchOngoingSurveys = async () => {
        const response = await getOngoingSurveys(user.userId);
        setOngoingSurveys(response.data);
    };

    const fetchUnpublishedSurveys = async () => {
        const response = await getUnpublishedSurveys(user.userId);
        setUnpublishedSurveys(response.data);
    };

    const fetchSurveys = async () => {
        const response = await getUnpublishedSurveys(user.userId);
        setSurveys(response.data);
    };

    useEffect(() => {
        fetchSurveys();
        fetchOngoingSurveys();
        fetchUnpublishedSurveys();
    }, [user.userId]);

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuSurveyId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuSurveyId(null);
    };

    const handleCreateSurvey = async () => {
        const surveyData = { userId: user.userId, author: user.name };
        const response = await createSurvey(surveyData);
        const surveyId = response.data._id;
        navigate(`/survey-builder/${surveyId}`);
    };

    const handleDeleteSurvey = async () => {
        await deleteSurvey(deleteSurveyId);
        setOpenDeleteDialog(false);
        fetchSurveys();
    };

    const handleFileSelect = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                const surveyData = await importSurvey(user.userId, file);
                fetchSurveys();
            }
        } catch (error) {
            console.error("Failed to import survey:", error);
            alert("An error occurred while importing the survey. Please try again.");
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        try {
            const file = event.target.files[0];
            if (file) {
                await importSurvey(user.userId, file);
                fetchSurveys();
            }
        } catch (error) {
            console.error("Failed to import survey:", error);
            alert("An error occurred while importing the survey. Please try again.");
        }
    };

    return (
        <>
            <Box sx={{ padding: 4, flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                    Welcome {user.name}
                </Typography>

                <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                    Create New Survey
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
                        onClick={handleCreateSurvey}
                    >
                        <AddIcon sx={{ fontSize: 40 }} />
                    </Box>
                </Box>

                <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                    Ongoing Surveys
                </Typography>
                {(ongoingSurveys == null || ongoingSurveys.length === 0) && (
                    <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>
                        No ongoing surveys. Publish a survey to start it.
                    </Typography>
                )}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        overflowX: "auto",
                        pb: 2,
                        scrollSnapType: "x mandatory",
                    }}
                >
                    {ongoingSurveys.map((survey) => (
                        <Card
                            key={survey._id}
                            sx={{
                                minWidth: 280,
                                flexShrink: 0,
                                scrollSnapAlign: "start",
                                position: "relative",
                            }}
                        >
                            <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, survey._id)}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    zIndex: 1,
                                }}
                            >
                                <MoreVertIcon />
                            </IconButton>

                            <CardMedia
                                sx={{ height: 140, backgroundColor: "#ccc" }}
                                image=""
                                title="Survey Preview"
                            />

                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {survey.author} •{" "}
                                        {new Date(survey.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </Typography>
                                    {survey.imported && (
                                        <Chip
                                            size="small"
                                            icon={<FileUploadIcon />}
                                            label="Imported"
                                            color="info"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                                <Typography variant="h6">{survey.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {survey.description}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: "space-between" }}>
                                <Button
                                    onClick={() => navigate(`/survey-builder/${survey._id}`)}
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                >
                                    Edit
                                </Button>
                                <IconButton
                                    onClick={() => {
                                        setOpenDeleteDialog(true);
                                        setDeleteSurveyId(survey._id);
                                    }}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>

                            {menuSurveyId === survey._id && (
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            exportSurvey(survey._id);
                                            handleMenuClose();
                                        }}
                                    >
                                        Export Survey
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            navigate(`/survey-preview/${menuSurveyId}`);
                                            handleMenuClose();
                                        }}
                                    >
                                        Preview
                                    </MenuItem>
                                </Menu>
                            )}
                        </Card>
                    ))}
                </Box>

                <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                    Unpublished Surveys
                </Typography>
                {(unpublishedSurveys == null || unpublishedSurveys.length === 0) && (
                    <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>
                        No unpublished surveys. Create a survey to start editing.
                    </Typography>
                )}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        overflowX: "auto",
                        pb: 2,
                        scrollSnapType: "x mandatory",
                    }}
                >
                    {unpublishedSurveys.map((survey) => (
                        <Card
                            key={survey._id}
                            sx={{
                                minWidth: 280,
                                flexShrink: 0,
                                scrollSnapAlign: "start",
                                position: "relative",
                            }}
                        >
                            <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, survey._id)}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    zIndex: 1,
                                }}
                            >
                                <MoreVertIcon />
                            </IconButton>

                            <CardMedia
                                sx={{ height: 140, backgroundColor: "#ccc" }}
                                image=""
                                title="Survey Preview"
                            />

                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {survey.author} •{" "}
                                        {new Date(survey.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </Typography>
                                    {survey.imported && (
                                        <Chip
                                            size="small"
                                            icon={<FileUploadIcon />}
                                            label="Imported"
                                            color="info"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                                <Typography variant="h6">{survey.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {survey.description}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: "space-between" }}>
                                <Button
                                    onClick={() => navigate(`/survey-builder/${survey._id}`)}
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                >
                                    Edit
                                </Button>
                                <IconButton
                                    onClick={() => {
                                        setOpenDeleteDialog(true);
                                        setDeleteSurveyId(survey._id);
                                    }}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>

                            {menuSurveyId === survey._id && (
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            exportSurvey(survey._id);
                                            handleMenuClose();
                                        }}
                                    >
                                        Export Survey
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            navigate(`/survey-preview/${menuSurveyId}`);
                                            handleMenuClose();
                                        }}
                                    >
                                        Preview
                                    </MenuItem>
                                </Menu>
                            )}
                        </Card>
                    ))}
                </Box>

                <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                    Import Survey
                </Typography>

                <Box
                    sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 2,
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "#fafafa",
                        cursor: "pointer",
                    }}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById("file-input").click()}
                >
                    <input
                        type="file"
                        id="file-input"
                        accept=".json"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                    />
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#666", mb: 2 }} />
                    <Typography>Drag and drop a survey file here, or click to select</Typography>
                </Box>
            </Box>

            <DeleteSurveyDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setDeleteSurveyId("");
                }}
                onConfirm={handleDeleteSurvey}
            />
        </>
    );
};

export default Experimenter;
