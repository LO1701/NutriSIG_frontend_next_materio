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
  CardHeader,
  CardContent,
  CardActions,
} from '@mui/material';
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import Nutrition from 'mdi-material-ui/Nutrition'
import ScaleBathroom from 'mdi-material-ui/ScaleBathroom' 
import PencilBoxMultiple from 'mdi-material-ui/PencilBoxMultiple'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// ** Api Import
import { api } from '../../../../../../services/api/api'

// ** x-date-pickers (Componente de data)
import 'dayjs/locale/en-gb';

// ** import Select
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { forEach } from 'lodash';
import { element } from 'prop-types';
import Link from 'next/link';
import { authService } from '../../../../../../services/auth/authService';

const PlanoID = () => {

    const router = useRouter()
    

    const pacienteID = router.query.pacienteID
    const consultaID = router.query.consultaID
    const planoAlimentarID = router.query.planoAlimentarID

    const buscaInformacoes = async (ctx, endPoint) => {
        
        const resposta = await api.getInformation(ctx, endPoint)
    
        return resposta
    }

    function formataData (data) {
      const date = new Date(data)
      let dia = null

      if(date.getDate()<10)
        dia = `0${date.getDate()}`
      else
        dia = date.getDate()

      const dataDeCriacao = `${dia}/0${date.getMonth()+1}/${date.getFullYear()}`
      
      return dataDeCriacao
    }

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [medida, setMedida] = useState([])
    const [refeicoes, setRefeicoes] = useState([])

    useEffect( async (ctx) => {
        const usuarioAutenticado = await authService.getSession(ctx)

        // Busca todas refeicoes
        const endPointRefeicoes = `${usuarioAutenticado.body.id}/paciente/consulta/plano/${planoAlimentarID}/refeicao`
        const getRefeicoes = await buscaInformacoes(ctx, endPointRefeicoes)
        setRefeicoes(getRefeicoes.body)


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
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title='Informações do plano alimentar' />
            <CardContent>
                <Typography variant='body1'>
                    info1
                </Typography>
            </CardContent>
            <CardActions className='card-action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => {window.location.replace(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/anamnese`)}}>Editar</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{marginTop:10}}>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{marginTop: '25px'}}>
            <Typography variant="h5" gutterBottom>
              Medidas Antropométricas
            </Typography>
            <Button variant="contained" onClick={() => console.log('oi')}>
              <ScaleBathroom sx={{marginRight: 1, fontSize: '1.375rem', marginBottom: 1}}/>
              Adicionar
            </Button>
          </Stack>

          {medida?.length > 0? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                      <TableRow>
                          <TableCell>Data de cadastro</TableCell>
                          <TableCell>Classificação</TableCell>
                          <TableCell>Peso</TableCell>
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
                                  {row.dataDeCriacao}
                              </TableCell>
                              <TableCell component='th' scope='row'>
                                  {row.classificacao_imc}
                              </TableCell>
                              <TableCell component='th' scope='row'>
                                  {row.peso_atual} kg
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
    </>
  )
}

export default PlanoID

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