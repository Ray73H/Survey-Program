import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";

const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function SignUp(view) {
    const userRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState("");

    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordMatch, setShowPasswordMatch] = useState(false);

    const navigate = useNavigate();

    const { setUser } = useUserContext();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        errRef.current?.focus();
    }, [errRef]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEXP.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg("");
    }, [email, pwd, matchPwd]);

    const mode =
        view.user === "experimenter" || view.user === "experimentee" ? view.user : "unknown";
    const oppositeMode = mode === "experimenter" ? "experimentee" : "experimenter";

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordMatch = () => setShowPasswordMatch((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    const ValidateSignUpInfo = async (e) => {
        e.preventDefault();
        const v1 = EMAIL_REGEXP.test(email);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        // Send info off to validation in the backend
        try {
            const userData = {
                email,
                password: pwd,
                name,
                accountType: mode,
            };
            const response = await registerUser(userData);
            console.log(response);
            sessionStorage.setItem("authToken", response.data.token);
            const decoded = jwtDecode(response.data.token);
            setUser(decoded);
            navigate("/");
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else {
                console.log(err.response?.status);
                switch (err.response?.status) {
                    case 400:
                        setErrMsg("There is already an account with the provided email");
                        break;
                    case 500:
                        const serverMessage =
                            err.response?.data?.message ?? "An unknown server error occurred.";
                        setErrMsg(serverMessage);
                        break;
                    default:
                        setErrMsg("Registration Failed");
                }
            }
        }
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
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "75ch",
                }}
            >
                <Typography variant="h3" gutterBottom>
                    Sign up as {mode}
                </Typography>
                <Button
                    variant="contained"
                    color="tertary"
                    size="small"
                    onClick={handleSignUpSwitch}
                >
                    Sign up as {oppositeMode}
                </Button>
                {errMsg && (
                    <Alert
                        ref={errRef}
                        sx={{ mt: 3, width: "45ch" }}
                        severity="error"
                        aria-live="assertive"
                    >
                        {errMsg}
                    </Alert>
                )}
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "50vh",
                    }}
                >
                    <FormControl variant="standard" sx={{ mt: 8, width: "45ch" }}>
                        <InputLabel htmlFor="name">Full Name</InputLabel>
                        <Input
                            type="text"
                            id="name"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            required
                            aria-invalid="false"
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ mt: 4, width: "45ch" }}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        {emailFocus && !validEmail && (
                            <FormHelperText id="emailnote">
                                <InfoOutlineIcon fontSize="small" /> Invalid Email
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl sx={{ mt: 4, width: "45ch" }} variant="standard">
                        <InputLabel htmlFor="pwd">Password</InputLabel>
                        <Input
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            id="pwd"
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            type={showPassword ? "text" : "password"}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
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
                                        // edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            value={pwd}
                        />
                        {(pwdFocus || pwd !== "") && !validPwd && (
                            <FormHelperText id="pwdnote">
                                <InfoOutlineIcon fontSize="small" /> 8 to 24 characters.
                                <br />
                                Must include uppercase and lowercase letters, a number and a special
                                character.
                                <br />
                                Allowed special characters:{" "}
                                <span aria-label="exclamation mark">!</span>{" "}
                                <span aria-label="at symbol">@</span>{" "}
                                <span aria-label="hashtag">#</span>{" "}
                                <span aria-label="dollar sign">$</span>{" "}
                                <span aria-label="percent">%</span>
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl sx={{ mt: 4, width: "45ch" }} variant="standard">
                        <InputLabel htmlFor="pwdMatch">Confirm Password</InputLabel>
                        <Input
                            id="pwdMatch"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            type={showPasswordMatch ? "text" : "password"}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPasswordMatch
                                                ? "hide the password"
                                                : "display the password"
                                        }
                                        onClick={handleClickShowPasswordMatch}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        // edge="end"
                                    >
                                        {showPasswordMatch ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            value={matchPwd}
                        />
                        {(matchFocus || matchPwd !== "") && !validMatch && (
                            <FormHelperText id="confirmnote">
                                <InfoOutlineIcon fontSize="small" /> Must match the first password
                                input field.
                            </FormHelperText>
                        )}
                    </FormControl>
                    {!validEmail || !validPwd || !validMatch || !name ? (
                        <Tooltip title="Fill out the entire form" placement="bottom">
                            <span style={{ margin: "32px" }}>
                                <Button
                                    type="submit"
                                    form="survey-form"
                                    variant="contained"
                                    color="primary"
                                    disabled
                                    onClick={ValidateSignUpInfo}
                                >
                                    Sign Up
                                </Button>
                            </span>
                        </Tooltip>
                    ) : (
                        <Button
                            type="submit"
                            form="survey-form"
                            variant="contained"
                            color="primary"
                            sx={{ m: 4 }}
                            onClick={ValidateSignUpInfo}
                        >
                            Sign Up
                        </Button>
                    )}
                </Box>
                <Box
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10 }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Already have an account?
                    </Typography>
                    <Button variant="contained" color="tertary" onClick={handleLogInClick}>
                        LogIn
                    </Button>
                </Box>
            </Paper>
        </div>
    );
}

export default SignUp;
