import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  ButtonGroup,
  Button,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import InsightsIcon from '@mui/icons-material/Insights';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import EditIcon from '@mui/icons-material/Edit';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';

function StatCard({ title, value, Icon, filterControls = null }) {
  return (
    <Card sx={{ width: 350, minHeight: 140 }}>
      <CardContent>
        {filterControls && (
          <Box sx={{ mb: 1 }}>
            {filterControls}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Icon sx={{ mr: 1 }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ color: 'primary.main', textAlign: 'center' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}


export default function SuperUserCard({ surveys = [], users = [], allAnswers = [] }) {
  const [statusFilter, setStatusFilter] = useState('draft');

  const [userFilter, setUserFilter] = useState('all');

  const totalSurveys = surveys.length;
  const totalUsers = users.length;
  const totalAnswers = allAnswers.length

  const now = new Date();

  const getFilteredSurveyCount = () => {
    switch (statusFilter) {
      case 'draft':
        return surveys.filter((s) => !s.published).length;
      case 'expired':
        return surveys.filter((s) => new Date(s.deadline) < now).length;
      case 'published':
      default:
        return surveys.filter((s) => s.published && new Date(s.deadline) >= now).length;
    }
  };

  const getFilteredUserCount = () => {
    switch (userFilter) {
      case 'experimenter':
        return users.filter((u) => u.accountType === 'experimenter').length;
      case 'superuser':
        return users.filter((u) => u.accountType === 'superuser').length;
      case 'experimentee':
        return users.filter((u) => u.accountType === 'experimentee').length;
      case 'all':
      default:
        return users.length;
    }
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 5, flexWrap: 'wrap' }}>

      <StatCard title="Created Surveys" value={totalSurveys} Icon={InsightsIcon} />
      
      <StatCard
        title="Surveys by Status"
        value={getFilteredSurveyCount()}
        Icon={BarChartIcon}
        filterControls={
          <ButtonGroup fullWidth size="small" variant="outlined">
            <Button
              onClick={() => setStatusFilter('draft')}
              variant={statusFilter === 'draft' ? 'contained' : 'outlined'}
              startIcon={<EditIcon />}
              sx={{ fontSize: '0.56rem' }}
            >
              Draft
            </Button>
            <Button
              onClick={() => setStatusFilter('published')}
              variant={statusFilter === 'published' ? 'contained' : 'outlined'}
              startIcon={<PublishedWithChangesIcon />}
              sx={{ fontSize: '0.56rem' }}
            >
              Active
            </Button>
            <Button
              onClick={() => setStatusFilter('expired')}
              variant={statusFilter === 'expired' ? 'contained' : 'outlined'}
              startIcon={<HourglassDisabledIcon />}
              sx={{ fontSize: '0.56rem' }}
            >
              Expired
            </Button>
          </ButtonGroup>
        }
      />


      <StatCard
        title="Users"
        value={getFilteredUserCount()}
        Icon={GroupIcon}
        filterControls={
        <ButtonGroup fullWidth size="small" variant="outlined">
          <Button
            onClick={() => setUserFilter('all')}
            variant={userFilter === 'all' ? 'contained' : 'outlined'}
            sx={{ fontSize: '0.56rem' }}
          >
            Total
          </Button>
          <Button
            onClick={() => setUserFilter('experimenter')}
            variant={userFilter === 'experimenter' ? 'contained' : 'outlined'}
            sx={{ fontSize: '0.56rem' }}
          >
            Experimenter
          </Button>
          <Button
            onClick={() => setUserFilter('superuser')}
            variant={userFilter === 'superuser' ? 'contained' : 'outlined'}
            sx={{ fontSize: '0.56rem' }}
          >
            Super User
          </Button>
          <Button
            onClick={() => setUserFilter('experimentee')}
            variant={userFilter === 'experimentee' ? 'contained' : 'outlined'}
            sx={{ fontSize: '0.56rem' }}
          >
            Experimentee
          </Button>
        </ButtonGroup>
      }

      />

      <StatCard title="Total Survey Responses" value={totalAnswers} Icon={CheckCircleIcon} />
    </Box>
  );
}
