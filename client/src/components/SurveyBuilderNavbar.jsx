import Snackbar from '@mui/material/Snackbar';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';

export default function SurveyBuilderNavbar({onDeleteDialogChange, onPublishDialogChange, onSave, saving, onSavingClose}) {
    
    return (
        <>
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h5" fontWeight="bold">
                    Survey Builder
                </Typography>
                <Box className="space-x-2">
                    <Button
                        onClick={onPublishDialogChange}
                        type="submit"
                        variant="contained"
                        color="success"
                        >
                        Publish
                    </Button>
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
                        open={saving}
                        onClose={onSavingClose}
                        autoHideDuration={4000}
                        message="Survey Saved"
                        key={'bottomright'}
                    >
                        <Alert
                          onClose={onSavingClose}
                          severity="success"
                          variant="outlined"
                          sx={{ width: '100%' }}
                        >
                          Survey Saved
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