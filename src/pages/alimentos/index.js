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
  Collapse,
  Box,
} from '@mui/material';
import FoodAppleOutline from 'mdi-material-ui/FoodAppleOutline'
import PencilBoxMultiple from 'mdi-material-ui/PencilBoxMultiple'
import ArrowDownDropCircleOutline from 'mdi-material-ui/ArrowDownDropCircleOutline'
import ArrowUpDropCircleOutline from 'mdi-material-ui/ArrowUpDropCircleOutline'

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

const Alimentos = () => {
  // States
  const [alimentos, setAlimentos] = useState([])
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(async (ctx) => {
    const usuarioAutenticado = await authService.getSession(ctx)
    const endPoint = `${usuarioAutenticado.body.id}/alimento`

    const getAlimentos = await api.getInformation(
      ctx,
      endPoint
    )

    setAlimentos(getAlimentos.body)
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
      const newSelecteds = alimentos.map((n) => n.nome);
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - alimentos.length) : 0;
  const filteredUsers = applySortFilter(alimentos, getComparator(order, orderBy), filterName);
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
            Alimentos
          </Typography>
          <Button variant="contained" onClick={() => handleDropdownClose('alimentos/novo')}>
            <FoodAppleOutline sx={{ marginRight: 1, fontSize: '1.375rem', marginBottom: 1 }} />
            Novo Alimento
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeHolder='Pesquisar alimento...' />

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 5 }}></TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell sx={{ width: 5 }}>Editar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, nome, categoria } = row;
                  const selectedUser = selected.indexOf(nome) !== -1;

                  return (
                    <>
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser} sx={{ '& > *': { borderBottom: 'unset' } }}>

                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                          >
                            {open ? <ArrowUpDropCircleOutline /> : <ArrowDownDropCircleOutline />}
                          </IconButton>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {nome}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{categoria}</TableCell>

                        <TableCell align="center">
                          <IconButton size='small' onClick={() => { router.push(`alimentos/${id}`) }}>
                            <PencilBoxMultiple />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, mb: 5 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Informações Nutricionais
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Kcal</TableCell>
                                    <TableCell>Carboidratos</TableCell>
                                    <TableCell align="right">Colesterol</TableCell>
                                    <TableCell align="right">Proteínas</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow key={id}>
                                    <TableCell component="th" scope="row">
                                      {row?.calorias_kcal?.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{row?.carboidratos?.toFixed(2)}</TableCell>
                                    <TableCell align="right">{row?.colesterol}</TableCell>
                                    <TableCell align="right">{row?.proteinas?.toFixed(2)}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
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
            count={alimentos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  )
}

export default Alimentos

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
