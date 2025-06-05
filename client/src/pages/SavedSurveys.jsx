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
} from '@mui/icons-material';
import { format } from "date-fns";
import { useTheme } from '@mui/material/styles';
import {getSavedSurveyAnswers } from '../services/answers';
import { getSurveyById } from '../services/surveys';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
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
function Row({ survey }) {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const handleContinue = async () => {
        try {
            const response = await getSurveyById(survey.surveyId);
            const surveyData = response.data;
            navigate("/welcome", {
                state: {
                    survey: surveyData
                }
            });
        } catch (error) {
            console.error("Error fetching survey:", error);
            alert("Error loading survey. Please try again.");
        }
    };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{survey.surveyTitle || '-'}</TableCell>
        <TableCell>{survey.surveyAuthor || '-'}</TableCell>
        <TableCell>{format(survey.updatedAt, "dd MMM yyyy") || '-'}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleContinue}
          >
            Continue Survey
          </Button>
        </TableCell>
      <TableCell>
      {survey.answers && survey.surveyQuestions && survey.surveyQuestions.length > 0 ? 
      `${Math.round((survey.answers.length / survey.surveyQuestions.length) * 100)}%` 
      : '-'}
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
                    <TableCell>Question</TableCell>
                    <TableCell>Your answer</TableCell>
                    <TableCell>Question Type</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                  {survey.surveyQuestions && survey.surveyQuestions.length > 0 ? (
                      survey.surveyQuestions.map((q, index) => (
                        <TableRow key={index}>
                          <TableCell>{q.questionText || '-'}</TableCell>
                          <TableCell>{survey.answers[index]?.answer || '-'}</TableCell>
                          <TableCell>{q.questionType || '-'}</TableCell>
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

export default function SavedSurveys() {
  const { user } = useUserContext();
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [answers, setAnswers] = useState([])
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        let res = await getSavedSurveyAnswers(!!user?.guest, user.userId);
        setSurveys(res.data)
      } catch (err) {
        console.error('Failed to fetch surveys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [user]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.surveyTitle?.toLowerCase().includes(searchTerm) ||
      survey.surveyAuthor?.toLowerCase().includes(searchTerm)
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
                <TableCell>Last Updated</TableCell>
                <TableCell></TableCell>
                <TableCell>Completion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSurveys.map((survey) => (
                <Row
                  key={survey._id}
                  survey={survey}
                />
              ))}
              {paginatedSurveys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2">You have not started any surveys. Join a new survey using the menu on the left to see it here. Once you have completed it, you will see it under completed surveys</Typography>
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

