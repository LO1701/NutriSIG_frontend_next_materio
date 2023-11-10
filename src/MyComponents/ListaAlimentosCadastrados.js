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
    IconButton,
    Alert,
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
import { forwardRef, useEffect, useState } from 'react'
import { api } from '../services/api/api'
import PencilBoxMultiple from 'mdi-material-ui/PencilBoxMultiple'
import { authService } from '../services/auth/authService'


const ListaAlimentosCadastrados = ({ id }) => {

    const router = useRouter()

    const pacienteID = router.query.pacienteID
    const consultaID = router.query.consultaID
    const planoAlimentarID = router.query.planoAlimentarID

    const [refeicoes, setRefeicoes] = useState([])
    const [alimentoCadastrado, setAlimentoCadastrado] = useState([])

    const [open, setOpen] = useState(false)
    const [alimentoSelecionado, setAlimentoSelecionado] = useState(null)
    const [alimento, setAlimento] = useState([])
    const [gramas, setGramas] = useState()
    const [observacoes, setObservacoes] = useState()
    const [openMensageAlimento, setOpenMensageAlimento] = useState(false)
    const [respostaAlimento, setRespostaAlimento] = useState()
    const [usuario, setUsuario] = useState()
    const [inputValue, setInputValue] = useState('');
    const [openMensage, setOpenMensage] = useState(false)
    const [idMudar, setIdMudar] = useState()


    // Notificação
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color: '#FFF' }} />;
    });

    const buscaInformacoes = async (ctx, endPoint) => {

        const resposta = await api.getInformation(ctx, endPoint)

        return resposta
    }

    useEffect(async (ctx) => {

        const usuarioAutenticado = await authService.getSession(ctx)

        setUsuario(usuarioAutenticado.body)

        // Busca todos os alimentos cadastrados na refeição
        const endPointAlimentosCadastrado = `plano/${planoAlimentarID}/refeicao/${id}/alimento/refeicaoAlimento`
        const getAlimentosCadastrado = await buscaInformacoes(ctx, endPointAlimentosCadastrado)
        setAlimentoCadastrado(getAlimentosCadastrado.body)
console.log(getAlimentosCadastrado.body)
        // Busca todos os alimentos do select
        const endPointAlimentos = `${usuarioAutenticado.body.id}/alimento`
        const getAlimentos = await buscaInformacoes(ctx, endPointAlimentos)
        setAlimento(getAlimentos.body)
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const mudandoAlimento = (alimentoo, gramas, observacao) => {

        let indice = null

        alimento.forEach((element, index) => {
            if (element.nome == alimentoo) {
                indice = index
            }
        });

        setAlimentoSelecionado(alimento[indice])
        setGramas(gramas)
        setObservacoes(observacao)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMensage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMensage(false);
    };


    const handleCloseMensageAlimento = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMensageAlimento(false);
    };

    const atualizaAlimento = async (valores, ctx) => {

        const endPoint = `plano/${planoAlimentarID}/refeicao/${id}/alimento/${alimentoSelecionado.id}/refeicaoAlimento`
        console.log(endPoint)
        console.log(valores)
        const resposta = await api.putInformation(endPoint, valores)

        return resposta
    }

    async function onSubmitAlimentos(event) {

        event.preventDefault()

        const valores = {
            observacoes: observacoes,
            gramas: gramas
        }
        // console.log(valores)
        // console.log(alimentoSelecionado)
        const res = await atualizaAlimento(valores)

        setRespostaAlimento(res.body.msg)
        setOpenMensageAlimento(true)

        setTimeout(function () {
            router.reload()
        }, 2000)

    }

    return (
        <>
            {alimentoCadastrado?.length > 0 ? (
                <>
                    {alimentoCadastrado?.map(row => (
                        <Grid container spacing={6} key={row?.id}>
                            <Grid item xs={12} sm={12}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Grid item xs={12} sm={5}>
                                        <CardContent sx={{ marginLeft: 5 }}>
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
                                    <Grid item xs={12} sm={3}>
                                        <IconButton size='small'
                                            onClick={() => {
                                                mudandoAlimento(row?.nome, row?.gramas, row?.observacoes, row)
                                                handleClickOpen()
                                            }}>
                                            <PencilBoxMultiple />
                                        </IconButton>
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

            {/* Modal dos alimentos */}
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Alimento</DialogTitle>
                    <DialogContent dividers>
                        <form noValidate autoComplete='off' onSubmit={onSubmitAlimentos}>
                            <Grid container spacing={7}>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        value={alimentoSelecionado}
                                        onChange={(event, newValue) => {
                                            setAlimentoSelecionado(newValue);
                                        }}
                                        id="alimento"
                                        inputValue={inputValue}
                                        onInputChange={(event, newInputValue) => {
                                            setInputValue(newInputValue);
                                        }}
                                        disableClearable
                                        noOptionsText={"Nenhum alimento encontrado"}
                                        isOptionEqualToValue={(alimento, value) => alimento.nome === value.nome}
                                        options={alimento}
                                        getOptionLabel={(alimento) => alimento.nome}
                                        renderInput={(params) => (
                                            <TextField
                                                key={alimento?.id}
                                                {...params}
                                                label="Alimentos"
                                                InputProps={{
                                                    ...params.InputProps
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        id='gramas'
                                        label='Gramas'
                                        placeholder='Ex: 200'
                                        name='gramas'
                                        type="number"
                                        value={gramas}
                                        onChange={(event) => setGramas(event.target.value)}
                                        sx={{ marginBottom: 4 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <FormTextbox />
                                                </InputAdornment>
                                            )
                                        }} />
                                </Grid>

                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        id='observacoes'
                                        label='Medida caseira'
                                        placeholder=''
                                        name='observacoes'
                                        type="string"
                                        value={observacoes}
                                        onChange={(event) => setObservacoes(event.target.value)}
                                        sx={{ marginBottom: 4 }}
                                    />
                                </Grid>

                                <Snackbar open={openMensageAlimento} autoHideDuration={8000} onClose={handleCloseMensage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                    <Alert onClose={handleCloseMensageAlimento} >
                                        {respostaAlimento}
                                    </Alert>
                                </Snackbar>

                                <Divider />

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <DialogActions>
                                        <Button variant='contained' type='submit'>
                                            Salvar
                                        </Button>
                                    </DialogActions>
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default ListaAlimentosCadastrados