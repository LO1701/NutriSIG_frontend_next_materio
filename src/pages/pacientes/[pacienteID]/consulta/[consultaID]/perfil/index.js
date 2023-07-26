// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CloseBoxMultiple from 'mdi-material-ui/CloseBoxMultiple'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../../../../../../services/auth/tokenService'

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

// ** Api Import
import { api } from '../../../../../../services/api/api'

// ** x-date-pickers (Componente de data)
import 'dayjs/locale/en-gb';

// ** import Select
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

const Perfil = () => {

    const router = useRouter()

    const pacienteID = router.query.pacienteID
    const consultaID = router.query.consultaID

    const buscaInformacoes = async (ctx, endPoint) => {
    
      const resposta = await api.getInformation(ctx, endPoint)
    
      return resposta
    }

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [medida, setMedida] = useState([])
    const [exame, setExame] = useState([])

    useEffect( async (ctx) => {
      // Busca todas as Medidas antropométricas
      const endPointMedidas = `paciente/consulta/${consultaID}/medida`
      const getMedidas = await buscaInformacoes(ctx, endPointMedidas)
      setMedida(getMedidas.body)

      // Busca todos os Exames
      const endPointExames = `paciente/consulta/${consultaID}/exame`
      const getExames = await buscaInformacoes(ctx, endPointExames)
      setExame(getExames.body)


    }, [])

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setPage(0);
      setRowsPerPage(parseInt(event.target.value, 10));
    };


  return (
    <>
      <Card>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{marginTop: '25px'}}>
            <Typography variant="h5" gutterBottom>
              Medidas Antropométricas
            </Typography>
            <Button variant="contained" onClick={() => console.log('oi')}>
              <AccountPlusOutline sx={{marginRight: 1, fontSize: '1.375rem', marginBottom: 1}}/>
              Nova Medida
            </Button>
          </Stack>

          {medida?.length > 0? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                      <TableRow>
                          <TableCell>Classificação</TableCell>
                          <TableCell>Peso atual</TableCell>
                          <TableCell>IMC</TableCell>
                          <TableCell sx={{width: 5}}>Editar</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {medida?.map(row => (
                          <TableRow
                              key={row.id}
                              sx={{
                                  '&:last-of-type td, &:last-of-type th': {
                                  border: 0
                                  }
                              }}
                          >
                              <TableCell component='th' scope='row'>
                                  {row.classificacao_imc}
                              </TableCell>
                              <TableCell component='th' scope='row'>
                                  {row.peso_atual}
                              </TableCell>
                              <TableCell component='th' scope='row'>
                                  {row.imc_atual}
                              </TableCell>
                              <TableCell align="center">
                                  <IconButton size='small' onClick={() => {router.push(`${paciente?.id}/consulta/${row.id}/perfil`)}}>
                                      <PencilBoxMultiple />
                                  </IconButton>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={medida.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
            ):(
              <Typography variant="subtitle1" gutterBottom sx={{display: 'flex', justifyContent: 'center', margin:10}}>
                <CloseBoxMultiple sx={{marginRight: 2, fontSize: '1.375rem',}}/>
                Nenhuma medida antropométrica cadastrada
              </Typography>
            )}
        </Container>
      </Card>

      <Card sx={{marginTop:10}}>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{marginTop: '25px'}}>
            <Typography variant="h5" gutterBottom>
              Exames Laboratoriais
            </Typography>
            <Button variant="contained" onClick={() => console.log('oi')}>
              <AccountPlusOutline sx={{marginRight: 1, fontSize: '1.375rem', marginBottom: 1}}/>
              Novo Exame
            </Button>
          </Stack>

          {exame?.length > 0? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                      <TableRow>
                          <TableCell>Nome</TableCell>
                          <TableCell>Data de cadastro no sistema</TableCell>
                          <TableCell sx={{width: 5}}>Editar</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {medida?.map(row => (
                          <TableRow
                              key={row.id}
                              sx={{
                                  '&:last-of-type td, &:last-of-type th': {
                                  border: 0
                                  }
                              }}
                          >
                              <TableCell component='th' scope='row'>
                                  {row.nome}
                              </TableCell>
                              <TableCell component='th' scope='row'>
                                  {row.createdAt}
                              </TableCell>
                              <TableCell align="center">
                                  <IconButton size='small' onClick={() => {router.push(`${paciente?.id}/consulta/${row.id}/perfil`)}}>
                                      <PencilBoxMultiple />
                                  </IconButton>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={exame.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
            ):(
              <Typography variant="subtitle1" gutterBottom sx={{display: 'flex', justifyContent: 'center', margin:10}}>
                <CloseBoxMultiple sx={{marginRight: 2, fontSize: '1.375rem',}}/>
                Nenhum exame laboratorial cadastrado
              </Typography>
            )}
        </Container>
      </Card>
    </>
  )
}

export default Perfil

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