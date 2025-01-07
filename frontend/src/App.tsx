import React, { useEffect, useState } from 'react';
import {
  Typography,
  Tabs,
  Tab,
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  IconButton,
  CssBaseline,
  Grid,
  CircularProgress,
  AppBar,
  Toolbar,
  TableContainer,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Converter from './Converter';
import Slider from 'react-slick';

interface Price {
  id: string;
  name: string;
  image: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface NewsArticle {
  url: string;
  title: string;
  publishedAt: string;
  description?: string;
  urlToImage?: string;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const App: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // State for alerts
  const [phone, setPhone] = useState('');
  const [crypto, setCrypto] = useState('bitcoin');
  const [targetPrice, setTargetPrice] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial',
    },
  });

  const handleSetAlert = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/set-alert', null, {
        params: {
          phone,
          crypto,
          target_price: targetPrice,
        },
      });
      alert(response.data.message);
      setPhone('');
      setTargetPrice(0);
    } catch (error) {
      console.error('Error setting alert:', error);
      alert('Failed to set alert. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricesResponse, newsResponse] = await Promise.all([
          axios.get<Price[]>('http://localhost:8000/api/prices'),
          axios.get<NewsArticle[]>('http://localhost:8000/api/news'),
        ]);
        setPrices(pricesResponse.data);
        setNews(newsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: '100%', margin: 0, padding: 0 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%', margin: 0, padding: 0 }}>
        <AppBar position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="h1">
              Crypto Dashboard
            </Typography>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Prices" />
          <Tab label="News" />
          <Tab label="Set Alert" />
        </Tabs>
        
        {tabValue === 0 && (
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
           {/* Columna izquierda: Prices */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Prices
                </Typography>
                <Box sx={{ mt: 1, mb: 2, width: '100%', height: '4px', backgroundColor: 'primary.main' }} />

                {/* TableContainer para un look más limpio */}
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ borderRadius: 2, backgroundColor: 'inherit' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          '& .MuiTableCell-root': {
                            fontWeight: 'bold',
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? theme.palette.background.default
                                : '#f5f5f5',
                          },
                        }}
                      >
                        <TableCell>Cryptocurrency</TableCell>
                        <TableCell align="right">Price (USD)</TableCell>
                        <TableCell align="right">24h Change (%)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prices.map((coin, index) => (
                        <TableRow
                          key={coin.id}
                          sx={{
                            // Efecto “zebra” en filas pares
                            backgroundColor:
                              index % 2 === 0
                                ? 'transparent'
                                : (theme) =>
                                    theme.palette.mode === 'dark'
                                      ? '#424242' // tono gris en dark mode
                                      : '#fafafa',
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Box
                                component="img"
                                src={coin.image}
                                alt={coin.name}
                                sx={{
                                  width: 24,
                                  height: 24,
                                  mr: 1.5,
                                  borderRadius: '50%',
                                  boxShadow: 2,
                                }}
                              />
                              <Link
                                href={`https://www.coingecko.com/en/coins/${coin.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                sx={{ fontWeight: 'medium' }}
                              >
                                {coin.name}
                              </Link>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                            ${coin.current_price.toLocaleString()}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 'medium',
                              color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main',
                            }}
                          >
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>


            {/* Columna derecha: Converter */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Converter
                  coinsList={prices.map((coin) => ({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    image: coin.image,
                  }))}
                />
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              News
            </Typography>
            <Slider {...settings}>
              {news.map((article) => (
                <Box key={article.url} sx={{ padding: 2 }}>
                  <Paper elevation={1} sx={{ padding: 2 }}>
                    {article.urlToImage && (
                      <img src={article.urlToImage} alt={article.title} style={{ width: '100%', height: 'auto' }} />
                    )}
                    <Typography variant="h6" gutterBottom>
                      <Link href={article.url} target="_blank" rel="noopener noreferrer" underline="hover">
                        {article.title}
                      </Link>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">{article.description}</Typography>
                  </Paper>
                </Box>
              ))}
            </Slider>
          </Paper>
        )}
         {tabValue === 2 && (
          <Paper elevation={4} sx={{ p: 3, m: 2, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
              Set Price Alert
            </Typography>
            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Cryptocurrency</InputLabel>
                <Select
                  value={crypto}
                  onChange={(e) => setCrypto(e.target.value)}
                  required
                >
                  {prices.map((coin) => (
                    <MenuItem key={coin.id} value={coin.id}>
                      {coin.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Target Price (USD)"
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  required
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSetAlert}
              >
                Set Alert
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
