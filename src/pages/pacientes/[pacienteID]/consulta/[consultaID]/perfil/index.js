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

const Perfil = () => {

    const router = useRouter()

    const pacienteID = router.query.pacienteID
    const consultaID = router.query.consultaID

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
    const [exame, setExame] = useState([])
    const [anamnese, setAnamnese] = useState([])

    useEffect( async (ctx) => {
      // Busca todas as Medidas antropométricas
      const endPointMedidas = `paciente/consulta/${consultaID}/medida`
      const getMedidas = await buscaInformacoes(ctx, endPointMedidas)
    
      getMedidas.body.forEach((element, index) => {
        const date = formataData(element.createdAt)
        getMedidas.body[index].dataDeCriacao = date
      })
      setMedida(getMedidas.body)
      // console.log(medida)

      // Busca todos os Exames laboratoriais
      const endPointExames = `paciente/consulta/${consultaID}/exame`
      const getExames = await buscaInformacoes(ctx, endPointExames)
      setExame(getExames.body)
      // console.log(exame)

      // Busca todas anamneses
      const endPointAnamnese = `paciente/consulta/${consultaID}/anamnese`
      const getAnamnese = await buscaInformacoes(ctx, endPointAnamnese)

      if(getAnamnese.body.length > 0){
        const data = formataData(getAnamnese.body[0]?.createdAt)
        getAnamnese.body.push({dataDeCriacao: data})
        setAnamnese(getAnamnese.body)
      }

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
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title='Anamnese' />
            <CardContent>
            {anamnese?.length > 0? (
                <>
                  <Typography variant='body2' sx={{ marginBottom: 3.25 }}>
                    A anamnese do paciente foi cadastrada no dia {anamnese[13]?.dataDeCriacao}. Abaixo
                    segue um breve resumo de algumas informações cadastradas.
                  </Typography>
                  <Divider />
                  <Typography variant='body1'>
                    {anamnese[0]?.questao}
                  </Typography>
                  <Typography variant='body2' mb={4} ml={5}>
                    {anamnese[0]?.resposta}
                  </Typography>

                  <Typography variant='body1'>
                    {anamnese[9]?.questao}
                  </Typography>
                  <Typography variant='body2' mb={4} ml={5}>
                    {anamnese[9]?.resposta}
                  </Typography>

                  <Typography variant='body1'>
                    {anamnese[11]?.questao}
                  </Typography>
                  <Typography variant='body2'ml={5}>
                    {anamnese[11]?.resposta}
                  </Typography>
                </>
                ):(
                  <Typography variant="subtitle1" gutterBottom sx={{display: 'flex', justifyContent: 'center', margin:10}}>
                    <CloseBoxMultiple sx={{marginRight: 2, fontSize: '1.375rem',}}/>
                    Nenhuma anamnese cadastrada
                  </Typography>
              )}
            </CardContent>
            <CardActions className='card-action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {anamnese?.length > 0?(
                <Button onClick={() => {window.location.replace(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/anamnese/${anamnese[0]?.id}`)}}>Editar</Button>
              ):(
                <Button onClick={() => {window.location.replace(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/anamnese`)}}>Adicionar</Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title='Exames Laboratoriais' />
            <CardContent>
            {exame?.length > 0? (
                <>
                  <Typography variant='body2' sx={{ marginBottom: 3.25 }}>
                    Computers have become ubiquitous in almost every facet of our lives. At work, desk jockeys spend hours in
                    front of their desktops, while delivery people scan bar codes with handhelds and workers in the field stay in
                    touch.
                  </Typography>
                  <Typography variant='body2'>
                    If you’re in the market for new desktops, notebooks, or PDAs, there are a myriad of choices. Here’s a rundown
                    of some of the best systems available.
                  </Typography>
                </>
                ):(
                  <Typography variant="subtitle1" gutterBottom sx={{display: 'flex', justifyContent: 'center', margin:10}}>
                    <CloseBoxMultiple sx={{marginRight: 2, fontSize: '1.375rem',}}/>
                    Nenhum exame laboratorial cadastrado
                  </Typography>
              )}
            </CardContent>
            <CardActions className='card- action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button>{exame?.length > 0? 'Editar': 'Adicionar'}</Button>
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

      <Card sx={{marginTop:10}}>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{marginTop: '25px'}}>
            <Typography variant="h5" gutterBottom>
              Plano Alimentar
            </Typography>
            <Button variant="contained" onClick={() => console.log('oi')}>
              <Nutrition sx={{marginRight: 1, fontSize: '1.375rem', marginBottom: 1}}/>
              Adicionar
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
                      {exame?.map(row => (
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
                Nenhum plano alimentar cadastrado
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