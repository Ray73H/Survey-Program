import React from "react";
import Snackbar from '@mui/material/Snackbar';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';

export default function SurveyBuilderNavbar({onDeleteDialogChange, handlePublish, published, onSave, showAlert, onCloseAlert, updateSucces, serverMsg}) {
    
    return (
        <>
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h5" fontWeight="bold">
                    Survey Builder
                </Typography>
                <Box className="space-x-2">
                    {!published && 
                    <Button
                        color="success"
                        onClick={handlePublish}
                        variant="contained"
                        >
                            Publish Survey
                    </Button>}
                    {published && 
                    <Button
                        color="error"
                        onClick={handlePublish}
                        variant="contained"
                        >
                            Unpublish Survey
                    </Button>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={onSave}
                        >
                        Save
                    </Button>
                    <Snackbar 
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        open={showAlert}
                        onClose={onCloseAlert}
                        autoHideDuration={4000}
                        message={updateSucces ? "Survey Saved" : serverMsg}
                        key={'saving'}
                    >
                        <Alert
                          onClose={onCloseAlert}
                          severity={updateSucces ? "success" : "error"}
                          variant="outlined"
                          sx={{ width: '100%' }}
                        >
                          {serverMsg}
                        </Alert>
                    </Snackbar>
                    <Button
                        onClick={onDeleteDialogChange}
                        variant="outlined"
                        color="error"
                        >
                        Delete Survey
                    </Button>
                </Box>
            </Box> 
            <Divider className="mb-4" />
        </>
    );

}