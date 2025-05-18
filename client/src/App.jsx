import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import ExperimenterLayout from "./layouts/ExperimenterLayout";
import ExperimenteeLayout from "./layouts/ExperimenteeLayout";
import SignUp from "./pages/SignUp";
import SurveyBuilder from "./pages/SurveyBuilder";
import Experimenter from "./pages/Experimenter";
import SuperUserLayout from "./layouts/SuperUserLayout";
import AdminOverviewSuperUser from "./pages/SuperUser/AdminOverview";
import SurveyList from "./pages/SuperUser/SurveyList";
import AccountManagerTable from "./pages/SuperUser/AccountManager";
import Experimentee from "./pages/Experimentee";
import JoinSurvey from "./pages/JoinSurvey";
import Login from "./pages/Login";
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
];

const experimenteeRoutes = [
    { path: "/experimentee", element: <Experimentee /> },
    { path: "/join", element: <JoinSurvey /> },
];

const superuserRoutes = [
    { path: "/superuser", element: <AdminOverviewSuperUser /> },
    { path: "/admin_overview", element: <AdminOverviewSuperUser /> },
    { path: "/survey_list", element: <SurveyList /> },
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
