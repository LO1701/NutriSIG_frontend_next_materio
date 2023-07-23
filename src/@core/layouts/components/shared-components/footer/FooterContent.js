// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', margin: '30px' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, NutriSIG`}
      </Typography>
    </Box>
  )
}

export default FooterContent
