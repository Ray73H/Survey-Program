import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { Box, Card, Typography } from '@mui/material';

export default function SuperUserBarGraphs() {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'center', gap: 15, p: 2, mt: 5 }}>
      <SingleBarChart
        data={[5, 7, 4, 11, 10, 8]}
        label="Surveys"
        title="Surveys Created Per Month"
        xLabels={['02/25', '03/25', '05/25', '06/25', '07/25', '08/25']}
      />
      <SingleBarChart
        data={[2, 11, 6, 5, 3, 4]}
        label="Users"
        title="Users Created Per Month"
        xLabels={['02/25', '03/25', '05/25', '06/25', '07/25', '08/25']}
      />
    </Card>
  );
}

function SingleBarChart({ data, label, title, xLabels }) {
  return (
    <Box>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <ChartContainer
        width={600}
        height={300}
        margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
        series={[{ type: 'bar', id: label.toLowerCase(), data, label }]}
        xAxis={[{ scaleType: 'band', data: xLabels, label: 'Months' }]}
      >
        <BarPlot />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </Box>
  );
}
