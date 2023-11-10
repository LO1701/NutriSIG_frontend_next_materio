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
  IconButton,
} from '@mui/material';
import ScaleBathroom from 'mdi-material-ui/ScaleBathroom'
import PrinterOutline from 'mdi-material-ui/PrinterOutline'
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
import { useEffect, useState, forwardRef, useRef } from 'react';
import { authService } from '../../../../../../services/auth/authService';

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { ArrowLeftCircle, Box, FormTextbox, PencilBoxMultiple, React } from 'mdi-material-ui';

import ListaAlimentosCadastrados from '../../../../../../MyComponents/ListaAlimentosCadastrados'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useReactToPrint } from 'react-to-print'
import Head from 'next/head'

import imagemLogo from '../../../../../../img/wepik-duotone-modern-healthy-organic-food-logo-20230626195207HvXd.png'
import Image from 'next/image'
import ListaAlimentosCadastradosImpressao from '../../../../../../MyComponents/ListaAlimentosCadastradosImpressao'
import CardInformacoesNutricionais from '../../../../../../MyComponents/CardInformacoesNutricionais'

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
  const [usuario, setUsuario] = useState()
  const [verificadorImpressao, setVerificadorImpressao] = useState(0)

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

  // States dos alimentos cadastrados nas refeicoes
  const [alimentoRefeicao, setAlimentoRefeicao] = useState([])
  const [testaCard, setTestaCard] = useState([])

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
    let mes = null

    if (date.getDate() < 10)
      dia = `0${date.getDate() + 1}`
    else
      dia = date.getDate() + 1

    if ((date.getMonth() + 1) < 10)
      mes = `0${date.getMonth() + 1}`
    else
      mes = date.getMonth() + 1

    const dataDeCriacao = `${dia}/${mes}/${date.getFullYear()}`

    return dataDeCriacao
  }

  useEffect(async (ctx) => {
    const usuarioAutenticado = await authService.getSession(ctx)

    setUsuario(usuarioAutenticado.body)

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

    // Busca todos os alimentos das refeicoes

    if (getRefeicoes.body.length > 0) {
      const dadosKcal = []
      const dadosCarbo = []
      const dadosProteinas = []

      getRefeicoes.body.forEach(async (element, index) => {
        const endPointAlimentosRef = `plano/${planoAlimentarID}/refeicao/${element.id}/alimento/refeicaoAlimento`
        const getAlimentosRef = await buscaInformacoes(ctx, endPointAlimentosRef)
        console.log(getAlimentosRef.body)
        setTestaCard(getAlimentosRef.body.length)
        let auxilioKcal = 0
        let auxilioCarbo = 0
        let auxilioProteinas = 0

        for (let i = 0; i < getAlimentosRef.body.length; i++) {

          auxilioKcal = auxilioKcal + getAlimentosRef.body[i].calorias_kcal
          auxilioCarbo = auxilioCarbo + getAlimentosRef.body[i].carboidratos
          auxilioProteinas += getAlimentosRef.body[i].proteinas

          if (i === getAlimentosRef.body.length - 1) {
            dadosKcal[index] = auxilioKcal
            dadosCarbo[index] = auxilioCarbo
            dadosProteinas[index] = auxilioProteinas
          }
        }

        let somaKcal = 0
        let somaCarbo = 0
        let somaProteinas = 0

        dadosKcal.forEach(element => {
          somaKcal += element
        });

        dadosCarbo.forEach(element => {
          somaCarbo += element
        });

        dadosProteinas.forEach(element => {
          somaProteinas += element
        });

        setAlimentoRefeicao({
          kcal: somaKcal,
          carbo: somaCarbo,
          proteinas: somaProteinas,
        })

      });
    }

  }, [])

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

  // Function de gerar o pdf

  const geraPdfPlanoAlimentar = () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs

    const titulo = [
      {
        text: 'Plano alimentar',
        fontSize: 15,
        margin: [15, 20, 15, 45], // left, top, right, bottom
        bold: true
      }
    ]

    const informacoesPlanoAlimenter = refeicoes.map((refeicao) => {

      return [
        {
          text: refeicao.nome,
          style: 'header'
        }
      ]
    })

    function rodape(paginaAtual, numeroPaginas) {
      return [
        {
          text: `${paginaAtual}/${numeroPaginas}`,
          alignment: 'right',
          fontSize: 9,
          margin: [0, 10, 20, 0], // left, top, right, bottom
          bold: true
        }
      ]

    }

    const documentoConfigurado = {
      pageSize: 'A4',
      pageMargins: [15, 50, 15, 40],
      header: [titulo],
      content: [informacoesPlanoAlimenter],
      footer: rodape
    }

    pdfMake.createPdf(documentoConfigurado).open();
  }

  const componentRef = useRef()
  const eventoImpressao = useReactToPrint({
    content: () => componentRef.current,
  })

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
          router.reload()
        }, 2000)

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
      router.reload()
    }, 2000)

  }


  return (
    <>
      <IconButton size='small' sx={{ marginBottom: 4 }} onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/perfil`) }}>
        <ArrowLeftCircle sx={{ marginRight: 2, fontSize: '1.375rem', }} />
        Perfil
      </IconButton>
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

      {testaCard > 0 &&
        <Grid container spacing={6} mt={5}>
          <Grid item xs={12} sm={6} md={4}>
            <CardInformacoesNutricionais titulo='Total de Kcal' valorTotalNutriente={alimentoRefeicao?.kcal?.toFixed(2)} cor={'#10b981'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CardInformacoesNutricionais titulo='Total de Carboidratos' valorTotalNutriente={alimentoRefeicao?.carbo?.toFixed(2)} cor={'#16b1ff'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CardInformacoesNutricionais titulo='Total de Proteínas' valorTotalNutriente={alimentoRefeicao?.proteinas?.toFixed(2)} cor={'#56ca00'} />
          </Grid>
        </Grid>
      }

      <>
        <Container sx={{ mt: 12 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ marginTop: '25px' }}>
            <Typography variant="h5" gutterBottom>
              Refeições
            </Typography>
            <Stack direction="row" alignItems="center">
              <Grid item xs={12} sm={12} >
                <Button variant="contained" onClick={handleClickOpen}>
                  <ScaleBathroom sx={{ marginRight: 1, fontSize: '1.375rem', marginBottom: 1 }} />
                  Adicionar
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} >
                <Button variant="contained" onClick={eventoImpressao} sx={{ ml: 3, backgroundColor: '#1a78cf', '&:hover': { color: '#FFF', backgroundColor: '#00529d', } }}>
                  <PrinterOutline sx={{ marginRight: 1, fontSize: '1.375rem', marginBottom: 1 }} />
                  Imprimir
                </Button>
              </Grid>
            </Stack>
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
                        key={row?.id}
                        id={row?.id}
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

      {/* Modal das refeições */}
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
                    noOptionsText={"Nenhum alimento encontrado"}
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
                    label='Medida caseira'
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

      {/* html de impressão */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <>
            {refeicoes?.length > 0 ? (
              <>
                <Stack direction="column" alignItems="center" justifyContent="space-between" mt={5}>
                  <Image
                    src={imagemLogo}
                    alt='Imagem logo'
                    width={90}
                    height={90}
                  />
                  <Typography variant='h4' color={'#524e59'}>NutriSIG</Typography>
                  <Typography variant='overline' color={'#75737c'} sx={{ fontSize: 10 }}>SISTEMA DE INFORMAÇÃO GERENCIAL PARA NUTRIÇÃO</Typography>
                </Stack>
                <h2 style={{ marginLeft: 55, color: '#000' }}>Plano Alimentar</h2>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <h4 style={{ margin: 15, color: '#000' }}>Nutricionista: {usuario?.nome}</h4>
                  <h4 style={{ margin: 15, color: '#000' }}>Máximo Kcal: {planoAlimentar?.teto_kcal} kcal</h4>
                  <h4 style={{ margin: 15, color: '#000' }}>Data de criação: {planoAlimentar?.dataFormatada}</h4>
                </Stack>
                {refeicoes?.map(row => (
                  <Grid container spacing={6} key={row?.id}>
                    <Grid item xs={12} sm={12}>
                      <hr className="solid" style={{ width: 995 }} />
                      <Typography variant='h6' color={'#000'} ml={4}>{row?.nome}</Typography>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Grid item xs={12} sm={3}>
                          <CardContent>
                            <Typography variant='body1' color={'#000'}>
                              Turno: {row?.turno}
                            </Typography>
                          </CardContent>
                        </Grid>
                        <Grid item xs={12} sm={9} >
                          <CardContent>
                            <Typography variant='body1' color={'#000'}>
                              Horário: {row?.horario}
                            </Typography>
                          </CardContent>
                        </Grid>
                      </Stack>
                      <Grid item xs={12} sm={6} mt={-7}>
                        <CardContent>
                          <Typography variant='body1' color={'#000'}>
                            Descrição: {row?.descricao}
                          </Typography>
                        </CardContent>
                      </Grid>
                      <ListaAlimentosCadastradosImpressao
                        id={row?.id}
                      />

                    </Grid>
                  </Grid>
                ))}

              </>
            ) : (
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#000', display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
                Nenhuma refeição cadastrada
              </Typography>
            )}
          </>
        </div>
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