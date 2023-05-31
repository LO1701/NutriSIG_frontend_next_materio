// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from '../../@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
// import Table from '../../views/dashboard/Table'
import { tokenService } from '../../services/auth/tokenService'
import { useEffect, useState } from 'react'
 import { api } from '../../services/api/api'
import { authService } from '../../services/auth/authService'
import UserListToolbar from '../../sections/pacientes/UserListToolbar'
import UserListHead from '../../sections/pacientes/UserListHead'


import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
// import { Button, Container, Stack, Typography, Card } from '@mui/material'
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { DataGrid, 	ptBR } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import * as React from 'react';

const TABLE_HEAD = [
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'email', label: 'email', alignRight: false },
  { id: 'sexo', label: 'sexo', alignRight: false },
  { id: 'ubs', label: 'ubs', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}



function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}



const Pacientes = () => {


  const [pacientes, setPacientes] = useState([])

  useEffect( async (ctx) => {
    const usuarioAutenticado = await authService.getSession(ctx)
    const endPoint = `${usuarioAutenticado.body.id}/paciente`
    
    const getPacientes = await api.getInformation(
      ctx,
      endPoint
    )

    setPacientes(getPacientes.body)
  }, [])

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = pacientes.map((n) => n.nome);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pacientes.length) : 0;

  const filteredUsers = applySortFilter(pacientes, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

 
  
  // const columns = [
  //   { field: 'id', headerName: 'ID', width: 70 },
  //   { field: 'nome', headerName: 'Nome', width: 350 },
  //   { field: 'email', headerName: 'Email', width: 350 },
  //   { field: 'sexo', headerName: 'Sexo', width: 130 },
  //   { field: 'ubs', headerName: 'UBS', type: 'number', width: 100 },
  //   { field: 'acoes', headerName: 'Ações', type: 'number', width: 100 },
  // ];

  // const numeroPaginacao = pacientes.length
  
  // return (

  //   <Container>
  //     <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
  //       <Typography variant="h4" gutterBottom>
  //         Pacientes
  //       </Typography>
  //       <Button variant="contained" >
  //         Novo Paciente
  //       </Button>
  //     </Stack>

  //     <Card>
  //       {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
  //       <Box>
  //         <DataGrid
  //           rows={pacientes}
  //           columns={columns}
  //           initialState={{
  //             pagination: {
  //               paginationModel: {
  //                 pageSize: 5,
  //                 page: 0
  //               },
  //             },
  //           }}
  //           pageSizeOptions={[5, 10]}
  //           checkboxSelection
  //           disableRowSelectionOnClick
  //           localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
  //         />
  //       </Box>  
  //     </Card>
  //   </Container>
  // )


  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          {/* <Scrollbar> */}
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={pacientes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, nome, email, sexo, ubs } = row;
                    const selectedUser = selected.indexOf(nome) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, nome)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {nome}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{sexo}</TableCell>

                        <TableCell align="left">{ubs}</TableCell>

                        <TableCell align="left">
                          {/* <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label> */}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            {/* <Iconify icon={'eva:more-vertical-fill'} /> */}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          {/* </Scrollbar> */}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pacientes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          {/* <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} /> */}
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          {/* <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} /> */}
          Delete
        </MenuItem>
      </Popover>
    </>
  );



}

export default Pacientes

export const getServerSideProps = async (ctx) => {
  const token = tokenService.get(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
 

{/* <ApexChartWrapper>
<Grid container spacing={6}>
  <Grid item xs={12}>
    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
    <Table pacientes={pacientes}/>
  </Grid>
</Grid>
</ApexChartWrapper> */}