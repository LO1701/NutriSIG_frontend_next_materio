// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

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
import TextBoxPlusOutline from 'mdi-material-ui/TextBoxPlusOutline'
import FileSign from 'mdi-material-ui/FileSign'
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
import { IconButton, Stack } from '@mui/material'
import { ArrowLeftCircle, ScaleBathroom } from 'mdi-material-ui'
import ListaExamesCadastrados from '../../../../../../MyComponents/ListaExamesCadastrados'


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

const TodosExames = () => {

    const auth = useAuth()
    const router = useRouter()

    const consultaID = router.query.consultaID
    const pacienteID = router.query.pacienteID

    // ** State
    const [value, setValue] = useState('account')
    const [open, setOpen] = useState(false);
    const [resposta, setResposta] = useState();
    const [exames, setExames] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(async (ctx) => {
        // Busca todos os Exames laboratoriais
        const endPointExames = `paciente/consulta/${consultaID}/exame`
        const getExames = await api.getInformation(ctx, endPointExames)

        setExames(getExames.body)
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const criaExame = async (values) => {
        const endPoint = `paciente/consulta/${consultaID}/exame`

        const resposta = await api.postInformation(endPoint, values)

        return resposta
    }

    // Formik
    const formik = useFormik({
        initialValues: {
            nome: '',
            observacoes: '',
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
                const resposta = await criaExame(values)

                if (resposta.ok === true) {
                    setResposta('Exame adicionado com sucesso')
                } else {
                    setResposta('Erro ao criar a consulta')
                }

                setOpen(true)

                setTimeout(function () {
                    router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/exame/${resposta.body.id}`)
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ marginTop: '25px' }}>
                <Typography variant="h5" gutterBottom>
                    Informações sobre os Exames Laboratoriais
                </Typography>
                <Button variant="contained" onClick={() => { router.push(`http://localhost:3000/pacientes/${pacienteID}/consulta/${consultaID}/exame`) }}>
                    <TextBoxPlusOutline sx={{ marginRight: 1, fontSize: '1.375rem', marginBottom: 1 }} />
                    Adicionar
                </Button>
            </Stack>
            {exames?.map(row => (
                <ListaExamesCadastrados key={row?.id} id={row?.id} nome={row?.nome} observacoes={row?.observacoes} />
            ))}
        </>
    )
}

export default TodosExames

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