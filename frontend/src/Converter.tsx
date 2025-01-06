import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Autocomplete, 
  Paper,
  Divider 
} from '@mui/material';
import axios from 'axios';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

interface ConverterProps {
  coinsList: Coin[];
}

const Converter: React.FC<ConverterProps> = ({ coinsList }) => {
  const [fromCoin, setFromCoin] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [vsCurrencies, setVsCurrencies] = useState<string[]>([]);

  useEffect(() => {
    // Fetch vs_currencies from CoinGecko without authentication
    axios
      .get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
      .then((response) => {
        setVsCurrencies(response.data); // Save valid vs_currencies
      })
      .catch((error) => {
        console.error('Error fetching vs_currencies:', error);
      });
  }, []);

  const handleConvert = () => {
    if (!fromCoin || !toCurrency || amount <= 0) {
      console.error('Invalid input data');
      return;
    }

    axios
      .get('http://localhost:8000/api/convert', {
        params: {
          from_coin: fromCoin,
          to_currency: toCurrency,
          amount: amount,
        },
      })
      .then((response) => {
        setConvertedAmount(response.data.converted_amount);
      })
      .catch((error) => {
        console.error('Error converting currency:', error);
      });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
        mt: 2,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Crypto Converter
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'flex-start',
        }}
      >
        {/* Selección de la moneda de origen */}
        <Autocomplete
          options={coinsList}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img loading="lazy" width="20" src={option.image} alt="" />
              {option.name}
            </Box>
          )}
          renderInput={(params) => (
            <TextField {...params} label="From Coin" variant="outlined" />
          )}
          value={coinsList.find((coin) => coin.id === fromCoin) || null}
          onChange={(event, newValue) => {
            setFromCoin(newValue ? newValue.id : '');
          }}
          sx={{ width: 240 }}
        />

        {/* Selección de la moneda de destino */}
        <Autocomplete
          options={vsCurrencies}
          getOptionLabel={(option) => option.toUpperCase()}
          renderInput={(params) => (
            <TextField {...params} label="To Currency" variant="outlined" />
          )}
          value={vsCurrencies.includes(toCurrency) ? toCurrency : null}
          onChange={(event, newValue) => {
            setToCurrency(newValue || '');
          }}
          sx={{ width: 240 }}
        />

        {/* Cantidad a convertir */}
        <TextField
          label="Amount"
          type="number"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          sx={{ width: 240 }}
        />

        {/* Botón de conversión */}
        <Button
          variant="contained"
          size="large"
          onClick={handleConvert}
          sx={{
            alignSelf: 'center',
            mt: { xs: 1, sm: 0 }, // Margen superior en pantallas pequeñas
          }}
        >
          Convert
        </Button>
      </Box>

      {/* Resultado de la conversión */}
      {convertedAmount !== null && (
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.background.default
                : '#f5f5f5',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Converted Amount:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 20, mt: 1 }}>
            {convertedAmount}
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default Converter;
