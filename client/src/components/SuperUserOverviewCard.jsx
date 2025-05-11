import * as React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import InsightsIcon from '@mui/icons-material/Insights';


function StatCard({ title, value, Icon }) {
  return (
    <Card sx={{ width: 350, height: 100 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Icon sx={{ mr: 1 }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function SuperUserCardGroup() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 5 }}>
      <StatCard title="Created Surveys" value={62} Icon={InsightsIcon} />
      <StatCard title="Active Surveys" value={42} Icon={BarChartIcon} />
      <StatCard title="Total Users" value={21} Icon={GroupIcon} />
      <StatCard title="Survey Responses" value={692} Icon={CheckCircleIcon} />
    </Box>
  );
}

