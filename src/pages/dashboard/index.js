// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from '../../@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from '../../@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from '../../views/dashboard/Table'
import Trophy from '../../views/dashboard/Trophy'
import TotalEarning from '../../views/dashboard/TotalEarning'
import StatisticsCard from '../../views/dashboard/StatisticsCard'
import WeeklyOverview from '../../views/dashboard/WeeklyOverview'
import DepositWithdraw from '../../views/dashboard/DepositWithdraw'
import SalesByCountries from '../../views/dashboard/SalesByCountries'

import { tokenService } from '../../services/auth/tokenService'
import { useAuth } from '../../@core/hooks/useAuth'
import { authService } from '../../services/auth/authService'
import { useEffect, useState } from 'react'
import { api } from '../../services/api/api'

const Dashboard = (props) => {

  const [paciente, setPaciente] = useState([])
  const [usuario, setUsuario] = useState([])
  const [data, setData] = useState([])
  const [quantidadePacientes, setQuantidadePacientes] = useState()
  const [quantidadeConsultas, setQuantidadeConsultas] = useState()
  const [quantidadeAlimentos, setQuantidadeAlimentos] = useState()
  const [pacientesMesAtual, setPacientesMesAtual] = useState([])


  const buscaInformacoes = async (ctx, endPoint) => {
    const informacoes = await api.getInformation(ctx, endPoint)

    return informacoes
  }

  const buscaQuantidadeConsultas = async (pacientes, ctx) => {
    let valorAuxiliar = 0

    for(let i = 0; i < pacientes.length; i++ ){
      const buscaConsultas = await buscaInformacoes(ctx, `paciente/${pacientes[i].id}/consulta`)
      valorAuxiliar += buscaConsultas.body.length
    }

    return valorAuxiliar
  }

  const buscaPacientesUltimoMes = async (pacientes, dataHoje) => {

    let mesAtual = dataHoje.getMonth() + 1
    const arrayAuxiliar = []
    
    
    pacientes.forEach((element, index) => {
      const dataCriacao = new Date(element.createdAt)
      const mes = dataCriacao.getMonth() + 1

      if(mes == mesAtual){
        arrayAuxiliar.push(element)
      }

    });

    return arrayAuxiliar
  }

  useEffect(async (ctx) => {
    
    // data de hoje 
    let dataAtual = new Date();
    let dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setData(dataFormatada);

    // informacoes do usuario
    const usuarioAutenticado = await authService.getSession(ctx)
    setUsuario(usuarioAutenticado.body)


    // informacoes pacientes
    const endPointPacientes = `${usuarioAutenticado.body.id}/paciente`
    const getPacientes = await buscaInformacoes(ctx, endPointPacientes)
    setQuantidadePacientes(getPacientes.body.length)
    setPaciente(getPacientes.body)
    setQuantidadeConsultas(await buscaQuantidadeConsultas(getPacientes.body, ctx))
    setPacientesMesAtual(await buscaPacientesUltimoMes(getPacientes.body, dataAtual))

    // informacoes alimentos
    const endPointAlimentos = `${usuarioAutenticado.body.id}/alimento`
    const getAlimentos = await buscaInformacoes(ctx, endPointAlimentos)
    setQuantidadeAlimentos(getAlimentos.body.length)
  
  }, [])


  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Trophy nome={usuario?.nome} data={data} email={usuario?.email}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <StatisticsCard numeroPacientes={quantidadePacientes} numeroConsultas={quantidadeConsultas} numeroAlimentos={quantidadeAlimentos}/>
        </Grid>
        <Grid item xs={12} md={12} lg={7}>
          <TotalEarning pacientesDoMesAtual={pacientesMesAtual}/>
        </Grid>
        <Grid item xs={12} md={12} lg={5}>
          <WeeklyOverview />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard

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
