import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ExperimenterNavbar from "../../components/ExperimenterNavbar";
import SuperUserCard from "../../components/SuperUserOverviewCard";
import SuperUserBarGraphs from "../../components/SuperUserOverviewChartBox";
import SuperUserCardGroup from "../../components/SuperUserOverviewCard2";
import { getAllSurveys } from '../../services/surveys';
import { getAllUsers } from '../../services/users';

export default function AdminOverviewSuperUser() {
    const [surveys, setSurveys] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [surveyRes, userRes] = await Promise.all([
                    getAllSurveys(),
                    getAllUsers()
                ]);
                setSurveys(surveyRes.data);
                setUsers(userRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <main className="flex-1 p-1 overflow-y-auto">
                    <Outlet />
                    <SuperUserCard surveys={surveys} users={users} />
                    <SuperUserCardGroup />
                    <SuperUserBarGraphs surveys={surveys} />
                </main>
            </div>
        </div>
    );
}
