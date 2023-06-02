// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';

// ** Api Import
import { api } from '../../services/api/api'


// Estilizações
const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

// Notificação
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color:'rgba(231, 227, 252, 0.87)' }}/>;
});

const TabAccount = ({user}) => {
  
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [open, setOpen] = useState(false);
  const [resposta, setResposta] = useState();

  // Functions
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }

  const atualizaUsuario = async (values) => {
    const endPoint = `nutricionista/${user.id}`
    const infos = {
      email: values.email, 
      nome: values.nome
    }

    const resposta = await api.putInformation(endPoint, infos)

    return resposta
  }

  // Formik
  const formik = useFormik({
    initialValues: {
      email: user.email,
      nome: user.nome,
      submit: null
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Email inválido')
        .max(255)
        .required('Email é obrigatório'),
      nome: Yup
        .string()
        .max(255)
        .required('Nome é obrigatória')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const res = await atualizaUsuario(values)
        console.log(res.body.msg)

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
    <CardContent>
      <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Carregar nova foto
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  PNG ou JPEG permitido. Tamanho máximo de 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
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
              sx={{ marginBottom: 4 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
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
              sx={{ marginBottom: 4 }} />
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
  )
}

export default TabAccount
