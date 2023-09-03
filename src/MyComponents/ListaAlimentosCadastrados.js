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


const ListaAlimentosCadastrados = ({id}) => {
    console.log(id)
  const router = useRouter()

  const pacienteID = router.query.pacienteID
  const consultaID = router.query.consultaID
  const planoAlimentarID = router.query.planoAlimentarID

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [planoAlimentar, setPlanoAlimentar] = useState([])
  const [refeicoes, setRefeicoes] = useState([])
  const [open, setOpen] = useState(false)
  const [openMensage, setOpenMensage] = useState(false)
  const [resposta, setResposta] = useState()

  useEffect(async (ctx) => {

    // // Busca todos os alimentos cadastrados na refeição
    // const endPointAlimentosCadastrado = `plano/${planoAlimentarID}/refeicao/${idRefeicao}/alimento/refeicaoAlimento`
    // const getAlimentosCadastrado = await buscaInformacoes(ctx, endPointAlimentosCadastrado)
    // setAlimentoCadastrado(getAlimentosCadastrado.body)
  }, [])


  return (
    <>
        {refeicoes?.length > 0 ? (
        <>
            {refeicoes?.map(row => (
            <Grid container spacing={6} key={row?.id}>
                <Grid item xs={12} sm={12}>
                <Card sx={{ marginTop: 5 }}>
                    <CardHeader title={row?.nome} />
                    <Divider />
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Grid item xs={12} sm={3}>
                        <CardContent>
                        <Typography variant='body1'>
                            Turno: {row?.turno}
                        </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={12} sm={9} >
                        <CardContent>
                        <Typography variant='body1'>
                            Horário: {row?.horario}
                        </Typography>
                        </CardContent>
                    </Grid>
                    </Stack>
                    <Grid item xs={12} sm={6} >
                    <CardContent>
                        <Typography variant='body1'>
                        Descrição: {row?.descricao}
                        </Typography>
                    </CardContent>
                    </Grid>
                    <Divider />
                    
                    <Divider />
                    <CardActions className='card-action-dense' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => handleClickOpenAlimento(row?.id)}>Adicionar alimentos</Button>
                    </CardActions>
                </Card>
                </Grid>
            </Grid>
            ))}

        </>
        ) : (
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
            Nenhuma refeição cadastrada
        </Typography>
        )}
    </>
  )
}

export default ListaAlimentosCadastrados