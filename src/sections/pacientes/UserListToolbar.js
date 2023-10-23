import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
// import Iconify from '../../../components/iconify';
import Magnify from 'mdi-material-ui/Magnify'

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ filterName, onFilterName, placeHolder = 'Pesquisar paciente...' }) {
  return (
    <StyledRoot
      sx={{
          color: 'primary.main',
          bgcolor: 'primary.lighter',
      }}
    >
      <StyledSearch
        value={filterName}
        onChange={onFilterName}
        placeholder={placeHolder}
        startAdornment={
          <InputAdornment position="start">
            <Magnify />
          </InputAdornment>
        }
        />
    </StyledRoot>
  );
}