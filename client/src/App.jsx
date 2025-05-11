import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExperimenterLayout from "./layouts/ExperimenterLayout";
import ExperimenteeLayout from "./layouts/ExperimenteeLayout";
import SurveyBuilder from "./pages/SurveyBuilder";
import Experimenter from "./pages/Experimenter";
import SuperUserLayout from "./layouts/SuperUserLayout";
import AdminOverviewSuperUser from "./pages/SuperUser/AdminOverview";
import SurveyList from "./pages/SuperUser/SurveyList";
import AccountManagerTable from "./pages/SuperUser/AccountManager";





function App() {
    return (
        <Router>
            <Routes>
                {/* Public route */}


                {/* Experimenter routes */}
                <Route element={<ExperimenterLayout />}>
                    <Route path="/surveybuilder" element={<SurveyBuilder />} />
                    <Route path="/Experimenter" element={<Experimenter />} />
                </Route>

                {/* Experimentee routes */}
                <Route element={<ExperimenteeLayout />}></Route>

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
