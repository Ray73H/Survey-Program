// components/AdminOverviewSuperUser.js
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import ExperimenterNavbar from '../../components/ExperimenterNavbar';
import SuperUserCard from '../../components/SuperUserOverviewCard';
import SuperUserBarGraphs from '../../components/SuperUserOverviewChartBox';
import SuperUserCardGroup from '../../components/SuperUserOverviewCard2';
import { getAllSurveys, getRecentSurveyActivity } from '../../services/surveys';
import { getAllUsers } from '../../services/users';
import { getResponseStatsByUser, getAllAnswers, getSurveyMetrics } from '../../services/answers';
import RecentActivityFeed from '../../components/RecentActivityFeed';
import MostActiveUsersFeed from '../../components/MostActiveUsersFeed';

export default function AdminOverviewSuperUser() {
  const [surveys, setSurveys] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [responseStats, setResponseStats] = useState({});
  const [allAnswers, setGetAllAnswers] = useState([]);
  const [surveyMetrics, setSurveyMetrics] = useState({
    completionRate: 'N/A',
    averageCompletionTimeInMinutes: 'N/A',
    averageUsersPerSurvey: 'N/A',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surveyRes, userRes, activityRes, responseStatsRes, allAnswersRes, surveyMetricsRes] = await Promise.all([
          getAllSurveys(),
          getAllUsers(),
          getRecentSurveyActivity(),
          getResponseStatsByUser(),
          getAllAnswers(),
          getSurveyMetrics(),
        ]);

        setSurveys(surveyRes.data);
        setUsers(userRes.data);
        setRecentActivity(activityRes.data);
        setResponseStats(responseStatsRes.data);
        setGetAllAnswers(allAnswersRes.data);
        setSurveyMetrics(surveyMetricsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <main className="flex-1 p-1 overflow-y-auto">
          <Outlet />
          <SuperUserCard surveys={surveys} users={users} allAnswers={allAnswers} />
          <SuperUserCardGroup metrics={surveyMetrics} />
          <SuperUserBarGraphs surveys={surveys} users={users} />
          <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 350 }}>
              <RecentActivityFeed activities={recentActivity} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 350 }}>
              <MostActiveUsersFeed surveys={surveys} users={users} responseStats={responseStats} />
            </Box>
          </Box>
        </main>
      </div>
    </div>
  );
}
