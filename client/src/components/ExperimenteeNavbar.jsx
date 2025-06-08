import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import { Settings, Logout, ExpandLess, ExpandMore, AccountCircle } from "@mui/icons-material";
import { Collapse, Avatar, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        // Base styles for the Drawer component itself
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        position: "fixed",
        height: "100vh",
        zIndex: 1200,

        // Apply width, transition, and overflow from mixins to the Drawer component itself
        ...(open ? openedMixin(theme) : closedMixin(theme)),

        // Styles for the MuiDrawer-paper child component
        "& .MuiDrawer-paper": {
            // The paper should also reflect the open/closed state visually using the mixins
            ...(open ? openedMixin(theme) : closedMixin(theme)),
            // Ensure these specific paper styles are maintained
            position: "fixed",
            height: "100vh",
            zIndex: 1200, // This zIndex is on the paper, consistent with original
        },
    }),
);

export default function ExperimenteeNavbar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [surveysExpanded, setSurveysExpanded] = React.useState(false);
    const [accountOpen, setAccountOpen] = React.useState(false);
    const [joinExpanded, setJoinExpanded] = React.useState(false);
    const navigate = useNavigate();
    const { user, logout } = useUserContext();
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

    const handleAccountClick = () => {
        setAccountOpen((prev) => !prev);
    };
    const handleSurveysClick = () => {
        setSurveysExpanded((prev) => !prev);
    };
    const handleJoinClick = () => {
        setJoinExpanded((prev) => !prev);
    };
    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: open ? drawerWidth : 12,
                zIndex: 1200,
                
            }}
            >
            <Box
            sx={{
                position: "absolute",
                left: 0,
                width: 24, // Wider and more stable
                height: "100vh",
                zIndex: 1300,
                backgroundColor: "transparent",
                cursor: "pointer",
            }}
            onMouseMove={() => setOpen(true)} // More responsive
            />

            <Drawer
                variant="permanent"
                open={open}
                onMouseLeave={() => {
                    setOpen(false);
                    setAccountOpen(false);
                }}
                slotProps={{
                    paper: {
                        sx: {
                            display: "flex",
                            flexDirection: "column",
                        },
                    },
                }}
                sx={{ pointerEvents: open ? 'auto' : 'none' }} // Allow clicking only when expanded
            >
                <Divider />
                <Box sx={{ flex: 1 }}>
                    <List>
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                                onClick={() => navigate("/Experimentee")}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                                onClick={handleSurveysClick}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Your Surveys"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                                {open && (surveysExpanded ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                            <Collapse in={surveysExpanded} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton 
                                    onClick={() => navigate("/savedsurveys")}
                                    sx={{ pl: open ? 6 : 4 }}>
                                        <ListItemText
                                            primary="Saved Surveys"
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                    <ListItemButton 
                                    onClick={() => navigate("/completedsurveys")}
                                    sx={{ pl: open ? 6 : 4 }}>
                                        <ListItemText
                                            primary="Completed Surveys"
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </ListItem>
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                                onClick={handleJoinClick}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Join New Survey"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                                {open && (joinExpanded ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                            <Collapse in={joinExpanded} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton
                                        onClick={() => navigate("/publicsurveys")}
                                        sx={{ pl: open ? 6 : 4 }}
                                    >
                                        <ListItemText
                                            primary="Browse Public Surveys"
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        onClick={() => navigate("/join")}
                                        sx={{ pl: open ? 6 : 4 }}
                                    >
                                        <ListItemText
                                            primary="Join Through PIN"
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
                <Box>
                    <Divider />
                    <List>
                        <ListItem button onClick={handleAccountClick} sx={{ cursor: 'pointer' }}>
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: "primary.main" }}>{firstLetter}</Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={user.name}
                                sx={{
                                    maxWidth: 300,
                                    "& .MuiListItemText-primary": {
                                        whiteSpace: accountOpen ? "normal" : "nowrap",
                                        overflow: accountOpen ? "visible" : "hidden",
                                        textOverflow: accountOpen ? "initial" : "ellipsis",
                                    },
                                }}
                            />
                            <IconButton size="small">
                                {accountOpen ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItem>
                        <Collapse in={accountOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                {!user?.guest && (
                                    <ListItem button onClick={() => navigate("/settingsExperimentee")}>
                                        <ListItemIcon>
                                            <Settings />
                                        </ListItemIcon>
                                        <ListItemText primary="Settings" />
                                    </ListItem>
                                )}
                                <ListItem button onClick={handleLogout} sx={{ cursor: 'pointer' }}>
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout"/>
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
