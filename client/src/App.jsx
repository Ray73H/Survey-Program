import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExperimenterLayout from "./layouts/ExperimenterLayout";
import ExperimenteeLayout from "./layouts/ExperimenteeLayout";
import SurveyBuilder from "./pages/SurveyBuilder";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public route */}

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
