import { useState, useEffect } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Link,
} from '@mui/material'

function App() {
  const [amountUsd, setAmountUsd] = useState('')
  const [rate, setRate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD')
        if (!response.ok) {
          throw new Error('La API no respondió correctamente')
        }
        const data = await response.json()
        setRate(data.rates.HNL)
      } catch (err) {
        setError('No se pudo obtener la tasa de cambio. Intenta de nuevo más tarde.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRate()
  }, [])

  const totalHnl =
    rate !== null && amountUsd !== ''
      ? (parseFloat(amountUsd) * rate).toFixed(2)
      : '0.00'

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Convertidor USD → HNL
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 3 }}>
              <CircularProgress size={24} />
              <Typography>Cargando...</Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 2 }}>
                1 USD = {rate.toFixed(2)} HNL
              </Typography>

              <TextField
                label="Cantidad en dólares (USD)"
                type="number"
                fullWidth
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                slotProps={{ htmlInput: { min: 0, step: 'any' } }}
                sx={{ mb: 3 }}
              />

              <Typography variant="h5" align="center">
                Total: L {totalHnl}
              </Typography>
            </>
          )}

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            <Link href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">
              Rates By Exchange Rate API
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default App