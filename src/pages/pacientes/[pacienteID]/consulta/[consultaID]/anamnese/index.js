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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';

// ** Api Import
import { api } from '../../../../../../services/api/api'

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

const Anamnese = () => {

  const router = useRouter()

  const consultaID = router.query.consultaID
  const pacienteID = router.query.pacienteID

  // ** State
  const [value, setValue] = useState('account')
  const [open, setOpen] = useState(false)
  const [resposta, setResposta] = useState()
  const [valores, setValores] = useState({
    questaoUm: "1) Motivação para a consulta:",
    respostaUm: "",
    questaoDois: "2) Histórico Alimentar:",
    respostaDois: "",
    questaoTres: "3) Tem alergia ou intolerância a algum tipo de alimento?",
    respostaTres: "",
    observacoesTres: "",
    questaoQuatro: "4) Costuma ingerir líquidos durante as refeições?",
    respostaQuatro: "",
    observacoesQuatro: "",
    questaoCinco: "5) Quem prepara suas refeições?",
    respostaCinco: "",
    questaoSeis: "6) Tipo de gordura utilizada no preparo de suas refeições:",
    respostaSeis: "",
    questaoSete: "7) Ingere bebida alcoólica?",
    respostaSete: "",
    observacoesSete: "",
    questaoOito: "8) É fumante?",
    respostaOito: "",
    observacoesOito: "",
    questaoNove: "9) Tem constipação intestinal?",
    respostaNove: "",
    observacoesNove: "",
    questaoDez: "10) Histórico de doença na família?",
    respostaDez: "",
    observacoesDez: "",
    questaoOnze: "11) Atualmente faz algum tipo de tratamento de saúde?",
    respostaOnze: "",
    observacoesOnze: "",
    questaoDoze: "12) Possui Patologia(as)?",
    respostaDoze: "",
    observacoesDoze: "",
    questaoTreze: "13) Utiliza Medicamento(s)?",
    respostaTreze: "",
    observacoesTreze: "",
  })


  // ** Functions
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const criaAnamnese = async (values) => {
    const endPoint = `paciente/consulta/${consultaID}/anamnese`

    const resposta = await api.postInformation(endPoint, values)

    return resposta
  }

  async function onSubmit(event) {

    event.preventDefault()

    const arrayValores = [
      {
        "questao": valores.questaoUm,
        "resposta": valores.respostaUm
      },
      {
        "questao": valores.questaoDois,
        "respostaDois": valores.respostaDois
      },
      {
        "questao": valores.questaoTres,
        "resposta": valores.respostaTres,
        "observacoes": valores.observacoesTres
      },
      {
        "questao": valores.questaoQuatro,
        "resposta": valores.respostaQuatro,
        "observacoes": valores.observacoesQuatro
      },
      {
        "questao": valores.questaoCinco,
        "resposta": valores.respostaCinco
      },
      {
        "questao": valores.questaoSeis,
        "resposta": valores.respostaSeis
      },
      {
        "questao": valores.questaoSete,
        "resposta": valores.respostaSete,
        "observacoes": valores.observacoesSete
      },
      {
        "questao": valores.questaoOito,
        "resposta": valores.respostaOito,
        "observacoes": valores.observacoesOito
      },
      {
        "questao": valores.questaoNove,
        "resposta": valores.respostaNove,
        "observacoes": valores.observacoesNove
      },
      {
        "questao": valores.questaoDez,
        "resposta": valores.respostaDez,
        "observacoes": valores.observacoesDez
      },
      {
        "questao": valores.questaoOnze,
        "resposta": valores.respostaOnze,
        "observacoes": valores.observacoesOnze
      },
      {
        "questao": valores.questaoDoze,
        "resposta": valores.respostaDoze,
        "observacoes": valores.observacoesDez
      },
      {
        "questao": valores.questaoTreze,
        "resposta": valores.respostaTreze,
        "observacoes": valores.observacoesTreze
      }
    ]

    const res = await criaAnamnese(arrayValores)

    setResposta(res.body.msg)
    setOpen(true)

    setTimeout(function () {
      router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/perfil`)
    }, 2000)
  }

  return (
    <>
      <IconButton size='small' sx={{ marginBottom: 4 }} onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/perfil`) }}>
        <ArrowLeftCircle sx={{ marginRight: 2, fontSize: '1.375rem', }} />
        Perfil
      </IconButton>
      <Card>
        <CardHeader title='Anamnese' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form noValidate autoComplete='off' onSubmit={onSubmit}>
            <Grid container spacing={7}>
              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <TextField
                  fullWidth
                  id='respostaUm'
                  label={valores.questaoUm}
                  placeholder=""
                  name='respostaUm'
                  type="text"
                  value={valores.respostaUm}
                  onChange={(event) => setValores({ ...valores, respostaUm: event.target.value })}
                  sx={{ marginBottom: 4 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <TextField
                  autoFocus
                  fullWidth
                  id='respostaDois'
                  label={valores.questaoDois}
                  placeholder=""
                  name='respostaDois'
                  type="text"
                  value={valores.respostaDois}
                  onChange={(event) => setValores({ ...valores, respostaDois: event.target.value })}
                  sx={{ marginBottom: 4 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoTres}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaTres}
                  onChange={(event) => setValores({ ...valores, respostaTres: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesTres'
                  label="Observações"
                  placeholder=""
                  name='observacoesTres'
                  type="text"
                  value={valores.observacoesTres}
                  onChange={(event) => setValores({ ...valores, observacoesTres: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">4) Costuma ingerir líquidos durante as refeições?</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaQuatro}
                  onChange={(event) => setValores({ ...valores, respostaQuatro: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesQuatro'
                  label="Observações"
                  placeholder=""
                  name='observacoesQuatro'
                  type="text"
                  value={valores.observacoesQuatro}
                  onChange={(event) => setValores({ ...valores, observacoesQuatro: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <TextField
                  fullWidth
                  id='respostaCinco'
                  label={valores.questaoCinco}
                  placeholder=""
                  name='respostaCinco'
                  type="text"
                  value={valores.respostaCinco}
                  onChange={(event) => setValores({ ...valores, respostaCinco: event.target.value })}
                  sx={{ marginBottom: 4 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <TextField
                  fullWidth
                  id='respostaSeis'
                  label={valores.questaoSeis}
                  placeholder=""
                  name='respostaSeis'
                  type="text"
                  value={valores.respostaSeis}
                  onChange={(event) => setValores({ ...valores, respostaSeis: event.target.value })}
                  sx={{ marginBottom: 4 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoSete}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaSete}
                  onChange={(event) => setValores({ ...valores, respostaSete: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesSete'
                  label="Observações"
                  placeholder=""
                  name='observacoesSete'
                  type="text"
                  value={valores.observacoesSete}
                  onChange={(event) => setValores({ ...valores, observacoesSete: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoOito}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaOito}
                  onChange={(event) => setValores({ ...valores, respostaOito: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesOito'
                  label="Observações"
                  placeholder=""
                  name='observacoesOito'
                  type="text"
                  value={valores.observacoesOito}
                  onChange={(event) => setValores({ ...valores, observacoesOito: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoNove}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaNove}
                  onChange={(event) => setValores({ ...valores, respostaNove: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesNove'
                  label="Observações"
                  placeholder=""
                  name='observacoesNove'
                  type="text"
                  value={valores.observacoesNove}
                  onChange={(event) => setValores({ ...valores, observacoesNove: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoDez}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaDez}
                  onChange={(event) => setValores({ ...valores, respostaDez: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesDez'
                  label="Observações"
                  placeholder=""
                  name='observacoesDez'
                  type="text"
                  value={valores.observacoesDez}
                  onChange={(event) => setValores({ ...valores, observacoesDez: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoOnze}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaOnze}
                  onChange={(event) => setValores({ ...valores, respostaOnze: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesOnze'
                  label="Observações"
                  placeholder=""
                  name='observacoesOnze'
                  type="text"
                  value={valores.observacoesOnze}
                  onChange={(event) => setValores({ ...valores, observacoesOnze: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoDoze}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaDoze}
                  onChange={(event) => setValores({ ...valores, respostaDoze: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesDoze'
                  label="Observações"
                  placeholder=""
                  name='observacoesDoze'
                  type="text"
                  value={valores.observacoesDoze}
                  onChange={(event) => setValores({ ...valores, observacoesDoze: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: 4.8 }}>
                <FormLabel id="demo-row-radio-buttons-group-label">{valores.questaoTreze}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valores.respostaTreze}
                  onChange={(event) => setValores({ ...valores, respostaTreze: event.target.value })}
                >
                  <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                  <FormControlLabel value="Não" control={<Radio />} label="Não" />
                </RadioGroup>

                <TextField
                  autoFocus
                  fullWidth
                  id='observacoesTreze'
                  label="Observações"
                  placeholder=""
                  name='observacoesTreze'
                  type="text"
                  value={valores.observacoesTreze}
                  onChange={(event) => setValores({ ...valores, observacoesTreze: event.target.value })}
                  sx={{ marginBottom: 4, marginTop: 3 }}
                  multiline
                  rows={3} />
              </Grid>

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