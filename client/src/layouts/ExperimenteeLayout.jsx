import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenteeNavbar from "../components/ExperimenteeNavbar";

function ExperimenteeLayout() {
    return (
        <>
            <ExperimenteeNavbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default ExperimenteeLayout;
