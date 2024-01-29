import { Box, Button, Container, MenuItem, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useState } from "react";

const theme = createTheme({
  palette: {
    primary: { main: '#00eac7'},
  },
});

const mobileOperators = [
  {
    value: '0x1111111111111111111111111111111111111111',
    label: 'Orange',
  },
  {
    value: '0x2222222222222222222222222222222222222222',
    label: 'T-Mobile',
  },
  {
    value: '0x3333333333333333333333333333333333333333',
    label: 'Play',
  },
  {
    value: '0x4444444444444444444444444444444444444444',
    label: 'Plus',
  },
];

function RequestForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileOperator, setMobileOperator] = useState(mobileOperators[0].value);

  const handleSubmit = (event: React.FormEvent) => {
    alert(mobileOperator + ' ' + phoneNumber);
    event.preventDefault();
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" color='primary'>
            Register number
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              value={phoneNumber}
              required
              fullWidth
              id="phoneNumber"
              label="Phone number"
              name="phoneNumber"
              autoComplete="Phone number"
              autoFocus
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                '& label.Mui-focused': {
                  color: '#00eac7',
                  borderRadius: "10px",
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#00eac7',
                  borderRadius: "10px",
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00eac7',
                    borderRadius: "10px",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00eac7',
                    borderRadius: "10px",
                  },
                },
              }}
            />
            <TextField
              id="outlined-select-currency"
              name="mobileOperator"
              select
              value={mobileOperator}
              label="Select operator"
              fullWidth
              onChange={(e) => setMobileOperator(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                '& label.Mui-focused': {
                  color: '#00eac7',
                  borderRadius: "10px",
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#00eac7',
                  borderRadius: "10px",
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00eac7',
                    borderRadius: "10px",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00eac7',
                    borderRadius: "10px",
                  },
                },
              }}
            >
              {mobileOperators.map((operator) => (
                <MenuItem key={operator.value} value={operator.value}>
                  {operator.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{
                backgroundColor: '#00eac7'
              }}
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              REGISTER
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default RequestForm;