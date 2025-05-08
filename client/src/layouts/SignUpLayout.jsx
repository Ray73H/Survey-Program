import { Box, Paper, Typography } from "@mui/material";
import { Outlet, useLocation  } from "react-router-dom";

function SignUpLayout() {
    const location = useLocation();
    const user = location.state?.user || "unknown";

    return (
        <div className="flex">
            <Paper elevation={3} className="p-6 w-full max-w-3xl">
                <Typography variant="h2" gutterBottom>
                    Sign up as {user} 
                </Typography>
                <Box
                    component="signInForm"
                    id="signin-form"
                    onSubmit={ValidateSignUpInfo}
                    className="flex flex-col space-y-6"
                >

                </Box>
            </Paper>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default SignUpLayout;