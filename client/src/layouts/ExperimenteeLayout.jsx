import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenteeNavbar from "../components/ExperimenteeNavbar";

function ExperimenteeLayout() {
    return (
         <div style={{ position: "relative" }}>
            <ExperimenteeNavbar />
            <main style={{ paddingLeft: 64 }}> {/* Leave space for collapsed drawer */}
                <Outlet />
            </main>
        </div>
    );
}


export default ExperimenteeLayout;
