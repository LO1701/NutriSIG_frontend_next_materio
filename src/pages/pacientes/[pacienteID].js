// ** Services Imports
import { tokenService } from '../../services/auth/tokenService'
import { api } from '../../services/api/api'
import { authService } from '../../services/auth/authService'

// ** React
import * as React from 'react';
import { useEffect, useState } from 'react'

// Next
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AvatarGroup from '@mui/material/AvatarGroup'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import {
    Table,
    Paper,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    Container,
    TableContainer,
    IconButton,
  } from '@mui/material';

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import StarOutline from 'mdi-material-ui/StarOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

// Styled Box component
const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

// Images
import masculino from '../../img/Avatares/Masculino.png'
import feminino from '../../img/Avatares/Feminino.png'
import { PencilBoxMultiple } from 'mdi-material-ui';

// Functions
function defineIcone (paciente) {
    if(paciente.sexo === "Feminino"){
        return 'Feminino'
    }else{
        return'Masculino'
    }
}

function formataData (data) {
    const date = new Date(data)
    const dataDeCriacao = `${date.getDate()}/0${date.getMonth()+1}/${date.getFullYear()}`
    
    return dataDeCriacao
}

async function buscaInformacoes (ctx, endPoint) {

    const getInformacoes = await api.getInformation(ctx, endPoint)

    return getInformacoes
}

const PacienteID = () => {

    const router = useRouter();

    const pacienteID = router.query.pacienteID

    // States
    const [paciente, setPaciente] = useState([])
    const [consulta, setConsulta] = useState([])
    const [consultaUltima, setConsultaUltima] = useState([])
    const [medida, setMedida] = useState([])
    const [sexo, setSexo] = useState('Masculino')
    const [teste, setTeste] = useState()
    const [testeConsultas, setTesteConsultas] = useState()

    useEffect( async (ctx) => {
        const usuarioAutenticado = await authService.getSession(ctx)
        
        const endPointPaciente = `${usuarioAutenticado.body.id}/paciente/${pacienteID}`
        const endPointConsultaUltima = `paciente/${pacienteID}/consulta/ultima` // essa rota pega a ultima consulta cadastrada
        
        const getPaciente = await buscaInformacoes(ctx, endPointPaciente)
        const getUltimaConsulta = await buscaInformacoes(ctx, endPointConsultaUltima)
         
        getPaciente.body.dataDeCriacao = formataData(getPaciente.body.createdAt)
        
        setSexo(defineIcone(getPaciente.body)) 
        setPaciente(getPaciente.body)
        setConsultaUltima(getUltimaConsulta.body)

        if(getUltimaConsulta.body.id){

            // esse set é utilizado para quando o paciente possui uma ou mais consultas (Vai renderizar a lista de consultas)
            setTesteConsultas(getUltimaConsulta.body.id)

            // Pegando a ultima medida antropometrica cadastrata na ultima consulta
            const endPointMedida = `paciente/consulta/${getUltimaConsulta.body.id}/medida/ultima`
            const getMedidaDoPaciente = await buscaInformacoes(ctx, endPointMedida);
            getMedidaDoPaciente.body.dataFormatada = formataData(getMedidaDoPaciente.body.createdAt)  
            setMedida(getMedidaDoPaciente.body)
            
            // // Pegando todos os planos alimentares cadastrados na ultima consulta
            // const endPointPlanos = `paciente/${pacienteID}/consulta/${getUltimaConsulta.body.id}/plano`
            // const getPlanoDoPaciente = await buscaInformacoes(ctx, endPointPlanos);    
            // setPlano(getPlanoDoPaciente.body)

            // Pegando todas as consultas
            const endPointConsulta = `paciente/${pacienteID}/consulta` // essa rota pega a todas as consultas cadastradas
            const getConsultas = await buscaInformacoes(ctx, endPointConsulta)
            setConsulta(getConsultas.body)
            
            // esse if esta sendo utilizado para quando o paciente possui consulta cadastrada mas não possui nenhuma medida cadastrada
            if(getMedidaDoPaciente.body.id){
                setTeste(getUltimaConsulta.body.id);
            }
        }
        

    }, [])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ position: 'relative' }}>
                    <CardMedia sx={{ height: '12.625rem' }} image='/images/cards/background_user_new.png' />
                    <Avatar
                        alt={paciente?.nome}
                        src={`/images/avatars/${sexo}.png`}
                        sx={{
                            width: 75,
                            height: 75,
                            left: '1.313rem',
                            top: '10.28125rem',
                            position: 'absolute',
                            border: theme => `0.25rem solid ${theme.palette.common.white}`
                        }}
                    />
                    <CardContent>
                        <Box
                            sx={{
                                mt: 5.75,
                                mb: 8.75,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                        <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h6'>{paciente?.nome}</Typography>
                            <Typography variant='caption'>{paciente?.email}</Typography>
                        </Box>
                        <Button variant='contained'>Informações Pessoais</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={8}>
                <Card>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={7}>
                            <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
                                <Typography variant='h6' sx={{ marginBottom: 3.5 }}>
                                    Consultas
                                </Typography>
                                <Typography variant='body2'>
                                {teste?
                                (`${paciente?.nome} é seu(a) paciente desde ${paciente?.dataDeCriacao}. 
                                    De acordo com a última avaliação antropométrica, realizada em ${medida?.dataFormatada}, ${paciente?.nome} possui:`):
                                (`${paciente?.nome} é seu(a) paciente desde ${paciente?.dataDeCriacao}. 
                                    ${testeConsultas? 'E não foi cadastrada nenhuma medida antropométrica na última consulta': 'E não foi cadastrada nenhuma consulta'}.`)}
                                </Typography>
                                <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
                               {teste && (<Grid container spacing={4}>
                                    <Grid item xs={12} sm={5}>
                                        <StyledBox>
                                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                                            <LockOpenOutline sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                                            <Typography variant='body2'>{`Peso = ${medida?.peso_atual}kg`}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccountOutline sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                                            <Typography variant='body2'>{`IMC = ${medida?.imc_atual}`}</Typography>
                                        </Box>
                                        </StyledBox>
                                    </Grid>
                                    <Grid item xs={12} sm={7}>
                                        <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                                            <StarOutline sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                                            <Typography variant='body2'>{`Altura = ${medida?.altura}m`}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <TrendingUp sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                                            <Typography variant='body2'>{medida?.classificacao_imc}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>)}
                            </CardContent>
                        </Grid>
                        <Grid
                            item
                            sm={5}
                            xs={12}
                            sx={{ paddingTop: ['0 !important', '1.5rem !important'], paddingLeft: ['1.5rem !important', '0 !important'] }}
                        >
                            <CardContent
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'action.hover',
                                    padding: theme => `${theme.spacing(18, 5, 16)} !important`
                                }}
                            >
                                <Box>
                                    <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                       
                                    </Box>
                                    <Button variant='contained' onClick={() => {router.push(`${paciente?.id}/novo/consulta`)}}>Adicionar Consulta</Button>
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                {testeConsultas && (
                    <Grid item xs={12} md={12} sx={{marginTop:3}}>
                        <Grid item xs={12}>
                            <Card>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nome</TableCell>
                                                <TableCell>Data de atendimento</TableCell>
                                                <TableCell sx={{width: 5}}>Editar</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {consulta?.map(row => (
                                                <TableRow
                                                    key={row.id}
                                                    sx={{
                                                        '&:last-of-type td, &:last-of-type th': {
                                                        border: 0
                                                        }
                                                    }}
                                                >
                                                    <TableCell component='th' scope='row'>
                                                        {row.nome}
                                                    </TableCell>
                                                    <TableCell component='th' scope='row'>
                                                        {row.data_atendimento}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton size='small' onClick={() => {router.push(`${paciente?.id}/consulta/${row.id}/perfil`)}}>
                                                            <PencilBoxMultiple />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
}

export default PacienteID

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