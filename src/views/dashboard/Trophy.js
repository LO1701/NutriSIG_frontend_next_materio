// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 15,
  bottom: 5,
  height: 90,
  position: 'absolute'
})

const Trophy = ({nome, data, email}) => {
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative'}}>
      <CardContent>
        <Typography variant='h6'>Olá, seja bem vinda {nome} 😊</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          {data}
        </Typography>
        <Typography variant='body2' sx={{ my: 4, color: 'primary.main' }}>
          {email}
        </Typography>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/dashboard.png' />
      </CardContent>
    </Card>
  )
}

export default Trophy
