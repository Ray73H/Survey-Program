import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenteeNavbar from "../components/ExperimenteeNavbar";

function ExperimenteeLayout() {
    return (
        <div className="flex">
            <ExperimenteeNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}


export default ExperimenteeLayout;
