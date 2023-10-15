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
import ArrowLeftCircle from 'mdi-material-ui/ArrowLeftCircle'
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

const Perfil = () => {

  const router = useRouter()

  const pacienteID = router.query.pacienteID
  const consultaID = router.query.consultaID

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [medida, setMedida] = useState([])
  const [exame, setExame] = useState([])
  const [primeirosExames, setPrimeirosExames] = useState([])
  const [anamnese, setAnamnese] = useState([])
  const [planoAlimentar, setPlanoAlimentar] = useState([])

  const buscaInformacoes = async (ctx, endPoint) => {

    const resposta = await api.getInformation(ctx, endPoint)

    return resposta
  }

  function formataData(data) {
    const date = new Date(data)
    let dia = null
    let mes = null

    if (date.getDate() < 10)
      dia = `0${date.getDate()+1}`
    else
      dia = date.getDate()+1

    if ((date.getMonth()+1) < 10)
      mes = `0${date.getMonth()+1}`
    else
      mes = date.getMonth()+1

    const dataDeCriacao = `${dia}/${mes}/${date.getFullYear()}`

    return dataDeCriacao
  }

  useEffect(async (ctx) => {
    // Busca todas as Medidas antropométricas
    const endPointMedidas = `paciente/consulta/${consultaID}/medida`
    const getMedidas = await buscaInformacoes(ctx, endPointMedidas)

    getMedidas.body.forEach((element, index) => {
      const date = formataData(element.createdAt)
      getMedidas.body[index].dataDeCriacao = date
    })
    setMedida(getMedidas.body)

    // Busca todos os Exames laboratoriais
    const endPointExames = `paciente/consulta/${consultaID}/exame`
    const getExames = await buscaInformacoes(ctx, endPointExames)
    setExame(getExames.body)

    if(getExames.body.length > 0){
      const dataUltimoExame = formataData(getExames.body[getExames.body.length-1].createdAt)
      getExames.body[getExames.body.length-1].data = dataUltimoExame
      setPrimeirosExames(getExames.body[getExames.body.length-1])
    }

console.log(primeirosExames)

    // Busca todas anamneses
    const endPointAnamnese = `paciente/consulta/${consultaID}/anamnese`
    const getAnamnese = await buscaInformacoes(ctx, endPointAnamnese)

    if (getAnamnese.body.length > 0) {
      const data = formataData(getAnamnese.body[0]?.createdAt)
      getAnamnese.body.push({ dataDeCriacao: data })
      setAnamnese(getAnamnese.body)
    }

    // Busca todos planos alimentares
    const endPointPlanoAlimentar = `paciente/${pacienteID}/consulta/${consultaID}/plano`
    const getPlanosAlimentares = await buscaInformacoes(ctx, endPointPlanoAlimentar)
    
    getPlanosAlimentares.body.forEach((element, index) => {
      const dateCriacao = formataData(element.createdAt)
      const dateValidade = formataData(element.validade)
      getPlanosAlimentares.body[index].dataDeCriacaoPlano = dateCriacao
      getPlanosAlimentares.body[index].dataDeValidade = dateValidade
    })
    
    setPlanoAlimentar(getPlanosAlimentares.body)

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
      <IconButton size='small' sx={{ marginBottom: 4 }} onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}`) }}>
        <ArrowLeftCircle sx={{ marginRight: 2, fontSize: '1.375rem', }} />
        Informações iniciais
      </IconButton>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title='Anamnese' />
            <CardContent>
              {anamnese?.length > 0 ? (
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
                  <Typography variant='body2' ml={5}>
                    {anamnese[11]?.resposta}
                  </Typography>
                </>
              ) : (
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
                  <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
                  Nenhuma anamnese cadastrada
                </Typography>
              )}
            </CardContent>
            <CardActions className='card-action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {anamnese?.length > 0 ? (
                <Button onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/anamnese/${anamnese[0]?.id}`) }}>Editar</Button>
              ) : (
                <Button onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/anamnese`) }}>Adicionar</Button>
              )}
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title='Informações sobre os Exames Laboratoriais' />
            <CardContent>
              {exame?.length > 0 ? (
                <>
                  <Typography variant='body2' sx={{ marginBottom: 3.25 }}>
                    Abaixo segue as informações do último exame cadastrado:
                  </Typography>
                  <Typography variant='body2' mb={2}>
                    - Nome/Tipo: {primeirosExames?.nome}
                  </Typography>
                  <Typography variant='body2' mb={2}>
                    - Observações: {primeirosExames?.observacoes}
                  </Typography>
                  <Typography variant='body2'>
                    - Data de cadastro: {primeirosExames?.data}
                  </Typography>
                </>
              ) : (
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
                  <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
                  Nenhum exame laboratorial cadastrado
                </Typography>
              )}
            </CardContent>
            <CardActions className='card- action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {exame?.length > 0 ? (
                <Button onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/exame/todosExames`) }}>Visualizar todos os exames</Button>
              ) : (
                <Button onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/exame`) }}>Adicionar</Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ marginTop: 10 }}>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ marginTop: '25px' }}>
            <Typography variant="h5" gutterBottom>
              Medidas Antropométricas
            </Typography>
            <Button variant="contained" onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/medida`) }}>
              <ScaleBathroom sx={{ marginRight: 1, fontSize: '1.375rem', marginBottom: 1 }} />
              Adicionar
            </Button>
          </Stack>

          {medida?.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data de cadastro</TableCell>
                      <TableCell>Classificação</TableCell>
                      <TableCell>Peso</TableCell>
                      <TableCell>IMC</TableCell>
                      <TableCell sx={{ width: 5 }}>Editar</TableCell>
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
                          <IconButton size='small' onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/medida/${row.id}`) }}>
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
          ) : (
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
              <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
              Nenhuma medida antropométrica cadastrada
            </Typography>
          )}
        </Container>
      </Card>

      <Card sx={{ marginTop: 10 }}>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ marginTop: '25px' }}>
            <Typography variant="h5" gutterBottom>
              Plano Alimentar
            </Typography>
            <Button variant="contained" onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/planoAlimentar`) }}>
              <Nutrition sx={{ marginRight: 1, fontSize: '1.375rem', marginBottom: 1 }} />
              Adicionar
            </Button>
          </Stack>

          {planoAlimentar?.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell sx={{textAlign:'center'}}>Data de Cadastro</TableCell>
                      <TableCell sx={{textAlign:'center'}}>Data de validade</TableCell>
                      <TableCell sx={{textAlign:'center'}}>Máximo kcal </TableCell>
                      <TableCell sx={{ width: 5 }}>Editar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planoAlimentar?.map(row => (
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
                        <TableCell component='th' scope='row' sx={{textAlign:'center'}}>
                          {row.dataDeCriacaoPlano}
                        </TableCell>
                        <TableCell component='th' scope='row' sx={{textAlign:'center'}}>
                          {row.dataDeValidade}
                        </TableCell>
                        <TableCell component='th' scope='row' sx={{textAlign:'center'}}>
                          {row.teto_kcal}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size='small' onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/planoAlimentar/${row.id}`) }}>
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
                count={planoAlimentar.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
              <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
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