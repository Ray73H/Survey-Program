import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errMsgEmail, setErrMsgEmail] = useState("");
    const [errMsgPwd, setErrMsgPwd] = useState("");
    const [errMsgServer, setErrMsgServer] = useState("");

    const { setUser } = useUserContext();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const userData = {
            email,
            password,
        };

        try {
            const response = await loginUser(userData);
            sessionStorage.setItem("authToken", response.data.token);
            const decoded = jwtDecode(response.data.token);
            setUser(decoded);
            navigate("/");
        } catch (error) {
            //handling of wrong login credentials
            if (error.response) {
                setErrMsgPwd(error.response.data.message);
            }
        }
    };

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

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const signUpClick = () => {
        navigate("/signup");
    };

    const handleContinueAsGuest = () => {
        const guestSessionId = uuidv4();
        const expiresAt = Date.now() + 6 * 60 * 60 * 1000;
        sessionStorage.setItem("guestSessionId", guestSessionId);
        sessionStorage.setItem("guestSessionExpires", expiresAt.toString());
        setUser({
            userId: guestSessionId,
            email: "",
            name: "Guest",
            accountType: "experimentee",
            guest: true,
        });
        navigate("/");
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
            {errMsgServer && (
                <Alert sx={{ width: "45ch" }} severity="error" aria-live="assertive">
                    {errMsgServer}
                </Alert>
            )}
            <Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
                    width: "80vh",
                }}
                onSubmit={handleLogin}
            >
                <label htmlFor="emailfield">
                    <Typography variant="h5" gutterBottom>
                        E-mail
                    </Typography>
                </label>
                <FormControl
                    sx={{ height: "10vh", width: "100%" }}
                    variant="outlined"
                    error={errMsgEmail}
                >
                    <OutlinedInput
                        id="emailfield"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errMsgEmail && (
                        <FormHelperText>
                            <ErrorOutlineIcon fontSize="small" /> {errMsgEmail}
                        </FormHelperText>
                    )}
                </FormControl>
                <label htmlFor="pwdfield">
                    <Typography variant="h5" gutterBottom>
                        Password
                    </Typography>
                </label>
                <FormControl
                    sx={{ height: "10vh", width: "100%" }}
                    variant="outlined"
                    error={errMsgPwd}
                >
                    <OutlinedInput
                        id="pwdfield"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? "hide the password" : "display the password"
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errMsgPwd && (
                        <FormHelperText>
                            <ErrorOutlineIcon fontSize="small" /> {errMsgPwd}
                        </FormHelperText>
                    )}
                </FormControl>
                <Button type="submit" variant="contained" color="secondary">
                    Log in
                </Button>
            </Box>
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

                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={handleContinueAsGuest}
                >
                    Continue as Guest
                </Button>
            </div>
        </div>
    );
}
