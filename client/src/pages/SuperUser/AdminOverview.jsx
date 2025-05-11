import React from "react";
import { Outlet } from "react-router-dom";
import ExperimenterNavbar from "../../components/ExperimenterNavbar";
import SuperUserNavbar from "../../components/SuperUserNavbar";
import SuperUserCard from "../../components/SuperUserOverviewCard";
import SuperUserBarGraphs from "../../components/SuperUserOverviewChartBox";
import SuperUserCardGroup from "../../components/SuperUserOverviewCard2"


export default function AdminOverviewSuperUser() {
    return (
        <div className="flex flex-col h-screen">
            
            <div className="flex flex-1">
                
                <main className="flex-1 p-1 overflow-y-auto">
                    <Outlet />
                    <SuperUserCard />
                    <SuperUserCardGroup />
                    <SuperUserBarGraphs />
                </main>
            </div>
        </div>
    );
}
