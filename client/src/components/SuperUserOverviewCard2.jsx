import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, ButtonGroup, Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsightsIcon from '@mui/icons-material/Insights';
import GroupIcon from '@mui/icons-material/Group';

function StatCard({ title, value, icon: Icon, description, children }) {
  return (
    <Card sx={{ width: 420, height: 150 }}>
      <CardContent>
        {children}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Icon sx={{ mr: 1 }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ color: 'primary.main', textAlign: 'center' }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function SuperUserCardGroup({ metrics }) {
  const [timeFilter, setTimeFilter] = useState('overall');

  const getTimeValue = () => {
    switch (timeFilter) {
      case 'mc':
        return metrics.averageTimeMultipleChoice;
      case 'text':
        return metrics.averageTimeOpenText;
      case 'overall':
      default:
        return metrics.averageCompletionTimeInMinutes;
    }
  };

  const timeLabels = {
    overall: 'Overall average time to complete any survey',
    mc: 'Average time for surveys with Multiple Choice questions',
    text: 'Average time for surveys with Open Text questions',
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 5, flexWrap: 'wrap' }}>
      <StatCard
        title="Completion Rate"
        value={`${metrics.completionRate}%`}
        icon={InsightsIcon}
        description="% of users who completed a survey vs. those who started"
      />

      <StatCard
        title="Average Completion Time"
        value={`${metrics.averageCompletionTimeInMinutes} min`}
        icon={InsightsIcon}
        description='Overall average time to complete any survey'
      />


      <StatCard
        title="Avg. Users per Survey"
        value={metrics.averageUsersPerSurvey}
        icon={GroupIcon}
        description="Mean number of users who responded to each survey"
      />
    </Box>
  );
}
