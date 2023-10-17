// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import Heart from 'mdi-material-ui/Heart'
import Twitter from 'mdi-material-ui/Twitter'
import ViewList from 'mdi-material-ui/ViewList'
import ShareVariant from 'mdi-material-ui/ShareVariant'

const CardInformacoesNutricionais = ({titulo, valorTotalNutriente, cor}) => {
  return (
    <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: `${cor}` }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          <ViewList sx={{ marginRight: 2.5 }} />
          {titulo}
        </Typography>
        <Typography variant='h6' sx={{ marginBottom: 3, color: 'common.white', textAlign:'center' }}>
          {valorTotalNutriente}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardInformacoesNutricionais
