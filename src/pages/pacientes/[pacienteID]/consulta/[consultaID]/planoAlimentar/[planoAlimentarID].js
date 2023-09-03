// ** Icons Imports
import CloseBoxMultiple from 'mdi-material-ui/CloseBoxMultiple'
import CalendarRange from 'mdi-material-ui/CalendarRange'
import CardTextOutline from 'mdi-material-ui/CardTextOutline'
import ClockTimeEightOutline from 'mdi-material-ui/ClockTimeEightOutline'


// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../../../../../../services/auth/tokenService'

// ** MUI Imports
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import ScaleBathroom from 'mdi-material-ui/ScaleBathroom'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Snackbar from '@mui/material/Snackbar'
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';

// ** Api Import
import { api } from '../../../../../../services/api/api'

// ** x-date-pickers (Componente de data)
import 'dayjs/locale/en-gb';

// ** import Select
import { useRouter } from 'next/router'
import { useEffect, useState, forwardRef } from 'react';
import { authService } from '../../../../../../services/auth/authService';

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { Box, FormTextbox } from 'mdi-material-ui';

import ListaAlimentosCadastrados from '../../../../../../MyComponents/ListaAlimentosCadastrados'


const PlanoID = () => {

  const router = useRouter()

  const pacienteID = router.query.pacienteID
  const consultaID = router.query.consultaID
  const planoAlimentarID = router.query.planoAlimentarID

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [planoAlimentar, setPlanoAlimentar] = useState([])
  const [refeicoes, setRefeicoes] = useState([])
  const [open, setOpen] = useState(false)
  const [openMensage, setOpenMensage] = useState(false)
  const [resposta, setResposta] = useState()

  // States de Alimentos
  const [openAlimento, setOpenAlimento] = useState(false)
  const [openMensageAlimento, setOpenMensageAlimento] = useState(false)
  const [respostaAlimento, setRespostaAlimento] = useState()
  const [idRefeicao, setIdRefeicao] = useState()

  // State Alimento select
  const [alimento, setAlimento] = useState([])
  const [idAlimento, setIdAlimento] = useState()

  // States dos TestFields
  const [alimentoSelecionado, setAlimentoSelecionado] = useState(null)
  const [gramas, setGramas] = useState()
  const [observacoes, setObservacoes] = useState()

  // States dos alimentos cadastrados
  const [alimentoCadastrado, setAlimentoCadastrado] = useState(null)

  // Notificação
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color: '#FFF' }} />;
  });

  const buscaInformacoes = async (ctx, endPoint) => {

    const resposta = await api.getInformation(ctx, endPoint)

    return resposta
  }

  const criaRefeicao = async (valores, ctx) => {
    const usuarioAutenticado = await authService.getSession(ctx)

    const endPoint = `${usuarioAutenticado.body.id}/paciente/consulta/plano/${planoAlimentarID}/refeicao`

    const resposta = await api.postInformation(endPoint, valores)

    return resposta
  }

  const criaAlimento = async (valores, ctx) => {

    const endPoint = `plano/${planoAlimentarID}/refeicao/${idRefeicao}/alimento/${alimentoSelecionado.id}/refeicaoAlimento`

    const resposta = await api.postInformation(endPoint, valores)

    return resposta
  }

  function formataData(data) {
    const date = new Date(data)
    let dia = null

    if (date.getDate() < 10)
      dia = `0${date.getDate()}`
    else
      dia = date.getDate()

    const dataDeCriacao = `${dia}/0${date.getMonth() + 1}/${date.getFullYear()}`

    return dataDeCriacao
  }

  useEffect(async (ctx) => {
    const usuarioAutenticado = await authService.getSession(ctx)

    // Busca informações do plano alimentar
    const endPointPlanoAlimentar = `paciente/consulta/${consultaID}/plano/${planoAlimentarID}`
    const getPlanoAlimentar = await buscaInformacoes(ctx, endPointPlanoAlimentar)
    getPlanoAlimentar.body.dataFormatada = formataData(getPlanoAlimentar.body.createdAt)
    setPlanoAlimentar(getPlanoAlimentar.body)

    // Busca todas refeicoes
    const endPointRefeicoes = `${usuarioAutenticado.body.id}/paciente/consulta/plano/${planoAlimentarID}/refeicao`
    const getRefeicoes = await buscaInformacoes(ctx, endPointRefeicoes)
    setRefeicoes(getRefeicoes.body)

    // Busca todos os alimentos do select
    const endPointAlimentos = `${usuarioAutenticado.body.id}/alimento`
    const getAlimentos = await buscaInformacoes(ctx, endPointAlimentos)
    setAlimento(getAlimentos.body)

    // // Busca todos os alimentos cadastrados na refeição
    // const endPointAlimentosCadastrado = `plano/${planoAlimentarID}/refeicao/${idRefeicao}/alimento/refeicaoAlimento`
    // const getAlimentosCadastrado = await buscaInformacoes(ctx, endPointAlimentosCadastrado)
    // setAlimentoCadastrado(getAlimentosCadastrado.body)
  }, [])

  // const buscaAlimentosCadastrados = async (idRefeicao, ctx) => {
  //   const endPointAlimentosCadastrado = `plano/${planoAlimentarID}/refeicao/${idRefeicao}/alimento/refeicaoAlimento`
  //   const getAlimentosCadastrado = await buscaInformacoes(ctx, endPointAlimentosCadastrado)
  //   setAlimentoCadastrado(getAlimentosCadastrado.body)

  //   return alimentoCadastrado.length
  // }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseMensage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMensage(false);
  };

  // Functions alimentos

  const handleClickOpenAlimento = (idRefeicao) => {
    setOpenAlimento(true);
    setIdRefeicao(idRefeicao)
  };

  const handleCloseAlimento = () => {
    setOpenAlimento(false);
  };

  const handleCloseMensageAlimento = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMensageAlimento(false);
  };



  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  // Formik
  const formikRefeicoes = useFormik({
    initialValues: {
      nome: '',
      horario: '',
      turno: '',
      descricao: '',
      submit: null
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nome: Yup
        .string()
        .max(255)
        .required('Nome é obrigatório'),
      horario: Yup
        .string()
        .required('Horário é obrigatório'),
      turno: Yup
        .string()
        .required(' Turno é obrigatório'),
      descricao: Yup
        .string()
    }),
    onSubmit: async (values, helpers) => {
      try {

        const res = await criaRefeicao(values)

        setResposta(res.body.msg)
        setOpenMensage(true)
        // setOpen(false)

        setTimeout(function () {
          location.reload()
        }, 2000)


        console.log(res.body)

      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });


  async function onSubmitAlimentos(event) {

    event.preventDefault()

    const valores = {
      observacao: observacoes,
      gramas: gramas
    }
    // console.log(valores)
    // console.log(alimentoSelecionado)
    const res = await criaAlimento(valores)

    setRespostaAlimento(res.body.msg)
    setOpenMensageAlimento(true)

    setTimeout(function () {
      location.reload()
    }, 2000)


    console.log(res.body)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title='Informações do plano alimentar' />
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} sx={{ marginTop: '25px' }}>
              <Grid item xs={12} sm={6}>
                <CardContent>
                  <Typography variant='body1'>
                    Nome: {planoAlimentar?.nome}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={12} sm={6} >
                <CardContent>
                  <Typography variant='body1'>
                    Máximo Kcal: {planoAlimentar?.teto_kcal} kcal
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={12} sm={6} >
                <CardContent>
                  <Typography variant='body1'>
                    Data de criação: {planoAlimentar?.dataFormatada}
                  </Typography>
                </CardContent>
              </Grid>
            </Stack>
            <CardActions className='card-action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => { window.location.replace(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/anamnese`) }}>Editar</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <>
        <Container sx={{ mt: 12 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ marginTop: '25px' }}>
            <Typography variant="h5" gutterBottom>
              Refeições
            </Typography>
            <Button variant="contained" onClick={handleClickOpen}>
              <ScaleBathroom sx={{ marginRight: 1, fontSize: '1.375rem', marginBottom: 1 }} />
              Adicionar
            </Button>
          </Stack>

          {refeicoes?.length > 0 ? (
            <>
              {refeicoes?.map(row => (
                <Grid container spacing={6} key={row?.id}>
                  <Grid item xs={12} sm={12}>
                    <Card sx={{ marginTop: 5 }}>
                      <CardHeader title={row?.nome} />
                      <Divider />
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Grid item xs={12} sm={3}>
                          <CardContent>
                            <Typography variant='body1'>
                              Turno: {row?.turno}
                            </Typography>
                          </CardContent>
                        </Grid>
                        <Grid item xs={12} sm={9} >
                          <CardContent>
                            <Typography variant='body1'>
                              Horário: {row?.horario}
                            </Typography>
                          </CardContent>
                        </Grid>
                      </Stack>
                      <Grid item xs={12} sm={6} >
                        <CardContent>
                          <Typography variant='body1'>
                            Descrição: {row?.descricao}
                          </Typography>
                        </CardContent>
                      </Grid>
                      <Divider />
                        <ListaAlimentosCadastrados 
                          id={row.id}
                        />
                      <Divider />
                      <CardActions className='card-action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => handleClickOpenAlimento(row?.id)}>Adicionar alimentos</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              ))}

            </>
          ) : (
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
              <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
              Nenhuma refeição cadastrada
            </Typography>
          )}
        </Container>
      </>

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Refeição</DialogTitle>
          <DialogContent dividers>
            <form noValidate autoComplete='off' onSubmit={formikRefeicoes.handleSubmit}>
              <Grid container spacing={7}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!(formikRefeicoes.touched.nome && formikRefeicoes.errors.nome)}
                    autoFocus
                    fullWidth
                    helperText={formikRefeicoes.touched.nome && formikRefeicoes.errors.nome}
                    id='nome'
                    label='Nome'
                    placeholder='Nome'
                    name='nome'
                    type="text"
                    value={formikRefeicoes.values.nome}
                    onChange={formikRefeicoes.handleChange}
                    sx={{ marginBottom: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <FormTextbox />
                        </InputAdornment>
                      )
                    }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!(formikRefeicoes.touched.horario && formikRefeicoes.errors.horario)}
                    autoFocus
                    fullWidth
                    helperText={formikRefeicoes.touched.horario && formikRefeicoes.errors.horario}
                    id='horario'
                    label='Horário para realização da refeição'
                    placeholder='08:00'
                    name='horario'
                    type="time"
                    value={formikRefeicoes.values.horario}
                    onChange={formikRefeicoes.handleChange}
                    sx={{ marginBottom: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <ClockTimeEightOutline />
                        </InputAdornment>
                      )
                    }} />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    error={!!(formikRefeicoes.touched.turno && formikRefeicoes.errors.turno)}
                    autoFocus
                    fullWidth
                    helperText={formikRefeicoes.touched.turno && formikRefeicoes.errors.turno}
                    id="turno"
                    name="turno"
                    type="string"
                    label="Turno"
                    placeholder="Ex: manhã"
                    value={formikRefeicoes.values.turno}
                    onChange={formikRefeicoes.handleChange}
                    sx={{ marginBottom: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CardTextOutline />
                        </InputAdornment>
                      )
                    }} />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    error={!!(formikRefeicoes.touched.descricao && formikRefeicoes.errors.descricao)}
                    autoFocus
                    fullWidth
                    helperText={formikRefeicoes.touched.descricao && formikRefeicoes.errors.descricao}
                    id="descricao"
                    name="descricao"
                    type="string"
                    label="Descricao"
                    placeholder="Descrição"
                    value={formikRefeicoes.values.descricao}
                    onChange={formikRefeicoes.handleChange}
                    sx={{ marginBottom: 4 }}
                    multiline
                    rows={2}
                  />
                </Grid>

                {formikRefeicoes.errors.submit && (
                  <Snackbar open={openMensage} autoHideDuration={12000000} onClose={handleCloseMensage}>
                    <Alert onClose={handleCloseMensage} severity="error" sx={{ width: '100%' }}>
                      {formikRefeicoes.errors.submit}
                    </Alert>
                  </Snackbar>
                )}

                <Snackbar open={openMensage} autoHideDuration={8000} onClose={handleCloseMensage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                  <Alert onClose={handleCloseMensage} >
                    {resposta}
                  </Alert>
                </Snackbar>

                <Divider />

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <DialogActions>
                    <Button variant='contained' type='submit'>
                      Salvar
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal dos alimentos */}

      <div>
        <Dialog open={openAlimento} onClose={handleCloseAlimento}>
          <DialogTitle>Alimento</DialogTitle>
          <DialogContent dividers>
            <form noValidate autoComplete='off' onSubmit={onSubmitAlimentos}>
              <Grid container spacing={7}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    value={alimentoSelecionado}
                    onChange={(event, newValue) => {
                      setAlimentoSelecionado(newValue);
                    }}
                    id="alimento"
                    disableClearable
                    noOptionsText={"Nenhuma alimento encontrado"}
                    isOptionEqualToValue={(alimento, value) => alimento.nome === value.nome}
                    options={alimento}
                    getOptionLabel={(alimento) => alimento.nome}
                    renderInput={(params) => (
                      <TextField
                        key={alimento?.id}
                        {...params}
                        label="Alimentos"
                        InputProps={{
                          ...params.InputProps
                        }}
                      />
                    )}
                  />
                  {/* <Autocomplete
                    id="alimento"
                    value={alimentoSelecionado}
                    onChange={(event, newValue) => {
                      setAlimentoSelecionado(newValue);
                    }}
                    options={alimento}
                    sx={{ width: 300 }}
                    getOptionLabel={(alimento) => alimento.nome}
                    isOptionEqualToValue={(alimento, value) => alimento.nome === value.nome}
                    noOptionsText={"Nenhuma alimento encontrada"}
                    // renderOption={(props, alimento) => (
                    //   <Box component="li" {...props} key={alimento.id}>
                    //     {alimento.nome}
                    //   </Box>
                    // )}
                    // renderInput={(params) => (
                    //   <TextField
                    //     {...params}
                    //     label="Alimentos"
                    //   />
                    // )}
                    renderInput={(params) => (
                      <TextField
                        key={alimento?.id}
                        {...params}
                        label="Alimentos"
                        InputProps={{
                          ...params.InputProps
                        }}
                      />
                    )}
                  /> */}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    fullWidth
                    id='gramas'
                    label='Gramas'
                    placeholder='Ex: 200'
                    name='gramas'
                    type="number"
                    value={gramas}
                    onChange={(event) => setGramas(event.target.value)}
                    sx={{ marginBottom: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <FormTextbox />
                        </InputAdornment>
                      )
                    }} />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    multiline
                    rows={3}
                    autoFocus
                    fullWidth
                    id='observacoes'
                    label='Observações'
                    placeholder=''
                    name='observacoes'
                    type="string"
                    value={observacoes}
                    onChange={(event) => setObservacoes(event.target.value)}
                    sx={{ marginBottom: 4 }}
                  />
                </Grid>

                <Snackbar open={openMensageAlimento} autoHideDuration={8000} onClose={handleCloseMensage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                  <Alert onClose={handleCloseMensageAlimento} >
                    {respostaAlimento}
                  </Alert>
                </Snackbar>

                <Divider />

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <DialogActions>
                    <Button variant='contained' type='submit'>
                      Salvar
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </div>
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