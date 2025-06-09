import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableFooter,
  TablePagination,
  TextField,
  CircularProgress,
  Button,
  Stack,
  Chip,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { getAllSurveys, getSurveysByUserId, deleteSurvey } from '../services/surveys';
import { getMetricsPerSurvey, getMetricsPerQuestion, getTotalResponses, getAverageCompletionRate, getAverageCompletionTime, getAverageUsersPerSurvey, } from '../services/answers';
import StatisticsCards from '../components/StatisticsCardsSurveyList';

import { useUserContext } from '../contexts/UserContext';

// Pagination control buttons
function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const theme = useTheme();

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


// Collapsible row component
function Row({ survey, metrics, onEdit, onDelete, visibleColumns, metricsQuestion, user, viewMode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {visibleColumns.title && <TableCell>{survey.title || '-'}</TableCell>}
        {visibleColumns.author && <TableCell>{survey.author || '-'}</TableCell>}
        {visibleColumns.public && <TableCell>{survey.public ? 'Public' : 'Private'}</TableCell>}
        {visibleColumns.pinCode && <TableCell>{survey.pinCode || '-'}</TableCell>}
        {visibleColumns.imported && <TableCell>{survey.imported ? 'Yes' : 'No'}</TableCell>}
        {visibleColumns.status && (
          <TableCell>
            {survey.deleted_at ? (
              <Chip label="Deleted" color="error" size="small" />
            ) : survey.published ? (
              <Chip label="Published" color="success" size="small" />
            ) : (
              <Chip label="Draft" color="info" size="small" />
            )}
          </TableCell>
        )}
        {visibleColumns.deadline && (
          <TableCell>
            {survey.deadline ? new Date(survey.deadline).toLocaleDateString('en-GB') : '-'}
          </TableCell>
        )}
        {visibleColumns.completionRate && (
          <TableCell>{metrics.completionRate || '-'}</TableCell>
        )}
        {visibleColumns.averageTime && (
          <TableCell>{metrics.averageCompletionTimeInMinutes || '-'}</TableCell>
        )}
        {visibleColumns.uniqueParticipants && (
          <TableCell>{survey.uniqueParticipants || '-'}</TableCell>
        )}
        {visibleColumns.actions && (
          <TableCell align="right">
            {!(user.accountType === 'superuser' && viewMode === 'all') && (
              <IconButton size="small" onClick={() => onEdit(survey._id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => onDelete(survey._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell colSpan={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Questions
              </Typography>
              <Table size="small" aria-label="questions">
                <TableHead>
                  <TableRow>
                    <TableCell>Question Text</TableCell>
                    <TableCell>Question Type</TableCell>
                    <TableCell>Options</TableCell>
                    <TableCell>Completion Rate (%)</TableCell>
                    <TableCell>Avg. Completion Time (min)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {survey.questions && survey.questions.length > 0 ? (
                    survey.questions.map((q, index) => {
                      const questionNumber = String(q.questionNumber ?? index + 1);
                      const qMetrics = metricsQuestion?.[questionNumber] || {};


                      return (
                      <TableRow key={index}>
                        <TableCell>{q.questionText || '-'}</TableCell>
                        <TableCell>{q.questionType || '-'}</TableCell>
                        <TableCell>{q.options?.length ? q.options.join(', ') : '-'}</TableCell>
                        <TableCell>
                          {qMetrics.completionRate ? `${qMetrics.completionRate}%` : '-'}
                        </TableCell>
                        <TableCell>
                          {qMetrics.averageTimeInMinutes ? `${qMetrics.averageTimeInMinutes}` : '-'}
                        </TableCell>
                      </TableRow>
                    );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No questions available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>

      </TableRow>
    </>
  );
}


export default function SurveyList() {
  const { user } = useUserContext();
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // 'own' or 'all'
  const [surveyMetrics, setSurveyMetrics] = useState({});
  const [surveyMetricsPerQuestion, setSurveyMetricsPerQuestion] = useState({})
  const [stats, setStats] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);



  const navigate = useNavigate();


  const defaultVisibleColumns = {
  title: true,
  author: true,
  public: true,
  pinCode: true,
  imported: true,
  status: true,
  deadline: true,
  completionRate: true,
  averageTime: true,
  uniqueParticipants: true,
  actions: true,
};

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('surveyVisibleColumns');
    return saved ? JSON.parse(saved) : defaultVisibleColumns;
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);




  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (user.accountType === 'superuser' && viewMode === 'all') {
        res = await getAllSurveys();
      } else {
        res = await getSurveysByUserId(user.userId);
      }
      setSurveys(res.data);

      const metricsRes = await getMetricsPerSurvey();
      const metricsMap = {};
      metricsRes.data.forEach((metric) => {
        metricsMap[metric.surveyId] = metric;
      });
      setSurveyMetrics(metricsMap);

      const metricsQuestionRes = await getMetricsPerQuestion();
      setSurveyMetricsPerQuestion(metricsQuestionRes.data);

      const [userSurveysRes, totalResponsesRes, avgCompletionRateRes, avgCompletionTimeRes, avgUsersRes] = await Promise.all([
        getSurveysByUserId(user.userId),
        getTotalResponses(),
        getAverageCompletionRate(),
        getAverageCompletionTime(),
        getAverageUsersPerSurvey(),
      ]);

      setStats({
        totalSurveys: userSurveysRes.data.length,
        totalResponses: totalResponsesRes.data.totalResponses,
        averageCompletionRate: avgCompletionRateRes.data.averageCompletionRate,
        averageCompletionTime: avgCompletionTimeRes.data.averageCompletionTime,
        averageUsersPerSurvey: avgUsersRes.data.averageUsersPerSurvey,
      });
      console.log("📊 Stats being set:", {
        totalSurveys: userSurveysRes.data.length,
        totalResponses: totalResponsesRes.data.totalResponses,
        averageCompletionRate: avgCompletionRateRes.data.averageCompletionRate,
        averageCompletionTime: avgCompletionTimeRes.data.averageCompletionTime,
        averageUsersPerSurvey: avgUsersRes.data.averageUsersPerSurvey,
      });
    } catch (err) {
      console.error('Failed to fetch surveys or metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  localStorage.setItem('surveyVisibleColumns', JSON.stringify(visibleColumns));
  fetchData();
}, [user, viewMode, visibleColumns]);




  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/survey-builder/${id}`);
  };


  const handleDelete = (id) => {
    setSurveyToDelete(id);
    setDeleteDialogOpen(true);
  };


  const confirmDelete = async () => {
    try {
      await deleteSurvey(surveyToDelete);
      await fetchData(); 
    } catch (err) {
      console.error("Failed to delete survey:", err);
    } finally {
      setDeleteDialogOpen(false);
      setSurveyToDelete(null);
    }
  };


  const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSurveyToDelete(null);
      };


  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.title?.toLowerCase().includes(searchTerm) ||
      survey.author?.toLowerCase().includes(searchTerm)
  );

  const paginatedSurveys = filteredSurveys.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};

const handleToggleColumn = (column) => {
  setVisibleColumns((prev) => {
    const updated = { ...prev, [column]: !prev[column] };
    localStorage.setItem('surveyVisibleColumns', JSON.stringify(updated));
    return updated;
  });
};




  return (
    <Box sx={{ marginTop: '30px' }}>
        
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                flexWrap: 'wrap',
                gap: 1,
            }}
            >
            <TextField
                label="Search by Title or Author"
                variant="outlined"
                size="small"
                onChange={handleSearchChange}
                sx={{ flexGrow: 1, maxWidth: 300 }}
            />

            {user.accountType === 'superuser' && (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexGrow: 1 }}>
                <Button
                    variant={viewMode === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('all')}
                >
                    View All Surveys
                </Button>
                <Button
                    variant={viewMode === 'own' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('own')}
                >
                    View Own Surveys
                </Button>
            </Box>
        )}
        <Tooltip title="Visible Fields">
            <Button 
            onClick={handleMenuOpen}
            variant="contained"
            startIcon={<VisibilityIcon />}>
              Visible Columns
            </Button>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            {Object.keys(defaultVisibleColumns).map((column) => (
              <MenuItem key={column} onClick={() => handleToggleColumn(column)}>
                <Checkbox checked={visibleColumns[column]} />
                <ListItemText primary={column} />
              </MenuItem>
            ))}
          </Menu>

          <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this survey? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

    </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="survey table">
            <TableHead>
              <TableRow>
                <TableCell />
                {visibleColumns.title && <TableCell>Title</TableCell>}
                {visibleColumns.author && <TableCell>Author</TableCell>}
                {visibleColumns.public && <TableCell>Public</TableCell>}
                {visibleColumns.pinCode && <TableCell>Pin Code</TableCell>}
                {visibleColumns.imported && <TableCell>Imported</TableCell>}
                {visibleColumns.status && <TableCell>Status</TableCell>}
                {visibleColumns.deadline && <TableCell>Survey Deadline</TableCell>}
                {visibleColumns.completionRate && <TableCell>Completion Rate (%)</TableCell>}
                {visibleColumns.averageTime && <TableCell>Avg. Completion Time (min)</TableCell>}
                {visibleColumns.uniqueParticipants && <TableCell>Unique Participants</TableCell>}
                {visibleColumns.actions && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSurveys.map((survey) => (
                <Row
                  key={survey._id}
                  survey={survey}
                  metrics={surveyMetrics[survey._id] || {}}
                  metricsQuestion={surveyMetricsPerQuestion[survey._id] || {}}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  visibleColumns={visibleColumns}
                  user={user}
                  viewMode={viewMode}
                />
              ))}
              {paginatedSurveys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No surveys found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={filteredSurveys.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
            
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

