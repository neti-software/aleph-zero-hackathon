import React, { useState } from 'react'

import {
  Box,
  Button,
  Container,
  InputLabel,
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

interface RequestFormProps {
  onFormDataSubmit: ({ input, operator }: { input: string; operator: string }) => void
  name: string
  updateIsLoading: boolean
}

function RequestForm({ onFormDataSubmit, name, updateIsLoading }: RequestFormProps) {
  const [input, setInput] = useState('')
  const [operator, setOperator] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onFormDataSubmit({ input, operator })
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
            set {name === 'number_owner' ? 'new owner' : 'new phone number'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <InputLabel htmlFor={name} sx={{ color: '#00eac7' }}>
              {name === 'number_owner' ? 'wallet address' : 'phone number'}
            </InputLabel>
            <TextField
              margin="normal"
              value={input}
              required
              fullWidth
              id={name}
              name={name}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
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
            {name === 'register_phone' ? (
              <>
                <InputLabel htmlFor={name} sx={{ color: '#00eac7' }}>
                  operator
                </InputLabel>
                <TextField
                  margin="normal"
                  value={operator}
                  required
                  fullWidth
                  id={name}
                  name={name}
                  autoFocus
                  onChange={(e) => setOperator(e.target.value)}
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
              </>
            ) : null}

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
              CONFIRM
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default RequestForm
