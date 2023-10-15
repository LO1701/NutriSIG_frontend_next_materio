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

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { tokenService } from '../services/auth/tokenService'
import { useAuth } from '../@core/hooks/useAuth'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import FileSign from 'mdi-material-ui/FileSign'

// ** Foormik and yup Imports
import { useFormik } from 'formik'
import * as Yup from 'yup';

// ** Api Import
import { api } from '../services/api/api'

// ** x-date-pickers (Componente de data)
import 'dayjs/locale/en-gb';

// ** import Select
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

const ListaExamesCadastrados = ({id, nome, observacoes}) => {

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

    const atualizaExame = async (values) => {
        const endPoint = `paciente/consulta/${consultaID}/exame/${id}`

        const resposta = await api.putInformation(endPoint, values)

        return resposta
    }

    // Formik
    const formik = useFormik({
        initialValues: {
            nome: nome,
            observacoes: observacoes,
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            nome: Yup
                .string()
                .required('Nome é obrigatório'),
            observacoes: Yup
                .string()
                .required('Observações é obrigatório'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const resposta = await atualizaExame(values)

                if (resposta.ok === true) {
                    setResposta('Exame atualizado com sucesso')
                } else {
                    setResposta('Erro ao criar a consulta')
                }

                setOpen(true)

                setTimeout(function () {
                    router.reload(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/exame/todosExames`)
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
            <Card sx={{marginBottom: 5}}>
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
                                    label='Nome / Tipo'
                                    placeholder='Nome'
                                    name='nome'
                                    type="string"
                                    value={formik.values.nome}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    sx={{ marginBottom: 4 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <FileSign />
                                            </InputAdornment>
                                        )
                                    }} />
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: 4.8 }}>
                                <TextField
                                    error={!!(formik.touched.observacoes && formik.errors.observacoes)}
                                    autoFocus
                                    fullWidth
                                    multiline
                                    rows={3}
                                    helperText={formik.touched.observacoes && formik.errors.observacoes}
                                    id='observacoes'
                                    label='Observações'
                                    placeholder=''
                                    name='observacoes'
                                    type="string"
                                    value={formik.values.observacoes}
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

export default ListaExamesCadastrados

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