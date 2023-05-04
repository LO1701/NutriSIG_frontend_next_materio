// ** React Imports
import { useState } from 'react'

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
import styles from '../styles/Index.module.css'

import { authService } from '../services/auth/authService'

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
              // className={styles.imagem_logo}
              priority={true}
            />
            <Typography variant='body2'>Por favor, entre com sua conta para ter acesso</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={(event) => {
            event.preventDefault()

            authService.login({
              email: values.usuario,
              senha: values.password
            })
            .then(() => {
              
              router.push('/dashboard') 
            }).catch(() => {
              alert('Usuário ou a senha estão inválidos')
            })

          }}>
            <TextField
              autoFocus 
              fullWidth 
              id='email' 
              label='Email'
              name='usuario' 
              value={values.usuario}
              onChange={handleChange}
              sx={{ marginBottom: 4 }} />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Senha</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                name='password'
                onChange={handleChange}
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
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label='Lembre de mim' />
              {/* <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link> */}
            </Box>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              type='submit'
              // onClick={() => router.push('/dashboard')}

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
