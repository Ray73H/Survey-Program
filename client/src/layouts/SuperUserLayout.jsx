import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenterNavbar from "../components/ExperimenterNavbar"; // reuse side navbar
import SuperUserNavbar from "../components/SuperUserNavbar";

export default function SuperUserLayout() {
    return (
        <div className="flex flex-col h-screen">
            <SuperUserNavbar />
            <div className="flex flex-1">
                <ExperimenterNavbar />
                <main className="flex-1 p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
