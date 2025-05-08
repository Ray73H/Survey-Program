import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ExperimenterLayout from "./layouts/ExperimenterLayout";
import ExperimenteeLayout from "./layouts/ExperimenteeLayout";
// import SignUpLayout from "./layouts/SignUpLayout";
import SurveyBuilder from "./pages/SurveyBuilder";
import SignUp from "./pages/SignUp";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public route */}
                <Route path="/signup/experimenter" element={<SignUp user="experimenter" />} />
                <Route path="/signup/experimentee" element={<SignUp user="experimentee" />}/>
                <Route path="/signup" element={<Navigate to="/signup/experimentee" replace />}> </Route>

                {/* Experimenter routes */}
                <Route element={<ExperimenterLayout />}>
                    <Route path="/surveybuilder" element={<SurveyBuilder />} />
                </Route>

                {/* Experimentee routes */}
                <Route element={<ExperimenteeLayout />}></Route>
            </Routes>
        </Router>
    );
}

export default App;
