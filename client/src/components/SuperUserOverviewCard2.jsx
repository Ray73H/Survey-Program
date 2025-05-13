import * as React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import InsightsIcon from '@mui/icons-material/Insights';


function StatCardStatistics({ title, value, Icon, Description }) {
  return (
    <Card sx={{ width: 450, height: 150}}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Icon sx={{ mr: 1 }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          {value}
        </Typography>
        <Typography variant="h9" sx={{ color: 'text.secondary', mb: 1.5}}>
            {Description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function SuperUserCardGroup() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 5 }}>
      <StatCardStatistics title="Completion Rate" value={'93%'} Icon={InsightsIcon} Description="% of users who completed a survey vs. those who started" />
      <StatCardStatistics title="Average Completion Time" value={42} Icon={BarChartIcon} Description="The mean time it takes users to complete a survey" />
      <StatCardStatistics title="Average Number of Users per Survey" value={9} Icon={GroupIcon} Description="Mean number of participants each survey has gathered" />
    </Box>
  );
}