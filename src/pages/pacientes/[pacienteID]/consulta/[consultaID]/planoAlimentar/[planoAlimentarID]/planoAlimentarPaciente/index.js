import { useEffect, useState } from "react"
import { authService } from "../../../../../../../../services/auth/authService"
import { useRouter } from "next/router"
import { api } from "../../../../../../../../services/api/api"
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
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import PrinterOutline from 'mdi-material-ui/PrinterOutline'
import CloseBoxMultiple from 'mdi-material-ui/CloseBoxMultiple'


import { useFormik } from 'formik'
import * as Yup from 'yup';

import imagemLogo from '../../../../../../../../img/wepik-duotone-modern-healthy-organic-food-logo-20230626195207HvXd.png'
import Image from 'next/image'
import ListaAlimentosCadastrados from "../../../../../../../../MyComponents/ListaAlimentosCadastrados";

const PlanoAlimentar = () => {

  const [planoAlimentar, setPlanoAlimentar] = useState([])
  const [refeicoes, setRefeicoes] = useState([])
  const [alimento, setAlimento] = useState([])
  const [paciente, setPaciente] = useState(null)

  const router = useRouter()

  const pacienteID = router.query.pacienteID
  const consultaID = router.query.consultaID
  const planoAlimentarID = router.query.planoAlimentarID

  const buscaInformacoesPaciente = async (cpf, ctx = null) => {
    const endPoint = `login/paciente`
    const resposta = await api.postInformation(endPoint, cpf, ctx)

    setPaciente(resposta.body)

    return resposta
  }


  const buscaInformacoes = async (ctx, endPoint) => {

    const resposta = await api.getInformation(ctx, endPoint)

    return resposta
  }

  function formataData(data) {
    const date = new Date(data)
    let dia = null

    if (date.getDate() < 10)
      dia = `0${date.getDate()}`
    else
      dia = date.getDate()

    const dataDeCriacao = `${dia}/${date.getMonth() + 1}/${date.getFullYear()}`

    return dataDeCriacao
  }

  useEffect(async (ctx) => {
    if(paciente){
      // Busca informações do plano alimentar
      const endPointPlanoAlimentar = `paciente/logado/consulta/${consultaID}/plano/${planoAlimentarID}`
      const getPlanoAlimentar = await buscaInformacoes(ctx, endPointPlanoAlimentar)
      getPlanoAlimentar.body.dataFormatada = formataData(getPlanoAlimentar.body.createdAt)
      setPlanoAlimentar(getPlanoAlimentar.body)

      // // Busca todas refeicoes
      const endPointRefeicoes = `${paciente?.id_usuario}/paciente/logado/consulta/plano/${planoAlimentarID}/refeicao`
      const getRefeicoes = await buscaInformacoes(ctx, endPointRefeicoes)
      setRefeicoes(getRefeicoes.body)
      console.log(refeicoes)
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      cpf: '',
      submit: null
    },
    validationSchema: Yup.object({
      cpf: Yup
        .string()
        .max(11)
        .required('CPF é obrigatório')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const resposta = await buscaInformacoesPaciente(values)
    
        // router.push('/dashboard');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      { !paciente ? (
        <Grid>
          <Grid item xs={12} sm={12}>
            <CardHeader title='Informações do plano alimentar' />
            <Divider />
            <Container component="main" maxWidth="sm" sx={{mt:5}}>
              <Card>
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Image 
                    src={imagemLogo} 
                    alt='Imagem logo'
                    width={150}
                    height={150}
                    priority={true}
                  />
                  <Typography variant='h2'>NutriSIG</Typography>
                  <Typography variant='overline'>SISTEMA DE INFORMAÇÃO GERENCIAL PARA NUTRIÇÃO</Typography>
                  <Typography sx={{m:6}} variant='body2'>Para acessar o plano alimentar é necessário informar seu CPF.</Typography>

                  <Box sx={{ mt: 1 }}>
                    <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
                      <TextField
                        error={!!(formik.touched.cpf && formik.errors.cpf)}
                        autoFocus 
                        fullWidth
                        helperText={formik.touched.cpf && formik.errors.cpf}
                        id='cpf' 
                        label='CPF'
                        name='cpf'
                        type="string" 
                        value={formik.values.cpf}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ marginBottom: 4 }}
                      />
                      <Button
                        fullWidth
                        size='large'
                        variant='contained'
                        sx={{ marginBottom: 7 }}
                        type='submit'
                      >
                        Enviar
                      </Button>
                    </form>
                  </Box>
                </Box>
              </Card>
            </Container>
          </Grid>
        </Grid>
        ):(
          <Grid>
            <Grid item xs={12} sm={12}>
              <CardHeader title='Informações do plano alimentar' />
              <Divider />
              <>
                <Container sx={{ mt: 12 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ marginTop: '25px' }}>
                    <Typography variant="h5" gutterBottom>
                      Refeições
                    </Typography>
                    <Stack direction="row" alignItems="center">
                      <Grid item xs={12} sm={12} >
                        <Button variant="contained" sx={{ ml: 3, backgroundColor: '#1a78cf', '&:hover': { color: '#FFF', backgroundColor: '#00529d', } }}>
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
                                id={row?.id}
                              />                         
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
            </Grid>
          </Grid>
        )
      }
    </>
  )
}

export default PlanoAlimentar