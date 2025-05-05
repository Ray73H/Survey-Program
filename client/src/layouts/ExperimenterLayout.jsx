import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenterNavbar from "../components/ExperimenterNavbar";

function ExperimenterLayout() {
    return (
        <>
            <ExperimenterNavbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default ExperimenterLayout;
