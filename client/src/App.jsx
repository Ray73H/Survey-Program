import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import ExperimenterLayout from "./layouts/ExperimenterLayout";
import ExperimenteeLayout from "./layouts/ExperimenteeLayout";
import SignUp from "./pages/SignUp";
import SurveyBuilder from "./pages/SurveyBuilder";
import Experimenter from "./pages/Experimenter";
import SuperUserLayout from "./layouts/SuperUserLayout";
import AdminOverviewSuperUser from "./pages/SuperUser/AdminOverview";
import AccountManagerTable from "./pages/SuperUser/AccountManager";
import Experimentee from "./pages/Experimentee";
import JoinSurvey from "./pages/JoinSurvey";
import Login from "./pages/Login";
import WelcomeSurvey from "./pages/welcomeSurvey";
import FillSurvey from "./pages/fillSurvey";
import SurveyList from "./pages/SurveyList";
import PreviewSurvey from "./pages/PreviewSurvey";
import SettingsExperimentee from "./pages/settingsExperimentee";
import SettingsExperimenter from "./pages/settingsExperimenter"
import PublicSurveys from "./pages/PublicSurvey";
import CompletedSurveys from "./pages/completedSurveys";
import { useUserContext } from "./contexts/UserContext";

const ProtectedRoute = ({ children, allowedAccountTypes }) => {
    const { user } = useUserContext();

    if (!allowedAccountTypes.includes(user.accountType)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const getDefaultRoute = (accountType) => {
    const routes = {
        superuser: "/superuser",
        experimenter: "/experimenter",
        experimentee: "/experimentee",
    };
    return routes[accountType] || "/login";
};

const experimenterRoutes = [
    { path: "/experimenter", element: <Experimenter /> },
    { path: "/survey-builder/:surveyId", element: <SurveyBuilder /> },
    { path: "/experimenter_survey_list", element: <SurveyList /> },
    { path: "/survey-preview/:surveyId", element: <PreviewSurvey /> },
    { path: "/settingsExperimenter", element: <SettingsExperimenter />},
];

const experimenteeRoutes = [
    { path: "/experimentee", element: <Experimentee /> },
    { path: "/join", element: <JoinSurvey /> },
    { path: "/welcome", element: <WelcomeSurvey /> },
    { path: "/fillSurvey", element: <FillSurvey /> },
    { path: "/settingsExperimentee", element: <SettingsExperimentee />},
    { path: "/publicsurveys", element: <PublicSurveys />},
    { path: "/completedsurveys", element: <CompletedSurveys />},
];

const superuserRoutes = [
    { path: "/superuser", element: <AdminOverviewSuperUser /> },
    { path: "/admin_overview", element: <AdminOverviewSuperUser /> },
    { path: "/account_manager", element: <AccountManagerTable /> },
];

function App() {
    const { user } = useUserContext();

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/"
                    element={<Navigate to={getDefaultRoute(user.accountType)} replace />}
                />
                <Route path="/signup" element={<Navigate to="/signup/experimentee" replace />} />
                <Route path="/signup/experimenter" element={<SignUp user="experimenter" />} />
                <Route path="/signup/experimentee" element={<SignUp user="experimentee" />} />
                <Route
                    path="/login"
                    element={user.accountType !== "" ? <Navigate to="/" /> : <Login />}
                />

                {/* Experimenter routes */}
                <Route
                    element={
                        <ProtectedRoute allowedAccountTypes={["experimenter", "superuser"]}>
                            <ExperimenterLayout />
                        </ProtectedRoute>
                    }
                >
                    {experimenterRoutes.map((route) => (
                        <Route key={route.path} {...route} />
                    ))}
                </Route>

                {/* Experimentee routes */}
                <Route
                    element={
                        <ProtectedRoute allowedAccountTypes={["experimentee"]}>
                            <ExperimenteeLayout />
                        </ProtectedRoute>
                    }
                >
                    {experimenteeRoutes.map((route) => (
                        <Route key={route.path} {...route} />
                    ))}
                </Route>

                {/* Superuser routes */}
                <Route
                    element={
                        <ProtectedRoute allowedAccountTypes={["superuser"]}>
                            <SuperUserLayout />
                        </ProtectedRoute>
                    }
                >
                    {superuserRoutes.map((route) => (
                        <Route key={route.path} {...route} />
                    ))}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
