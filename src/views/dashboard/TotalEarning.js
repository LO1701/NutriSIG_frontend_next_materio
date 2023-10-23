// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { CloseBoxMultiple, PencilBoxMultiple } from 'mdi-material-ui'
import { useState } from 'react'
import { useRouter } from 'next/router'

const TotalEarning = ({ pacientesDoMesAtual }) => {

  const router = useRouter()

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <Card>
      <CardHeader
        title='Pacientes atendidos no mês atual'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>

          <Typography component='h6' sx={{ mb: 10 }}>
            Quantidade total: {pacientesDoMesAtual?.length}
          </Typography>
        </Box>

        {pacientesDoMesAtual?.length > 0 ? (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell sx={{ width: 5 }}>Editar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pacientesDoMesAtual?.map(row => (
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
                      <TableCell align="center">
                        <IconButton size='small' onClick={() => { router.push(`http://localhost:3000/pacientes/${row.id}`) }}>
                          <PencilBoxMultiple />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pacientesDoMesAtual.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
            <CloseBoxMultiple sx={{ marginRight: 2, fontSize: '1.375rem', }} />
            Nenhuma paciente atendido no mês atual
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default TotalEarning
