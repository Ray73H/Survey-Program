import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ExperimenterNavbar from "../components/ExperimenterNavbar";

function ExperimenterLayout() {
    return (
        <div className="flex">
            <ExperimenterNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default ExperimenterLayout;
