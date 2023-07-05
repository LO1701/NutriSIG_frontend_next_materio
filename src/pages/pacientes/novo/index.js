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
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'

// ** Demo Tabs Imports
import TabInfo from '../../../views/account-settings/TabInfo'
import TabAccount from '../../../views/account-settings/TabAccount'
import TabSecurity from '../../../views/account-settings/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../../../services/auth/tokenService'
import { useAuth } from '../../../@core/hooks/useAuth'

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
import { Field, useFormik } from 'formik'
import * as Yup from 'yup';

// ** Api Import
import { api } from '../../../services/api/api'

// ** x-date-pickers (Componente de data)
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';



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
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color:'rgba(231, 227, 252, 0.87)' }}/>;
});

const NovoPaciente = () => {

    const auth = useAuth()

    // ** State
    const [value, setValue] = useState('account')
    const [open, setOpen] = useState(false);
    const [resposta, setResposta] = useState();
    const [dataNascimento, setdataNascimento] = useState();

    const handleChange = (event, newValue) => {
      setValue(newValue)
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpen(false);
    };

    // Formik
    const formik = useFormik({
      initialValues: {
          nome: '',
          email: '',
          data_nascimento: '',
          sexo: '',
          n_cns: '',
          ubs: '',
          telefone: '',
          cpf: '',
          submit: null
      },
      enableReinitialize: true,
      validationSchema: Yup.object({
        nome: Yup
        .string()
        .max(255)
        .required('Nome é obrigatória'),
        email: Yup
        .string()
        .email('Email inválido')
        .max(255)
        .required('Email é obrigatório'),
        data_nascimento: Yup
        .date()
        .required('Data de nascimento é obrigatório'),
        sexo: Yup
        .string()
        .required('Sexo é obrigatório'),  

      
      }),
      onSubmit: async (values, helpers) => {
        try {
          // const res = await atualizaUsuario(values)
          // console.log(res.body.msg)
          
          console.log(values)

          setResposta(res.body.msg)
          setOpen(true);
          
          // window.location.reload(true)  
        } catch (err) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    });

  return (
    <Card>
      <CardHeader title='Informações pessoais do paciente' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
            <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
                <Grid container spacing={7}>
                    <Grid item xs={12} sm={6} sx={{ marginTop: 4.8}}>
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
                        }}/>
                    </Grid>

                    <Grid item xs={12} sm={6} sx={{ marginTop: 4.8}}>
                      <TextField
                        error={!!(formik.touched.email && formik.errors.email)}
                        autoFocus 
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        id='email' 
                        label='Email'
                        placeholder='email@example.com'
                        name='email'
                        type="email" 
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ marginBottom: 4 }} 
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <EmailOutline />
                            </InputAdornment>
                          )
                        }}/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                      <DatePicker 
                        label="Data de nascimento"
                        sx={{ width: '100%' }}
                        value={formik.values.data_nascimento}
                        onChange={formik.handleChange}
                        />
                      </LocalizationProvider> */}
                      <TextField
                        error={!!(formik.touched.data_nascimento && formik.errors.data_nascimento)}
                        autoFocus 
                        fullWidth
                        helperText={formik.touched.data_nascimento && formik.errors.data_nascimento}
                        id='data_nascimento' 
                        
                        
                        name='data_nascimento'
                        type="date" 
                        value={formik.values.data_nascimento}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ marginBottom: 4 }} 
                        />
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
                    
                    <Grid item xs={12}>
                      <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit'>
                        Salvar
                      </Button>
                    </Grid>
                </Grid>
            </form>
        </CardContent>
    </Card>
  )
}

export default NovoPaciente

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