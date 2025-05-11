import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenteeNavbar from "../components/ExperimenteeNavbar";

/*empty layout, so that no navbar appears */
function LoginLayout() {
    return (
        <div className="flex">
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
    );
}


export default LoginLayout;
