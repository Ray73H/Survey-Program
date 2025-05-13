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
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";

export default function ExperimenteeLogin() {
    const { setEmailContext, setNameContext, setAccountTypeContext } = useUserContext();

    const handleLogin = async () => {
        const userData = {
            email: "temp",
            password: "temp",
        };
        const data = await loginUser(userData);
        localStorage.setItem(data.token);
        setEmailContext(data.user.email);
        setNameContext(data.user.name);
        setAccountTypeContext(data.user.accountType);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
                Experimentee Login
            </Typography>
            <div
                id="switchbuttons"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vh",
                }}
            >
                <Button variant="contained" style={{ margin: "5px", backgroundColor: "#394F87" }}>
                    Log In as Experimenter
                </Button>
                <Button variant="contained" style={{ margin: "5px", backgroundColor: "#000000" }}>
                    Log In as Super User
                </Button>
            </div>

            <div
                id="emailfield"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
                    width: "80vh",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    E-mail
                </Typography>

                <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                    style={{ height: "10vh", width: "100%" }}
                />

                <Typography variant="h5" gutterBottom>
                    Password
                </Typography>

                <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                    style={{ height: "10vh", width: "100%" }}
                />
                <Button variant="contained">Log in</Button>
            </div>

            <div
                id="signupfield"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "80vh",
                }}
            >
                <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
                    Don't have an account?
                </Typography>
                <Button variant="contained">Sign Up</Button>
            </div>
        </div>
    );
}
