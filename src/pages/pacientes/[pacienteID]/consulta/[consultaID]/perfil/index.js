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
import { tokenService } from '../../../../../../services/auth/tokenService'

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
import { api } from '../../../../../../services/api/api'

// ** x-date-pickers (Componente de data)
import 'dayjs/locale/en-gb';

// ** import Select
import { useRouter } from 'next/router'

// Notificação
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color:'rgba(231, 227, 252, 0.87)' }}/>;
});

const Perfil = () => {

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
          // console.log(res.body.msg)

          setResposta(res.body.msg)
          setOpen(true)
          
        } catch (err) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    });

  return (
    <Card>
        <h3>Perfil</h3>
    </Card>
  )
}

export default Perfil

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