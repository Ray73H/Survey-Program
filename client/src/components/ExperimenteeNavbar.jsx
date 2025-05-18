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
import InboxIcon from "@mui/icons-material/MoveToInbox";
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
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),
    }),
);

export default function ExperimenteeNavbar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [surveysExpanded, setSurveysExpanded] = React.useState(false);
    const [accountOpen, setAccountOpen] = React.useState(false);
    const navigate = useNavigate();
    const { logout } = useUserContext();

    const handleAccountClick = () => {
        setAccountOpen((prev) => !prev);
    };
    const handleSurveysClick = () => {
        setSurveysExpanded((prev) => !prev);
    };
    const handleLogout = () => {
        logout();
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                open={open}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => {
                    setOpen(false);
                    setAccountOpen(false);
                }}
                slotProps={{
                    paper: {
                        sx: {
                            display: "flex",
                            flexDirection: "column",
                            width: 240,
                        },
                    },
                }}
            >
                {/* Logo */}
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
                                    <InboxIcon />
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
                                    <ListItemButton sx={{ pl: open ? 6 : 4 }}>
                                        <ListItemText
                                            primary="Saved Surveys"
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                    <ListItemButton sx={{ pl: open ? 6 : 4 }}>
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
                                onClick={() => navigate("/join")}
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
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Join New Survey"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
                <Box>
                    <Divider />
                    <List>
                        <ListItem button onClick={handleAccountClick}>
                            <ListItemIcon>
                                <Avatar alt="User" src="/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="name" secondary={useUserContext.emailcontext} />
                            <IconButton size="small">
                                {accountOpen ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItem>
                        <Collapse in={accountOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                <ListItem button>
                                    <ListItemIcon>
                                        <Settings />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItem>
                                <ListItem button onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
