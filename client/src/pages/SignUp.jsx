import React, { useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";

function SignUp(view) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [title, setTitle] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUserContext();

    const mode =
        view.user === "experimenter" || view.user === "experimentee" ? view.user : "unknown";
    const oppositeMode = mode === "experimenter" ? "experimentee" : "experimenter";

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordRepeat = () => setShowPasswordRepeat((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    const ValidateSignUpInfo = async () => {
        // Send info off to validation in the backend
        const userData = {
            email,
            password,
            name,
            accountType: mode,
        };
        const response = await registerUser(userData);
        console.log(response);
        sessionStorage.setItem("authToken", response.data.token);
        const decoded = jwtDecode(response.data.token);
        setUser(decoded);
        navigate("/");
    };

    const handleLogInClick = () => {
        navigate("/login");
    };

    const handleSignUpSwitch = () => {
        const url = "/signup/" + oppositeMode;
        navigate(url);
    };

    return (
        <div
            className="flex"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "15vh",
            }}
        >
            <Box
                component="form"
                autoComplete="off"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        Sign up as {mode}
                    </Typography>
                    <div>
                        <Box
                            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                            <Button
                                variant="contained"
                                color="tertary"
                                size="small"
                                onClick={handleSignUpSwitch}
                            >
                                Sign up as {oppositeMode}
                            </Button>
                        </Box>
                        <TextField
                            required
                            id="outlined-required"
                            label="Name"
                            sx={{ display: "flex", m: 4, mt: 8, width: "30ch" }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            sx={{ display: "flex", m: 4, width: "30ch" }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormControl
                            sx={{ display: "flex", m: 4, width: "30ch" }}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">
                                Password *
                            </InputLabel>
                            <OutlinedInput
                                required
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword
                                                    ? "hide the password"
                                                    : "display the password"
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <FormControl
                            sx={{ display: "flex", m: 4, width: "30ch" }}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-repeat-password">
                                Confirm Password *
                            </InputLabel>
                            <OutlinedInput
                                required
                                id="outlined-adornment-repeat-password"
                                type={showPasswordRepeat ? "text" : "password"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPasswordRepeat
                                                    ? "hide the password"
                                                    : "display the password"
                                            }
                                            onClick={handleClickShowPasswordRepeat}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPasswordRepeat ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                form="survey-form"
                                variant="contained"
                                color="primary"
                                sx={{
                                    m: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={ValidateSignUpInfo}
                            >
                                Sign up
                            </Button>
                        </FormControl>
                        <Box
                            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                Already have an account?
                            </Typography>
                            <Button variant="contained" color="tertary" onClick={handleLogInClick}>
                                LogIn
                            </Button>
                        </Box>
                    </div>
                </Paper>
            </Box>
        </div>
    );
}

export default SignUp;
