import React, { useState, useEffect } from 'react';
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
import { useTheme } from '@mui/material/styles';
import { getAllSurveys, getSurveysByUserId } from '../services/surveys';
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
function Row({ survey, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{survey.title || '-'}</TableCell>
        <TableCell>{survey.author || '-'}</TableCell>
        <TableCell>{survey.public ? 'Public' : 'Private'}</TableCell>
        <TableCell>{survey.pinCode || '-'}</TableCell>
        <TableCell>{survey.imported ? 'Yes' : 'No'}</TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={() => onEdit(survey._id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(survey._id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {survey.questions && survey.questions.length > 0 ? (
                    survey.questions.map((q, index) => (
                      <TableRow key={index}>
                        <TableCell>{q.questionText || '-'}</TableCell>
                        <TableCell>{q.questionType || '-'}</TableCell>
                        <TableCell>
                          {q.options && q.options.length > 0
                            ? q.options.join(', ')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
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

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        let res;
        if (user.accountType === 'superuser' && viewMode === 'all') {
          res = await getAllSurveys();
        } else {
          res = await getSurveysByUserId(user.userId);
        }
        setSurveys(res.data);
      } catch (err) {
        console.error('Failed to fetch surveys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [user, viewMode]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => console.log('Edit survey with ID:', id);
  const handleDelete = (id) => console.log('Delete survey with ID:', id);

  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.title?.toLowerCase().includes(searchTerm) ||
      survey.author?.toLowerCase().includes(searchTerm)
  );

  const paginatedSurveys = filteredSurveys.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Public</TableCell>
                <TableCell>Pin Code</TableCell>
                <TableCell>Imported</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSurveys.map((survey) => (
                <Row
                  key={survey._id}
                  survey={survey}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              {paginatedSurveys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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

