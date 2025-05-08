import React from "react";
import { Box, Paper, Typography } from "@mui/material";
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

    const mode = (user.user==="experimenter" || user.user==="experimentee") ? user.user : "unknown";

    const handleClickShowPassword = () => setShowPassword((show) => !show)

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

    return (
        <div className="flex" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centrerer vandret
                alignItems: 'center',    // Centrerer lodret
                minHeight: '50vh',       // Sikrer at Box fylder mindst hele skærmens højde (valgfrit)
              }}
            >
                <Paper elevation={3} sx={{ p: 4}}>
                    <Typography variant="h2" gutterBottom>
                        Sign up as {mode} 
                    </Typography>
                        <div>
                            <TextField
                                required
                                id="outlined-required"
                                label="Username"
                                sx={{display: 'flex', m: 4, width: '30ch' }}
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
                        </div>
                </Paper>
            </Box>
        </div>
    );
}

export default SignUp;