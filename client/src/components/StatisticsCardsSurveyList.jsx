import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PercentIcon from '@mui/icons-material/Percent';
import PeopleIcon from '@mui/icons-material/People';

function StatCard({ title, value }) {
  return (
    <Card sx={{ width: 310, minHeight: 130 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ color: 'primary.main', textAlign: 'center' }}>
          {value ?? '-'}
        </Typography>
      </CardContent>
    </Card>
  );
}

const StatisticsCards = ({ stats }) => {
  const cardData = [
    { title: 'Total Surveys Created', value: stats.totalSurveys},
    { title: 'Total Responses', value: stats.totalResponses},
    { title: 'Avg. Completion Rate (%)', value: stats.averageCompletionRate},
    { title: 'Avg. Completion Time (min)', value: stats.averageCompletionTime},
    { title: 'Avg. Users per Survey', value: stats.averageUsersPerSurvey},
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      {cardData.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </Box>
  );
};

export default StatisticsCards;
