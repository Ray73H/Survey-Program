import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const accountData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Experimenter', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Super User', status: 'Inactive' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Experimenter', status: 'Active' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Experimentee', status: 'Active' },
    { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'Experimentee', status: 'Inactive' },
    { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'Experimenter', status: 'Active' },
    { id: 7, name: 'George Costanza', email: 'george@example.com', role: 'Experimenter', status: 'Inactive' },
    { id: 8, name: 'Hannah Montana', email: 'hannah@example.com', role: 'Super User', status: 'Active' },
    { id: 9, name: 'Ian Malcolm', email: 'ian@example.com', role: 'Experimenter', status: 'Active' },
    { id: 10, name: 'Jane Doe', email: 'jane@example.com', role: 'Super User', status: 'Inactive' },
  ];

const AccountManagerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0); // Reset to first page on search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    console.log('Edit account with ID:', id);
    // Implement edit functionality here
  };

  const handleDelete = (id) => {
    console.log('Delete account with ID:', id);
    // Implement delete functionality here
  };

  const filteredData = accountData.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm) ||
      account.email.toLowerCase().includes(searchTerm)
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  

  return (
    <Box sx={{ marginTop: '30px' }}>
      <TextField
        label="Search by Name or Email"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        onChange={handleSearchChange}
      />
      <TableContainer component={Paper}>
        <Table aria-label="account manager table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.role}</TableCell>
                <TableCell>
                  <Chip
                    label={account.status}
                    color={account.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(account.id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(account.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2">No accounts found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
};

export default AccountManagerTable;
