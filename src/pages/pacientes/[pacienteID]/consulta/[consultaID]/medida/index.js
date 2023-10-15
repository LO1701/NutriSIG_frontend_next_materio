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
import HumanMaleHeight from 'mdi-material-ui/HumanMaleHeight'
import ListStatus from 'mdi-material-ui/ListStatus'
import CardBulletedOutline from 'mdi-material-ui/CardBulletedOutline'
import WeightKilogram from 'mdi-material-ui/WeightKilogram'
import Home from 'mdi-material-ui/Home'
import Cellphone from 'mdi-material-ui/Cellphone'
import CardAccountDetailsOutline from 'mdi-material-ui/CardAccountDetailsOutline'

// ** Demo Tabs Imports
import TabInfo from '../../../../../../views/account-settings/TabInfo'
import TabAccount from '../../../../../../views/account-settings/TabAccount'
import TabSecurity from '../../../../../../views/account-settings/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../../../../../../services/auth/tokenService'
import { useAuth } from '../../../../../../@core/hooks/useAuth'

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
import { api } from '../../../../../../services/api/api'

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
import { IconButton } from '@mui/material'
import { ArrowLeftCircle } from 'mdi-material-ui'



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
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ width: '100%', backgroundColor: '#10B981', color: '#FFF' }} />;
});

const Medida = () => {

    const auth = useAuth()
    const router = useRouter()

    const consultaID = router.query.consultaID
    const pacienteID = router.query.pacienteID

    // ** State
    const [value, setValue] = useState('account')
    const [open, setOpen] = useState(false);
    const [resposta, setResposta] = useState();

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const criaMedida = async (values) => {
        const endPoint = `paciente/consulta/${consultaID}/medida`

        const resposta = await api.postInformation(endPoint, values)

        return resposta
    }

    // Formik
    const formik = useFormik({
        initialValues: {
            altura: '',
            peso_atual: '',
            estado_nutricional: '',
            diagnostico_nutricional: '',
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            altura: Yup
                .number()
                .required('Altura é obrigatória'),
            peso_atual: Yup
                .number()
                .required('Peso é obrigatório'),
            estado_nutricional: Yup
                .string()
                .required('Estado nutricional é obrigatório'),
            diagnostico_nutricional: Yup
                .string()
                .required('Diagnóstico nutricional é obrigatório'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const resposta = await criaMedida(values)

                if (resposta.ok === true) {
                    setResposta('Medida criada com sucesso')
                } else {
                    setResposta('Erro ao criar a consulta')
                }

                setOpen(true)

                setTimeout(function () {
                    router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/medida/${resposta.body.id}`)
                }, 2000)

            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    return (
        <>
            <IconButton size='small' sx={{ marginBottom: 4 }} onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/perfil`) }}>
                <ArrowLeftCircle sx={{ marginRight: 2, fontSize: '1.375rem', }} />
                Perfil
            </IconButton>
            <Card>
                <CardHeader title='Medidas antropométricas do paciente' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
                        <Grid container spacing={7}>
                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.altura && formik.errors.altura)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.altura && formik.errors.altura}
                                    id='altura'
                                    label='Altura'
                                    placeholder='Ex: 1.50'
                                    name='altura'
                                    type="number"
                                    value={formik.values.altura}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <HumanMaleHeight />
                                            </InputAdornment>
                                        )
                                    }} />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.peso_atual && formik.errors.peso_atual)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.peso_atual && formik.errors.peso_atual}
                                    id='peso_atual'
                                    label='Peso atual'
                                    placeholder='Ex: 80'
                                    name='peso_atual'
                                    type="number"
                                    value={formik.values.peso_atual}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <WeightKilogram />
                                            </InputAdornment>
                                        )
                                    }} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!!(formik.touched.estado_nutricional && formik.errors.estado_nutricional)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.estado_nutricional && formik.errors.estado_nutricional}
                                    id='estado_nutricional'
                                    name='estado_nutricional'
                                    type="string"
                                    label='Estado Nutricional'
                                    placeholder=''
                                    value={formik.values.estado_nutricional}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <ListStatus />
                                            </InputAdornment>
                                        )
                                    }} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!!(formik.touched.diagnostico_nutricional && formik.errors.diagnostico_nutricional)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.diagnostico_nutricional && formik.errors.diagnostico_nutricional}
                                    id='diagnostico_nutricional'
                                    label='Diagnóstico Nutricional'
                                    placeholder=''
                                    name='diagnostico_nutricional'
                                    type="string"
                                    value={formik.values.diagnostico_nutricional}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <CardBulletedOutline />
                                            </InputAdornment>
                                        )
                                    }} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label='IMC'
                                    id="outlined-disabled"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label='Classificação - IMC'
                                    id="outlined-disabled"
                                />
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
        </>
    )
}

export default Medida

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