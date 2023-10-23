// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import ClipboardListOutline from 'mdi-material-ui/ClipboardListOutline'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import FoodForkDrink from 'mdi-material-ui/FoodForkDrink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

const StatisticsCard = ({ numeroPacientes, numeroConsultas, numeroAlimentos }) => {

  return (
    <Card>
      <CardHeader
      sx={{pb:1, pt:2}}
        title='Informações gerais'
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Quantidade total de:
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 1,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          <Grid item xs={12} sm={3} mr={4}>
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: `success.main`
                }}
              >
                <FoodForkDrink sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Alimentos</Typography>
                <Typography variant='h6'>{numeroAlimentos}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} mr={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: `primary.main`
                }}
              >
                <AccountOutline sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Pacientes</Typography>
                <Typography variant='h6'>{numeroPacientes}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} mr={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: `warning.main`
                }}
              >
                <ClipboardListOutline sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Consultas</Typography>
                <Typography variant='h6'>{numeroConsultas}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
