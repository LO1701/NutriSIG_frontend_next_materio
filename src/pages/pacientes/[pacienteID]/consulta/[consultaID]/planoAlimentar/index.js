// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import CardHeader from '@mui/material/CardHeader'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CalendarRange from 'mdi-material-ui/CalendarRange'
import CardBulletedOutline from 'mdi-material-ui/CardBulletedOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import Home from 'mdi-material-ui/Home'
import CardTextOutline from 'mdi-material-ui/CardTextOutline'
import FormTextbox from 'mdi-material-ui/FormTextbox'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../../../../../../services/auth/tokenService'
import { useAuth } from '../../../../../../@core/hooks/useAuth'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';

// ** Api Import
import { api } from '../../../../../../services/api/api'

// ** x-date-pickers (Componente de data)
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';

// ** import Select
import { useRouter } from 'next/router'
import { IconButton } from '@mui/material'
import { ArrowLeftCircle } from 'mdi-material-ui'


// ** Styles
const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

// Notificação
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color: '#FFF' }} />;
});

const NovoPlanoAlimentar = () => {

  const auth = useAuth()
  const router = useRouter()

  const pacienteID = router.query.pacienteID
  const consultaID = router.query.consultaID

  // ** State
  const [value, setValue] = useState('account')
  const [open, setOpen] = useState(false)
  const [resposta, setResposta] = useState()
  const [id, setID] = useState();

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const criaPlanoAlimentar = async (values) => {
    const endPoint = `paciente/${pacienteID}/consulta/${consultaID}/plano`

    const resposta = await api.postInformation(endPoint, values)

    return resposta
  }

  // Formik
  const formik = useFormik({
    initialValues: {
      nome: '',
      teto_kcal: '',
      validade: '',
      submit: null
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nome: Yup
        .string()
        .max(255)
        .required('Nome é obrigatório'),
      teto_kcal: Yup
        .number()
        .required('Máximo Kcal é obrigatório'),
      validade: Yup
        .string()
        .required('Próxima consulta é obrigatório'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const res = await criaPlanoAlimentar(values)

        setResposta(res.body.msg)
        setID(res.body.id)
        setOpen(true)

        setTimeout(function () {
          router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/planoAlimentar/${res.body.id}`)
        }, 2000)

      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <IconButton size='small' sx={{ marginBottom: 4 }} onClick={() => { router.back() }}>
        <ArrowLeftCircle sx={{ marginRight: 2, fontSize: '1.375rem', }} />
        Perfil
      </IconButton>
      <Card>
        <CardHeader title='Informações do Plano Alimentar' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
            <Grid container spacing={7}>
              <Grid item xs={12} sm={4} sx={{ marginTop: 4.8 }}>
                <TextField
                  error={!!(formik.touched.nome && formik.errors.nome)}
                  autoFocus
                  fullWidth
                  helperText={formik.touched.nome && formik.errors.nome}
                  id='nome'
                  label='Nome'
                  placeholder='Nome'
                  name='nome'
                  type="text"
                  value={formik.values.nome}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{ marginBottom: 4 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <FormTextbox />
                      </InputAdornment>
                    )
                  }} />
              </Grid>

              <Grid item xs={12} sm={4} sx={{ marginTop: 4.8 }}>
                <TextField
                  error={!!(formik.touched.teto_kcal && formik.errors.teto_kcal)}
                  autoFocus
                  fullWidth
                  helperText={formik.touched.teto_kcal && formik.errors.teto_kcal}
                  id='teto_kcal'
                  label='Quantidade máxima de Kcal'
                  placeholder='2000'
                  name='teto_kcal'
                  type="number"
                  value={formik.values.teto_kcal}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{ marginBottom: 4 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CardTextOutline />
                      </InputAdornment>
                    )
                  }} />
              </Grid>

              <Grid item xs={12} sm={4} sx={{ marginTop: 4.8 }}>
                <TextField
                  error={!!(formik.touched.validade && formik.errors.validade)}
                  autoFocus
                  fullWidth
                  helperText={formik.touched.validade && formik.errors.validade}
                  id="validade"
                  name="validade"
                  type="date"
                  label="Validade"
                  placeholder=""
                  value={formik.values.validade}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{ marginBottom: 4 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarRange />
                      </InputAdornment>
                    )
                  }} />
              </Grid>

              {formik.errors.submit && (
                <Snackbar open={open} autoHideDuration={12000000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {formik.errors.submit}
                  </Alert>
                </Snackbar>
              )}

              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleClose} >
                  {resposta}
                </Alert>
              </Snackbar>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' type='submit'>
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default NovoPlanoAlimentar

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