import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExperimenterLayout from "./layouts/ExperimenterLayout";
import ExperimenteeLayout from "./layouts/ExperimenteeLayout";
import SurveyBuilder from "./pages/SurveyBuilder";
import Experimenter from "./pages/Experimenter";
import Experimentee from "./pages/Experimentee";
import JoinSurvey from "./pages/JoinSurvey";




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
                <Route element={<ExperimenteeLayout />}>
                    <Route path="/Experimentee" element={<Experimentee />} />
                    <Route path="/join" element={<JoinSurvey />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
