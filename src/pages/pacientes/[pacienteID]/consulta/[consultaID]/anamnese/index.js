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
import PacienteID from '../../../../[pacienteID]'

// Notificação
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color:'rgba(231, 227, 252, 0.87)' }}/>;
});

const Anamnese = () => {

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
      initialValues:{
            questaoUm: "Motivação para a consulta:",
            respostaUm: "",
            observacoesUm: "",
            questaoDois: "Históra Alimentar:",
            respostaDois: "",
            observacoesDois: "",
            questaoTres: "Tem alergia ou intolerância a algum tipo de alimento?",
            respostaTres: "",
            observacoesTres: "",
            questaoQuatro: "Costuma ingerir líquidos durante as refeições?",
            respostaQuatro: "",
            observacoesQuatro: "",
            questaoCinco: "Se sim na questão anterior mencione tipo e quantidade:",
            respostaCinco: "",
            observacoesCinco: "",
            questaoSeis: "Quem prepara suas refeições?",
            respostaSeis: "",
            observacoesSeis: "",
            questaoSete: "Tipo de gordura utilizada no preparo de suas refeições:",
            respostaSete: "",
            observacoesSete: "",
            questaoOito: "Ingere bebida alcoólica?",
            respostaOito: "",
            observacoesOito: "",
            questaoNove: "É fumante?",
            respostaNove: "",
            observacoesNove: "",
            questaoDez: "Tem constipação intestinal?",
            respostaDez: "",
            observacoesDez: "",
            questaoOnze: "Histórico de doença na família?",
            respostaOnze: "",
            observacoesOnze: "",
            questaoDoze: "Atualmente faz algum tipo de tratamento de saúde?",
            respostaDoze: "",
            observacoesDoze: "",
            questaoTreze: "Patologia(as)",
            respostaTreze: "",
            observacoesTreze: "",
            questaoCatorze: "Medicamento(s)",
            respostaCatorze: "",
            observacoesCatorze: "",
            submit: null
    },
      enableReinitialize: true,
      onSubmit: async (values, helpers) => {
        try {
        //   const res = await criaConsulta(values, pacienteID)
          console.log(values)

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
      <CardHeader title='Anamnese' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
            <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
              <Grid container spacing={7}>
                <Grid item xs={12} sm={12} sx={{ marginTop: 4.8}}>
                  <TextField
                    error={!!(formik.touched.respostaUm && formik.errors.respostaUm)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.respostaUm && formik.errors.respostaUm}
                    id='respostaUm' 
                    label="Motivação para a consulta:"
                    placeholder=""
                    name='respostaUm'
                    type="text" 
                    value={formik.values.respostaUm}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    multiline
                    rows={3}/>
                </Grid>

                <Grid item xs={12} sm={12} sx={{ marginTop: 4.8}}>
                  <TextField
                    error={!!(formik.touched.respostaDois && formik.errors.respostaDois)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.respostaDois && formik.errors.respostaDois}
                    id='respostaDois' 
                    label="História Alimentar"
                    placeholder=""
                    name='respostaDois'
                    type="text" 
                    value={formik.values.respostaDois}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    multiline
                    rows={3}/>
                </Grid>

                <Grid item xs={12} sm={12} sx={{ marginTop: 4.8}}>
                  <TextField
                    error={!!(formik.touched.respostaTres && formik.errors.respostaTres)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.respostaTres && formik.errors.respostaTres}
                    id='respostaTres' 
                    label="Tem alergia ou intolerância a algum tipo de alimento?"
                    placeholder=""
                    name='respostaTres'
                    type="text" 
                    value={formik.values.respostaTres}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    multiline
                    rows={3}/>
                </Grid>

                <Grid item xs={12} sm={12} sx={{ marginTop: 4.8}}>
                  <TextField
                    error={!!(formik.touched.respostaQuatro && formik.errors.respostaQuatro)}
                    autoFocus 
                    fullWidth
                    helperText={formik.touched.respostaQuatro && formik.errors.respostaQuatro}
                    id='respostaQuatro' 
                    label="Costuma ingerir líquidos durante as refeições?"
                    placeholder=""
                    name='respostaQuatro'
                    type="text" 
                    value={formik.values.respostaQuatro}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ marginBottom: 4 }} 
                    multiline
                    rows={3}/>
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

export default Anamnese

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