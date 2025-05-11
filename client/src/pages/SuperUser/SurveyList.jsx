import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Collapse, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, TableFooter, TablePagination
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft, KeyboardArrowRight,
  LastPage as LastPageIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { TextField, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

// Collapsible row component
function Row({ row, onEdit, onDelete }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.IDs}</TableCell>
        <TableCell align="right">{row.AuthorName}</TableCell>
        <TableCell align="right">{row.CreatedAt}</TableCell>
        <TableCell align="right">{row.LastEditedAt}</TableCell>
        <TableCell align="right">{row.NumbOfResponses}</TableCell>
        <TableCell align="right">{row.CompletionRate || '-'}</TableCell>
        <TableCell align="right">
            <Chip
                label={row.Status}
                color={row.Status === 'Published' ? 'success' : row.Status === 'Draft' ? 'default' : 'warning'}
                size="small"
                variant="outlined" />
        </TableCell>
        <TableCell align="right">{row.AvgCompletionTime || '-'}</TableCell>
        <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(row.IDs)}>
                <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(row.IDs)}>
                <DeleteIcon fontSize="small" />
                </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6">Survey Data</Typography>
              <Table size="small">
                <TableHead>
                    <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Avg Answer Time</TableCell>
                    <TableCell>Skipped %</TableCell>
                    <TableCell>Question Type </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row.history?.map((q) => (
                    <TableRow key={q.question}>
                        <TableCell>{q.question}</TableCell>
                        <TableCell>{q.answerTime}</TableCell>
                        <TableCell>{q.skipped}</TableCell>
                        <TableCell>{q.questionType}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
};





// Sample data
function createData(IDs, AuthorName, CreatedAt, LastEditedAt, NumbOfResponses, CompletionRate, Status, AvgCompletionTime, history = []) {
    return {
      IDs,
      AuthorName,
      CreatedAt,
      LastEditedAt,
      NumbOfResponses,
      CompletionRate,
      Status, 
      AvgCompletionTime,
      history,
    };
  }

  

  const data = [
    createData('Survey A', 'Alice', '2024-01-01', '2024-01-02', 50, '78%', 'Published', '10 Minutes', [
      { question: 'Q1', answerTime: '1.2 Minutes', skipped: '3.21%', questionType: 'Multiple Choice' },
      { question: 'Q2', answerTime: '3.5 Minutes', skipped: '0.03%', questionType: 'Multiple Choice' },
    ]),
    createData('Survey B', 'Bob', '2024-02-01', '2024-02-03', 35, '82%', 'Published', '4 Minutes',  [
      { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
      { question: 'Q2', answerTime: '1.3 Minutes', skipped: '1.10%', questionType: 'Open Question' },
    ]),
    createData('Survey C', 'Hans Hansen', '2024-03-01', '2024-03-03', 35, '93%', 'Published', '7.3 Minutes',  [
        { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
        { question: 'Q2', answerTime: '3.3 Minutes', skipped: '1.10%', questionType: 'Multiple Choice' },
        { question: 'Q3', answerTime: '5.1 Minutes', skipped: '0.10%', questionType: 'Multiple Choice' },
        { question: 'Q4', answerTime: '0.3 Minutes', skipped: '3.10%', questionType: 'Open Question' },
        { question: 'Q5', answerTime: '0.5 Minutes', skipped: '5.10%', questionType: 'Open Question'},
      ]),
      createData('Survey D', 'Bob', '2024-02-01', '2024-02-03', 0, '0%', 'Draft', '0 Minutes',  [
        { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
        { question: 'Q2', answerTime: '1.3 Minutes', skipped: '1.10%', questionType: 'Multiple Choice' },
      ]),
      createData('Survey E', 'Bob', '2024-02-01', '2024-02-03', 35, '82%', 'Published', '15 Minutes',  [
        { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
        { question: 'Q2', answerTime: '1.3 Minutes', skipped: '1.10%', questionType: 'Multiple Choice' },
      ]),
      createData('Survey F', 'Julie', '2024-02-01', '2024-02-03', 35, '82%', 'Published', '5.3 Minutes',  [
        { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
        { question: 'Q2', answerTime: '1.3 Minutes', skipped: '1.10%', questionType: 'Multiple Choice' },
      ]),
      createData('Survey G', 'Hans', '2024-02-01', '2024-02-03', 35, '82%', 'Published', '9.1 Minutes',  [
        { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
        { question: 'Q2', answerTime: '1.3 Minutes', skipped: '1.10%', questionType: 'Multiple Choice' },
      ]),
      createData('Survey H', 'Jørgen', '2024-02-01', '2024-02-03', 0, '0%', 'Draft', '0 Minutes',  [
        { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
        { question: 'Q2', answerTime: '1.3 Minutes', skipped: '1.10%', questionType: 'Multiple Choice' },
      ]),
      createData('Survey I', 'Louise', '2024-02-01', '2024-02-03', 35, '93%', 'Published', '44 Minutes',  [
        { question: 'Q1', answerTime: '2.0 Minutes', skipped: '0.00%', questionType: 'Multiple Choice' },
        { question: 'Q2', answerTime: '1.3 Minutes', skipped: '1.10%', questionType: 'Multiple Choice' },
      ]),
  ];
  

export default function SurveyList() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (event) => {
      setSearchTerm(event.target.value.toLowerCase());
    };

  const filteredRows = data.filter((row) =>
    row.IDs.toLowerCase().includes(searchTerm) ||
    row.AuthorName.toLowerCase().includes(searchTerm)
  );
  
    const paginatedRows =
        rowsPerPage > 0
        ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : filteredRows;
  

    const handleEdit = (id) => {
        console.log("Edit survey:", id);
      };
      
      const handleDelete = (id) => {
        console.log("Delete survey:", id);
      };
      

  return (
    <TableContainer sx={{marginTop:'30px'}} component={Paper}>
        <TextField
            label="Search by Title or Author"
            variant="outlined"
            size="small"
            sx={{ my: 2, ml: 2 }}
            onChange={handleSearch}
        />

      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell align="right">Author</TableCell>
            <TableCell align="right">Created At</TableCell>
            <TableCell align="right">Last Edited At</TableCell>
            <TableCell align="right">Number of Responses</TableCell>
            <TableCell align="right">Completion Rate</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Avg Completion Time</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {paginatedRows.map((row) => (
                <Row key={row.IDs} row={row} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={data.length}
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
  );
}
