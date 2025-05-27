import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
} from "@mui/material";
import {
  Container,
  Avatar,
  Divider,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { deleteUser} from "../services/users";
import { DeleteUserDialog } from "../components/DeleteUserDialog";
import { useUserContext } from "../contexts/UserContext";



export default function SettingsExperimenter() {
    const navigate = useNavigate();
    const { user, logout } = useUserContext();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

   
  const handleDeleteUser = async () => {
        try {
          await deleteUser(user.userId);
          alert('User Deleted!')
        } catch (err) {
          console.error('failed to delete', err);
        } finally {
          setOpenDeleteDialog(false);
          logout();
          //navigate("/signup");
        }}

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box mb={2} display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h5">View Profile Details</Typography>
          </Box>
          <Divider/>
          <Box mb={3}>
            <Typography variant="h6">
                User name:
            </Typography>
            <Typography variant="h7">
                {user.name}
            </Typography>
            </Box>
            <Box mb={3}>
             <Typography variant="h6">
                Email:
            </Typography>
            <Typography variant="h7">
                {user.email}
            </Typography>    
            </Box>
            <Box mb={3}>
            <Typography variant="h6">
                Account type:
            </Typography>
            <Typography variant="h7">
                {user.accountType}
            </Typography>  
            </Box>
          <Divider />

          <Box mt={2} textAlign="right">
               <Button
                variant="outlined"
                color="error"
                endIcon={<DeleteIcon />}
                   onClick={() => {
                      setOpenDeleteDialog(true);
                    }} >
                      Delete Account
                 </Button>
          </Box>
            <DeleteUserDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    }}
                onConfirm={handleDeleteUser}
                      />
          </CardContent>
      </Card>
    </Container> 
  );
}
