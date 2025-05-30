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
        position: "fixed", //fixed instead of relative or absolute
        height: "100vh",
        zIndex: 1200,
        ...(open && {
            "& .MuiDrawer-paper": {
                ...openedMixin(theme),
                position: "fixed", //
                height: "100vh",
                zIndex: 1200,
            },
        }),
        ...(!open && {
            "& .MuiDrawer-paper": {
                ...closedMixin(theme),
                position: "fixed",
                height: "100vh",
                zIndex: 1200,
            },
        }),
    })
);


export default function ExperimenterNavbar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [surveysExpanded, setSurveysExpanded] = React.useState(false);
    const [accountOpen, setAccountOpen] = React.useState(false);
    const navigate = useNavigate();
    const { user, logout } = useUserContext();
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

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
                        
                        {user && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                            onClick={() => navigate(`/experimenter_survey_list`)}
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
                            <ListItemText primary="Survey List" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                        )}

                    </List>
                    <Divider />
                    {user?.accountType === 'superuser' && (
                   <>
                    <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                        onClick={() => navigate("/admin_overview")}
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
                        <ListItemText primary="Admin Overview" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                        onClick={() => navigate("/account_manager")}
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
                        <ListItemText primary="Account Manager" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    </ListItem>
                </>
                )}
                </Box>
                <Box>
                    <Divider />
                    <List>
                           <ListItem button onClick={handleAccountClick}>
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
                                    //"& .MuiListItemText-secondary": {
                                    //    display: accountOpen ? "block" : "none",
                                        //     whiteSpace: 'normal',          ATTEMPTS AT BREAKING NICELY :'((((
                                        //     wordBreak: 'break-word',
                                        //     overflowWrap: 'break-word',
                                        //     lineBreak: 'strict',
                                        //     hyphens: 'auto',
                                    //},
                                }}
                            />
                            <IconButton size="small">
                                {accountOpen ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItem>
                        <Collapse in={accountOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                {!user?.guest && (
                                    <ListItem button onClick={() => navigate("/settingsExperimenter")}>
                                        <ListItemIcon>
                                            <Settings />
                                        </ListItemIcon>
                                        <ListItemText primary="Settings" />
                                    </ListItem>
                                )}
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