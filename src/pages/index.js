// ** React Imports
import { useContext, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from '../configs/themeConfig'

// ** Layout Import
import BlankLayout from '../@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from '../views/pages/auth/FooterIllustration'

// ** Imports image logo
import imagemLogo from '../img/logo.png'
import Image from 'next/image'

// Import formik e yup
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { FormHelperText } from '@mui/material'
import { useAuth } from '../@core/hooks/useAuth'


// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))


const LoginPage = () => {

  // ** State
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    usuario: ''
  })

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const auth = useAuth()

  // ** Functions
  function handleChange (event) {
    const fieldValue = event.target.value
    const fieldName = event.target.name
    setValues((currentValues) => {
      return {
        ...currentValues,
        [fieldName]: fieldValue
      }
    })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  // ** Formik
  const formik = useFormik({
    initialValues: {
      email: 'ana@gmail.com',
      senha: '12345678',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Email inválido')
        .max(255)
        .required('Email é obrigatório'),
      senha: Yup
        .string()
        .max(255)
        .required('Senha é obrigatória')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.email, values.senha)
    
        router.push('/dashboard');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Image 
              src={imagemLogo} 
              alt='Imagem logo'
              width={250}
              height={250}
              priority={true}
            />
            <Typography variant='body2'>Por favor, entre com sua conta para ter acesso</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
            <TextField
              error={!!(formik.touched.email && formik.errors.email)}
              autoFocus 
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              id='email' 
              label='Email'
              name='email'
              type="email" 
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{ marginBottom: 4 }} />
            <FormControl fullWidth>
              {(formik.touched.senha && formik.errors.senha)? (
                <InputLabel htmlFor='senha' sx={{color: '#FF4C51'}}>Senha</InputLabel>
              ):(<InputLabel htmlFor='senha'>Senha</InputLabel>)}
              <OutlinedInput
                error={!!(formik.touched.senha && formik.errors.senha)}
                label='senha'
                value={formik.values.senha}
                id='senha'
                name='senha'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {(formik.touched.senha && formik.errors.senha) && (
                <FormHelperText id="component-error-text" sx={{color: '#FF4C51'}}>Senha é obrigatória</FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox checked/>} label='Lembre de mim' />
              {/* <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link> */}
            </Box>
            {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ m: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              type='submit'
            >
              Entrar
            </Button>
            <Divider sx={{ my: 5 }}></Divider>
         </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage