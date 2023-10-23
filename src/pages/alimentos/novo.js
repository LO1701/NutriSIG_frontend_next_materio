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
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CalendarRange from 'mdi-material-ui/CalendarRange'
import CardBulletedOutline from 'mdi-material-ui/CardBulletedOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import Home from 'mdi-material-ui/Home'
import Cellphone from 'mdi-material-ui/Cellphone'
import CardAccountDetailsOutline from 'mdi-material-ui/CardAccountDetailsOutline'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../../services/auth/tokenService'
import { useAuth } from '../../@core/hooks/useAuth'

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
import { api } from '../../services/api/api'

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

const NovoAlimento = () => {

    const auth = useAuth()
    const router = useRouter()

    // ** State
    const [value, setValue] = useState('account')
    const [open, setOpen] = useState(false);
    const [resposta, setResposta] = useState();
    const [id, setID] = useState();

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const criaAlimento = async (values) => {
        const endPoint = `${auth.user.id}/alimento`

        const resposta = await api.postInformation(endPoint, values)

        return resposta
    }

    // Formik
    const formik = useFormik({
        initialValues: {
            nome: '',
            categoria: '',
            colesterol: '',
            umidade: '',
            calorias_kcal: '',
            calorias_kj: '',
            proteinas: '',
            lipidios: '',
            carboidratos: '',
            fibra_alimentar: '',
            cinzas: '',
            calcio: '',
            magnesio: '',
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            nome: Yup
                .string()
                .max(255)
                .required('Nome é obrigatório'),
            categoria: Yup
                .string()
                .max(255)
                .required('Categoria é obrigatório'),
            colesterol: Yup
                .string()
                .max(255)
                .required('Colesterol é obrigatório'),
            umidade: Yup
                .string()
                .max(255)
                .required('Umidade é obrigatório'),
            calorias_kcal: Yup
                .number()
                .max(15)
                .required('Kcal é obrigatório'),
            calorias_kj: Yup
                .number()
                .max(15)
                .required('Kj é obrigatório'),
            proteinas: Yup
                .number()
                .max(15)
                .required('Proteína é obrigatório'),
            lipidios: Yup
                .number()
                .max(15)
                .required('Lipídios é obrigatório'),
            carboidratos: Yup
                .number()
                .max(15)
                .required('Carboidrato é obrigatório'),
            fibra_alimentar: Yup
                .number()
                .max(15)
                .required('Fibra alimentar é obrigatório'),
            cinzas: Yup
                .number()
                .max(15)
                .required('Cinzas é obrigatório'),
            calcio: Yup
                .number()
                .max(15)
                .required('Cálcio é obrigatório'),
            magnesio: Yup
                .number()
                .max(15)
                .required('Magnésio é obrigatório'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await criaAlimento(values)
                console.log(res.body.id)

                setResposta(res.body.msg)
                setID(res.body.id)
                setOpen(true)

                setTimeout(function () {
                    router.push(`http://localhost:3000/alimentos`)
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
            <IconButton size='small' sx={{ marginBottom: 4 }} onClick={() => { router.push(`http://localhost:3000/alimentos`) }}>
                <ArrowLeftCircle sx={{ marginRight: 2, fontSize: '1.375rem', }} />
                Lista de Alimentos
            </IconButton>
            <Card>
                <CardHeader title='Informações dos alimentos' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
                        <Grid container spacing={7}>
                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
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
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.categoria && formik.errors.categoria)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.categoria && formik.errors.categoria}
                                    id='categoria'
                                    label='Categoria'
                                    placeholder='Categoria'
                                    name='categoria'
                                    type="text"
                                    value={formik.values.categoria}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.colesterol && formik.errors.colesterol)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.colesterol && formik.errors.colesterol}
                                    id='colesterol'
                                    label='Colesterol'
                                    placeholder='Colesterol'
                                    name='colesterol'
                                    type="text"
                                    value={formik.values.colesterol}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.umidade && formik.errors.umidade)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.umidade && formik.errors.umidade}
                                    id='umidade'
                                    label='Umidade'
                                    placeholder='Umidade'
                                    name='umidade'
                                    type="number"
                                    value={formik.values.umidade}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.calorias_kcal && formik.errors.calorias_kcal)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.calorias_kcal && formik.errors.calorias_kcal}
                                    id='calorias_kcal'
                                    label='Calorias em kcal'
                                    placeholder='Calorias em kcal'
                                    name='calorias_kcal'
                                    type="number"
                                    value={formik.values.calorias_kcal}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.calorias_kj && formik.errors.calorias_kj)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.calorias_kj && formik.errors.calorias_kj}
                                    id='calorias_kj'
                                    label='Calorias em kj'
                                    placeholder='Calorias em kj'
                                    name='calorias_kj'
                                    type="number"
                                    value={formik.values.calorias_kj}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.proteinas && formik.errors.proteinas)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.proteinas && formik.errors.proteinas}
                                    id='proteinas'
                                    label='Proteínas'
                                    placeholder='Proteínas'
                                    name='proteinas'
                                    type="number"
                                    value={formik.values.proteinas}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.lipidios && formik.errors.lipidios)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.lipidios && formik.errors.lipidios}
                                    id='lipidios'
                                    label='Lipídios'
                                    placeholder='Lipídios'
                                    name='lipidios'
                                    type="number"
                                    value={formik.values.lipidios}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.carboidratos && formik.errors.carboidratos)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.carboidratos && formik.errors.carboidratos}
                                    id='carboidratos'
                                    label='Carboidratos'
                                    placeholder='Carboidratos'
                                    name='carboidratos'
                                    type="number"
                                    value={formik.values.carboidratos}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.fibra_alimentar && formik.errors.fibra_alimentar)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.fibra_alimentar && formik.errors.fibra_alimentar}
                                    id='fibra_alimentar'
                                    label='Fibra Alimentar'
                                    placeholder='Fibra Alimentar'
                                    name='fibra_alimentar'
                                    type="number"
                                    value={formik.values.fibra_alimentar}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.cinzas && formik.errors.cinzas)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.cinzas && formik.errors.cinzas}
                                    id='cinzas'
                                    label='Cinzas'
                                    placeholder='Cinzas'
                                    name='cinzas'
                                    type="number"
                                    value={formik.values.cinzas}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.calcio && formik.errors.calcio)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.calcio && formik.errors.calcio}
                                    id='calcio'
                                    label='Cálcio'
                                    placeholder='Cálcio'
                                    name='calcio'
                                    type="number"
                                    value={formik.values.calcio}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                  />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.magnesio && formik.errors.magnesio)}
                                    autoFocus
                                    fullWidth
                                    helperText={formik.touched.magnesio && formik.errors.magnesio}
                                    id='magnesio'
                                    label='Magnésio'
                                    placeholder='Magnésio'
                                    name='magnesio'
                                    type="number"
                                    value={formik.values.magnesio}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
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

export default NovoAlimento

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