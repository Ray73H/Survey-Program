import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { Box, Card, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function SuperUserBarGraphs({ surveys }) {
  // Group surveys by "MM/YYYY"
  const countsByMonth = surveys.reduce((acc, survey) => {
    const month = dayjs(survey.createdAt).format("MM/YYYY");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const xLabels = Object.keys(countsByMonth).sort((a, b) =>
    dayjs(a, 'MM/YYYY').isBefore(dayjs(b, 'MM/YYYY')) ? -1 : 1
  );
  const data = xLabels.map(label => countsByMonth[label]);

  return (
    <Card sx={{ display: 'flex', justifyContent: 'center', gap: 15, p: 2, mt: 5 }}>
      <SingleBarChart
        data={data}
        label="Surveys"
        title="Surveys Created Per Month"
        xLabels={xLabels}
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
        width={800}
        height={300}
        margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
        series={[{ type: 'bar', id: label.toLowerCase(), data, label }]}
        xAxis={[{ scaleType: 'band', data: xLabels, label: 'Month' }]}
      >
        <BarPlot />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </Box>
  );
}
