import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenterNavbar from "../components/ExperimenterNavbar"; // reuse side navbar

export default function SuperUserLayout() {
    return (
         <div className="flex">
                    <ExperimenterNavbar />
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
    );
}
