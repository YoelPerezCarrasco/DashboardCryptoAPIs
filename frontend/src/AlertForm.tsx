import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const AlertForm: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [crypto, setCrypto] = useState("bitcoin");
  const [targetPrice, setTargetPrice] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/set-alert", null, {
        params: {
          phone,
          crypto,
          target_price: targetPrice,
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error setting alert:", error);
      alert("Error configuring alert. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
      <Typography variant="h5" gutterBottom>
        Configure Your Price Alert
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="crypto-select-label">Cryptocurrency</InputLabel>
          <Select
            labelId="crypto-select-label"
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
          >
            <MenuItem value="bitcoin">Bitcoin</MenuItem>
            <MenuItem value="ethereum">Ethereum</MenuItem>
            <MenuItem value="dogecoin">Dogecoin</MenuItem>
            {/* Puedes añadir más criptomonedas aquí */}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Target Price (USD)"
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(Number(e.target.value))}
            required
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Set Alert
        </Button>
      </form>
    </Box>
  );
};

export default AlertForm;
