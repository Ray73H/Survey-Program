import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useNavigate  } from "react-router-dom";

function SignUp(user) {
    const [title, setTitle] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = React.useState(false);
    const navigate = useNavigate()

    const mode = (user.user==="experimenter" || user.user==="experimentee") ? user.user : "unknown";
    const oppositeMode = mode==="experimenter" ? "experimentee" : "experimenter"

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleClickShowPasswordRepeat = () => setShowPasswordRepeat((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    
      const handleMouseUpPassword = (event) => {
        event.preventDefault();
      };
    const ValidateSignUpInfo = () => {
        // Send info off to validation in the backend
        return;
    };

    const handleLogInClick = () => {
      navigate('/login');
    };

    const handleSignUpSwitch = () => {
      const url = '/signup/'+oppositeMode 
      navigate(url);
    };
  

    return (
        <div className="flex" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15vh'}}>
            <Box
              component="form"
              autoComplete="off"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',  
                minHeight: '50vh',    
              }}
            >
                <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="h3" gutterBottom>
                        Sign up as {mode} 
                    </Typography>
                        <div>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button variant="contained" color="tertary" size="small" onClick={handleSignUpSwitch}>
                                Sign up as {oppositeMode}
                            </Button>
                          </Box>
                          <TextField
                              required
                              id="outlined-required"
                              label="Username"
                              sx={{display: 'flex', m: 4, mt: 8, width: '30ch' }}
                          />
                          <FormControl sx={{ display: 'flex', m: 4, width: '30ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                            <OutlinedInput
                              required
                              id="outlined-adornment-password"
                              type={showPassword ? 'text' : 'password'}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label={
                                      showPassword ? 'hide the password' : 'display the password'
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
                            />
                          </FormControl>
                          <FormControl sx={{ display: 'flex', m: 4, width: '30ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-repeat-password">Repeat Password *</InputLabel>
                            <OutlinedInput
                              required
                              id="outlined-adornment-repeat-password"
                              type={showPasswordRepeat ? 'text' : 'password'}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label={
                                      showPasswordRepeat ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPasswordRepeat}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                  >
                                    {showPasswordRepeat ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Password"
                            />
                            <Button 
                              type="submit" 
                              form="survey-form" 
                              variant="contained" 
                              color="primary"
                              sx={{m: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
                              onClick={ValidateSignUpInfo}
                            >
                              Sign up
                            </Button>
                          </FormControl>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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