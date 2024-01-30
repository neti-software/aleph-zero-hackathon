import React, { useState } from 'react'

import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'

const theme = createTheme({
  palette: {
    primary: { main: '#00eac7' },
  },
})

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
]

interface RequestFormProps {
  onFormDataSubmit: (phoneNumber: string, mobileOperator?: string) => void // Mobile operator is now optional
  updateIsLoading: boolean
  operatorIncluded: boolean
}

function RequestForm({ onFormDataSubmit, updateIsLoading, operatorIncluded }: RequestFormProps) {
  const [phoneNumber, setPhoneNumberState] = useState('')

  const [mobileOperator, setMobileOperator] = useState<string | undefined>(undefined)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onFormDataSubmit(phoneNumber, mobileOperator)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" color="primary">
            Set metadata
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <InputLabel htmlFor="phoneNumber" sx={{color: '#00eac7'}}>Phone number</InputLabel>
            <TextField
              margin="normal"
              value={phoneNumber}
              required
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              autoComplete="Phone number"
              autoFocus
              onChange={(e) => setPhoneNumberState(e.target.value)}
              sx={{
                mt: 0,
                input: { color: 'black' },
                backgroundColor: 'white',
                borderRadius: '10px',
                '& label.Mui-focused': {
                  color: '#00eac7',
                  borderRadius: '10px',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#00eac7',
                  borderRadius: '10px',
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00eac7',
                    borderRadius: '10px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00eac7',
                    borderRadius: '10px',
                  },
                },
              }}
            />
            {operatorIncluded && (
              <>
                <InputLabel htmlFor="mobileOperator" sx={{color: '#00eac7'}}>Mobile Operator</InputLabel>
                <TextField
                  id="mobileOperator"
                  name="mobileOperator"
                  select
                  value={mobileOperator || ''}
                  fullWidth
                  onChange={(e) => setMobileOperator(e.target.value)}
                  sx={{
                    mt: 0,
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '& label.Mui-focused': {
                      color: '#00eac7',
                      borderRadius: '10px',
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: '#00eac7',
                      borderRadius: '10px',
                    },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#00eac7',
                        borderRadius: '10px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00eac7',
                        borderRadius: '10px',
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
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={updateIsLoading}
              style={{
                backgroundColor: '#00eac7',
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
  )
}

export default RequestForm
