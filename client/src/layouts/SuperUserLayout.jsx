import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenterNavbar from "../components/ExperimenterNavbar"; // Reuses same navbar

function SuperUserLayout() {
    return (
        <div style={{ position: "relative" }}>
            <ExperimenterNavbar />
            <main style={{ paddingLeft: 64 }}> {/* Leave space for collapsed drawer */}
                <Outlet />
            </main>
        </div>
    );
}

export default SuperUserLayout;
