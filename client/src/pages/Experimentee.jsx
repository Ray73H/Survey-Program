import React, { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const surveys = [
    {
        id: 1,
        title: "Survey on Motorbikes 1",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        author: "Max Muster",
        date: "24 Mar 2022",
    },
    {
        id: 2,
        title: "Survey on Motorbikes 2",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        author: "Max Muster",
        date: "24 Mar 2022",
    },
    {
        id: 3,
        title: "Survey on Motorbikes 3",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        author: "Max Muster",
        date: "24 Mar 2022",
    },
];

const Experimentee = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuSurveyId, setMenuSurveyId] = useState(null);
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

    return (
        <Box sx={{ padding: 4, flexGrow: 1 }}>
            <Typography variant="h5" gutterBottom>
                Welcome {user.name}
            </Typography>

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
                >
                </Box>
            </Box>

            <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                View Your Completed Surveys
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
                {surveys.map((survey) => (
                    <Card
                        key={survey.id}
                        sx={{
                            minWidth: 280,
                            flexShrink: 0,
                            scrollSnapAlign: "start",
                            position: "relative", 
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, survey.id)}
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
                            <Typography variant="subtitle2" color="textSecondary">
                                {survey.author} • {survey.date}
                            </Typography>
                            <Typography variant="h6">{survey.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {survey.description}
                            </Typography>
                        </CardContent>

                        <CardActions sx={{ justifyContent: "right" }}>
                            <IconButton color="error">
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>

                        {menuSurveyId === survey.id && (
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose}>Share Survey</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Preview</MenuItem>
                            </Menu>
                        )}
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default Experimentee;
