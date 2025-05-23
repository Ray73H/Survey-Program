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
import { jwtDecode } from "jwt-decode";


export default function Login() {
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const userData = {
            email,
            password,
        };
        const response = await loginUser(userData);
        sessionStorage.setItem("authToken", response.data.token);
        const decoded = jwtDecode(response.data.token);
        setUser(decoded);
        navigate("/");
    };

    const loginCatch = async () => {
        try {
            await handleLogin()
        }
        catch {
            document.getElementById('password_field').value = ""
            document.getElementById('wrong_pass').style = {opacity: 1}
        }
    };

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    // const mode =
    //     user.user === "experimenter" || user.user === "experimentee" || user.user == "superuser"
    //         ? user.user
    //         : "unknown";

    // const leftOpp = mode === "experimentee" ? "experimenter" : "experimentee";
    // const rightOpp = mode === "superuser" ? "experimenter" : "superuser";

    // const modifyTitle = (mode) => {
    //     if (mode === "superuser") {
    //         return "Super User";
    //     }
    //     return mode.charAt(0).toUpperCase() + mode.substring(1);
    // };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordRepeat = () => setShowPasswordRepeat((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const signUpClick = () => {
        navigate("/signup");
    };

    const handleLeftLoginSwitch = () => {
        const url = "/login/" + leftOpp;
        navigate(url);
    };

    const handleRightLoginSwitch = () => {
        const url = "/login/" + rightOpp;
        navigate(url);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
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
                Log In
            </Typography>
            {/* <div
                id="switchbuttons"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vh",
                }}
            >
                <Button
                    variant="contained"
                    style={{ margin: "5px", backgroundColor: "#394F87" }}
                    onClick={handleLeftLoginSwitch}
                >
                    Log In as {modifyTitle(leftOpp)}
                </Button>
                <Button
                    variant="contained"
                    style={{ margin: "5px", backgroundColor: "#000000" }}
                    onClick={handleRightLoginSwitch}
                >
                    Log In as {modifyTitle(rightOpp)}
                </Button>
            </div> */}

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
                    id="email_field"
                    variant="outlined"
                    style={{ height: "10vh", width: "100%" }}
                    value={email}
                    onChange={handleEmailChange}
                />

                <Typography variant="h5" gutterBottom>
                    Password
                </Typography>

                <TextField
                    id="password_field"
                    variant="outlined"
                    style={{ height: "10vh", width: "100%" }}
                    value={password}
                    onChange={handlePasswordChange}
                />
                <Typography id="wrong_pass" variant="subtitle1" gutterBottom color='red' style={{opacity: 0}}>
                    Wrong password. please try again.
                </Typography>
                <Button variant="contained" onClick={loginCatch}>
                    Log in
                </Button>
                
            </div>

            <div
                id="signup_field"
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
                <Button variant="contained" onClick={signUpClick}>
                    Sign Up
                </Button>
            </div>
        </div>
    );
}
