import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExperimenterLayout from "./layouts/ExperimenterLayout";
import ExperimenteeLayout from "./layouts/ExperimenteeLayout";
import LoginLayout from "./layouts/LoginLayout";
import SurveyBuilder from "./pages/SurveyBuilder";
import Experimenter from "./pages/Experimenter";
import SuperUserLayout from "./layouts/SuperUserLayout";
import AdminOverviewSuperUser from "./pages/SuperUser/AdminOverview";
import SurveyList from "./pages/SuperUser/SurveyList";
import AccountManagerTable from "./pages/SuperUser/AccountManager";
import Experimentee from "./pages/Experimentee";
import JoinSurvey from "./pages/JoinSurvey";
import ExperimenterLogin from "./pages/ExperimenterLogin"
import ExperimenteeLogin from "./pages/ExperimenteeLogin";
import SuperUserLogin from "./pages/SuperUserLogin";




function App() {
    return (
        <Router>
            <Routes>
                {/* Public route */}
                <Route element={<LoginLayout />}>
                    <Route path ="/experimenterlogin" element={<ExperimenterLogin />} />
                    <Route path ="/experimenteelogin" element={<ExperimenteeLogin />} />
                    <Route path ="/superlogin" element={<SuperUserLogin />} />
                </Route>

                {/* Experimenter routes */}
                <Route element={<ExperimenterLayout />}>
                    <Route path="/surveybuilder" element={<SurveyBuilder />} />
                    <Route path="/Experimenter" element={<Experimenter />} />
                </Route>

                {/* Experimentee routes */}

                <Route element={<ExperimenteeLayout />}>
                    <Route path="/Experimentee" element={<Experimentee />} />
                    <Route path="/join" element={<JoinSurvey />} />
                  </Route>

                <Route path="/superuser" element={<SuperUserLayout />}>
                    <Route index element={<AdminOverviewSuperUser />} />   {/* Default route for Super User */}

                    <Route path="admin_overview" element={<AdminOverviewSuperUser />} />

                    <Route path="survey_list" element={<SurveyList />} />

                    <Route path="account_manager" element={<AccountManagerTable />} />

                    {/* 
                        
                        
                    */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
