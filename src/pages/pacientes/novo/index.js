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
import Cellphone from 'mdi-material-ui/Cellphone'
import CardAccountDetailsOutline from 'mdi-material-ui/CardAccountDetailsOutline'

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
import { useFormik } from 'formik'
import * as Yup from 'yup';

// ** Api Import
import { api } from '../../../services/api/api'

// ** x-date-pickers (Componente de data)
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';

// ** import Select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRouter } from 'next/router'



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
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color:'#FFF' }}/>;
});

const NovoPaciente = () => {

    const auth = useAuth()
    const router = useRouter()

    // ** State
    const [value, setValue] = useState('account')
    const [open, setOpen] = useState(false);
    const [resposta, setResposta] = useState();
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

    const criaPaciente = async (values) => {
      const endPoint = `${auth.user.id}/paciente`
    
      const resposta = await api.postInformation(endPoint, values)
    
      return resposta
    }

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
        .string()
        .required('Data de nascimento é obrigatório'),
        sexo: Yup
        .string()
        .required('Sexo é obrigatório'),
        n_cns: Yup
        .string()
        .max(15)
        .required('Cartão Nacional de Saúde é obrigatório'),
        ubs: Yup
        .string()
        .max(15)
        .required('Telefone é obrigatório'),
        telefone: Yup
        .string()
        .max(15)
        .required('Telefone é obrigatório'),
        cpf: Yup
        .string()
        .max(15)
        .required('CPF é obrigatório'),
      }),
      onSubmit: async (values, helpers) => {
        try {
          const res = await criaPaciente(values)
          console.log(res.body.id)

          setResposta(res.body.msg)
          setID(res.body.id)
          setOpen(true)

          setTimeout(function() {
            window.location.replace(`http://localhost:3000/pacientes/${res.body.id}`)
          }, 2000)


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
                {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb" components={['DatePicker']}>
                    <DatePicker 
                      label="Data de nascimento"
                      sx={{ width: '100%' }}
                      value={dataNascimento}
                      onChange={(newValue) => setdataNascimento(newValue)}
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
                  label='Data de Nascimento'
                  placeholder=''
                  value={formik.values.data_nascimento}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{ marginBottom: 4 }} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CalendarRange />
                      </InputAdornment>
                    )
                  }}/>
                </Grid>

                <Grid item xs={12} sm={6} >
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Sexo</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id='sexo' 
                      name='sexo'
                      type="select" 
                      label='Sexo'
                      placeholder=''
                      value={formik.values.sexo}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value={'Feminino'}>Feminino</MenuItem>
                      <MenuItem value={'Masculino'}>Masculino</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!(formik.touched.n_cns && formik.errors.n_cns)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.n_cns && formik.errors.n_cns}
                    id='n_cns' 
                    label='Cartão Nacional de Saúde'
                    placeholder='xxxxxxxxxxxxxxx'
                    name='n_cns'
                    type="n_cns" 
                    value={formik.values.n_cns}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CardBulletedOutline />
                        </InputAdornment>
                      )
                    }}/>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!(formik.touched.ubs && formik.errors.ubs)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.ubs && formik.errors.ubs}
                    id='ubs' 
                    label='Unidade Básica de Saúde'
                    placeholder='xx'
                    name='ubs'
                    type="ubs" 
                    value={formik.values.ubs}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Home />
                        </InputAdornment>
                      )
                    }}/>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!(formik.touched.telefone && formik.errors.telefone)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.telefone && formik.errors.telefone}
                    id='telefone' 
                    label='Telefone'
                    placeholder='(xx) 0000-0000'
                    name='telefone'
                    type="telefone" 
                    value={formik.values.telefone}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Cellphone />
                        </InputAdornment>
                      )
                    }}/>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!(formik.touched.cpf && formik.errors.cpf)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.cpf && formik.errors.cpf}
                    id='cpf' 
                    label='CPF'
                    placeholder='00000000000'
                    name='cpf'
                    type="cpf" 
                    value={formik.values.cpf}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CardAccountDetailsOutline />
                        </InputAdornment>
                      )
                    }}/>
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