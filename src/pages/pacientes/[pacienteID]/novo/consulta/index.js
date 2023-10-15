// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CalendarRange from 'mdi-material-ui/CalendarRange'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../../../../../services/auth/tokenService'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';

// ** Api Import
import { api } from '../../../../../services/api/api'

// ** x-date-pickers (Componente de data)
import 'dayjs/locale/en-gb';

// ** import Select
import { useRouter } from 'next/router'
import { IconButton } from '@mui/material'
import { ArrowLeftCircle } from 'mdi-material-ui'

// Notificação
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color: 'rgba(231, 227, 252, 0.87)' }} />;
});

const NovaConsulta = () => {

  const router = useRouter()

  const pacienteID = router.query.pacienteID

  // ** State
  const [value, setValue] = useState('account')
  const [open, setOpen] = useState(false)
  const [resposta, setResposta] = useState()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const criaConsulta = async (values, id_paciente) => {
    const endPoint = `paciente/${id_paciente}/consulta`

    const resposta = await api.postInformation(endPoint, values)

    return resposta
  }

  // Formik
  const formik = useFormik({
    initialValues: {
      nome: '',
      data_atendimento: '',
      submit: null
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nome: Yup
        .string()
        .max(255)
        .required('Nome é obrigatória'),
      data_atendimento: Yup
        .string()
        .required('Data de atendimento é obrigatório'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const res = await criaConsulta(values, pacienteID)
        // console.log(res.body.id)

        setResposta(res.body.msg)
        setOpen(true)

        setTimeout(function () {
          window.location.replace(`http://localhost:3000/pacientes/${pacienteID}/consulta/${res.body.id}/perfil`)
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
      <IconButton size='small' sx={{ marginBottom: 4 }} onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}`) }}>
        <ArrowLeftCircle sx={{ marginRight: 2, fontSize: '1.375rem', }} />
        Informações iniciais
      </IconButton>
      <Card>
        <CardHeader title='Nova Consulta' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
            <Grid container spacing={7}>
              <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
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
                        <AccountOutline />
                      </InputAdornment>
                    )
                  }} />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                <TextField
                  error={!!(formik.touched.data_atendimento && formik.errors.data_atendimento)}
                  autoFocus
                  fullWidth
                  helperText={formik.touched.data_atendimento && formik.errors.data_atendimento}
                  id='data_atendimento'
                  name='data_atendimento'
                  type="date"
                  label='Data de atendimento'
                  placeholder=''
                  value={formik.values.data_atendimento}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{ marginBottom: 4 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
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

export default NovaConsulta

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