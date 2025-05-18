import * as React from "react";
import { useNavigate } from "react-router-dom";
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
import { useUserContext } from "../contexts/UserContext";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

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

export default function ExperimenterNavbar() {
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
                                onClick={() => navigate("/")}
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
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleAccountClick}>
                                <ListItemIcon>
                                    <Avatar alt="User" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="name"
                                    secondary={useUserContext.emailcontext}
                                />
                                <IconButton size="small">
                                    {accountOpen ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={accountOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Settings />
                                        </ListItemIcon>
                                        <ListItemText primary="Settings" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout />
                                        </ListItemIcon>
                                        <ListItemText primary="Logout" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
