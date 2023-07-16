// ** Services Imports
import { tokenService } from '../../services/auth/tokenService'
import { api } from '../../services/api/api'
import { authService } from '../../services/auth/authService'

// ** React
import * as React from 'react';
import { useEffect, useState } from 'react'

// ** Section
import UserListToolbar from '../../sections/pacientes/UserListToolbar'

// ** Lodash
import { filter } from 'lodash';

// ** MUI Imports
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
  TableHead,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import PencilBoxMultiple from 'mdi-material-ui/PencilBoxMultiple'

// Next
import { useRouter } from 'next/router'


// ** Functions
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

  // States
  const [pacientes, setPacientes] = useState([])
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  
  useEffect( async (ctx) => {
    const usuarioAutenticado = await authService.getSession(ctx)
    const endPoint = `${usuarioAutenticado.body.id}/paciente`
    
    const getPacientes = await api.getInformation(
      ctx,
      endPoint
    )

    setPacientes(getPacientes.body)
  }, [])

  // Funções utilizadas na tabela
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


  // Variaveis
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pacientes.length) : 0;
  const filteredUsers = applySortFilter(pacientes, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;
  const router = useRouter()

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
  }

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Pacientes
          </Typography>
          <Button variant="contained" onClick={() => handleDropdownClose('pacientes/novo')}>
            <AccountPlusOutline sx={{marginRight: 1, fontSize: '1.375rem', marginBottom: 1}}/>
            Novo Paciente
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Sexo</TableCell>
                  <TableCell>UBS</TableCell>
                  <TableCell sx={{width: 5}}>Editar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, nome, email, sexo, ubs } = row;
                  const selectedUser = selected.indexOf(nome) !== -1;

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>

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
                      
                      <TableCell align="center">
                        <IconButton size='small' onClick={() => {router.push(`pacientes/${id}`)}}>
                          <PencilBoxMultiple />
                        </IconButton>
                      </TableCell>

                      {/* <TableCell align="left">
                        {/* <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label> */}
                      {/* </TableCell> */} 
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
                            Não encontrado
                          </Typography>

                          <Typography variant="body2">
                            Não foram encontrados resultados para &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Tente verificar se há erros de digitação ou usar palavras completas.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
            </Table>
          </TableContainer>

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