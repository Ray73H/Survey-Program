import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Container,
  Paper,
  Avatar,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import {getUser, deleteUser} from "../services/users";
import { DeleteUserDialog } from "../components/DeleteUserDialog";
import { useUserContext } from "../contexts/UserContext";



export default function Settings() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [deleteUserId, setDeleteUserId] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [UserId, setUserId] = useState("");
    //const userid = getUser();

    //const fetchSurveys = async () => {
    //    const response = await getUnpublishedSurveys(user.userId);
    //    setSurveys(response.data);
    //};

    //useEffect(() => {
    //    fetchSurveys();
    //}, [user.userId]);

    //const fetchUser = async () => {
    //    const response = await getUser(user.userId);
    //    setUserId(response);
    //};

    //useEffect(() => {
    //    fetchUser();
    //}, user.userId);
    
    const handleDeleteUser = async () => {
    //    await deleteUser(deleteUserId);
    //    setOpenDeleteDialog(false);
        navigate("/signup");
    //    fetchUser(); 
    }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h5">View Profile Details</Typography>
          </Box>
          <Divider />
            <Typography variant="h4">
                User name:
            </Typography>
            <Typography variant="h3">
                {user.name}
            </Typography>
             <Typography variant="h4">
                Email:
            </Typography>
            <Typography variant="h3">
                {user.email}
            </Typography>    

          <Divider />

          <Box textAlign="right">
               <IconButton
                   onClick={() => {
                      setOpenDeleteDialog(true);
                      setDeleteUserId(user.id);
                    }}
                   color="error"  >
                   <DeleteIcon />
                 </IconButton>
          </Box>
            <DeleteUserDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setDeleteUserId("");
                    }}
                onConfirm={handleDeleteUser}
                      />
    </Container>
    
  );
}
