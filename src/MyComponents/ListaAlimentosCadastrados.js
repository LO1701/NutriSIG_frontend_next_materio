// ** Icons Imports
import CloseBoxMultiple from 'mdi-material-ui/CloseBoxMultiple'
import CalendarRange from 'mdi-material-ui/CalendarRange'
import CardTextOutline from 'mdi-material-ui/CardTextOutline'
import ClockTimeEightOutline from 'mdi-material-ui/ClockTimeEightOutline'


// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** MUI Imports
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import ScaleBathroom from 'mdi-material-ui/ScaleBathroom'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Snackbar from '@mui/material/Snackbar'
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';

// ** Api Import
// import { api } from '../../../../../../services/api/api'

// ** x-date-pickers (Componente de data)
import 'dayjs/locale/en-gb';

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { Box, FormTextbox } from 'mdi-material-ui';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from '../services/api/api'


const ListaAlimentosCadastrados = ({id}) => {

  const router = useRouter()

  const pacienteID = router.query.pacienteID
  const consultaID = router.query.consultaID
  const planoAlimentarID = router.query.planoAlimentarID
  
  const [refeicoes, setRefeicoes] = useState([])
  const [alimentoCadastrado, setAlimentoCadastrado] = useState([])

  const buscaInformacoes = async (ctx, endPoint) => {

    const resposta = await api.getInformation(ctx, endPoint)

    return resposta
  }
  
  useEffect(async (ctx) => {

    // Busca todos os alimentos cadastrados na refeição
    const endPointAlimentosCadastrado = `plano/${planoAlimentarID}/refeicao/${id}/alimento/refeicaoAlimento`
    const getAlimentosCadastrado = await buscaInformacoes(ctx, endPointAlimentosCadastrado)
    setAlimentoCadastrado(getAlimentosCadastrado.body)

    console.log(alimentoCadastrado)
  }, [])


  return (
    <>
        {alimentoCadastrado?.length > 0 ? (
            <>
                {alimentoCadastrado?.map(row => (
                    <Grid container spacing={6} key={row?.id}>
                        <Grid item xs={12} sm={12}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Grid item xs={12} sm={5}>
                                <CardContent sx={{marginLeft: 5}}>
                                    <Typography variant='body1'>
                                        - {row.nome}
                                    </Typography>
                                    <Typography variant='body1'>
                                        - Quantidade: {row.observacoes}
                                    </Typography>
                                    <Typography variant='body1'>
                                        - Calorias em kcal: {row.calorias_kcal.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </Grid>
                            </Stack>
                        </Grid>
                    </Grid>
                ))}
            </>
        ) : (
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
                <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
                Nenhum alimento cadastrado
            </Typography>
        )}
    </>
  )
}

export default ListaAlimentosCadastrados