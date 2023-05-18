// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from '../../@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from '../../views/dashboard/Table'
import { tokenService } from '../../services/auth/tokenService'
import { useEffect, useState } from 'react'
import { api } from '../../services/api/api'
import { authService } from '../../services/auth/authService'

const Pacientes = () => {

  const [pacientes, setPacientes] = useState([])

  useEffect( async (ctx) => {
    const usuarioAutenticado = await authService.getSession(ctx)
    const endPoint = `${usuarioAutenticado.body.id}/paciente`
    
    const getPacientes = await api.getInformation(
      ctx,
      endPoint
    )

    setPacientes(getPacientes.body)
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Table pacientes={pacientes}/>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Pacientes

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
