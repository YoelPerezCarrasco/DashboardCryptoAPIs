from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from cachetools import TTLCache
import time

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
API_KEY = "CG-pr8XL6o36UZCTfrGFUhh79Un"


app = FastAPI()
cache = TTLCache(maxsize=100, ttl=60)


# Configuración de CORS para permitir el acceso desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica el dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint para obtener precios de criptomonedas
@app.get("/api/prices")
def get_prices():
    response = requests.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        params={
            "vs_currency": "usd",
            "order": "market_cap_desc",
            "per_page": 10,
            "page": 1,
            "sparkline": "false",
        },
    )
    data = response.json()
    return data

@app.get("/api/news")
def get_news():
    response = requests.get(
        "https://newsapi.org/v2/everything",
        params={
            "q": "cryptocurrency OR bitcoin OR ethereum",
            "apiKey": NEWS_API_KEY,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 10,
        },
    )
    data = response.json()
    articles = data["articles"]
    # Verifica que estos campos estén presentes en la respuesta
    return [
        {
            "url": article["url"],
            "title": article.get("title", "No title available"),  # Usa valores predeterminados si falta el campo
            "publishedAt": article.get("publishedAt", ""),
            "description": article.get("description", "No description available"),
            "urlToImage": article.get("urlToImage", None),  # Permite que sea opcional
        }
        for article in articles
    ]


def fetch_price(from_coin: str, to_currency: str):
    url = "https://api.coingecko.com/api/v3/simple/price"
    headers = {
        "accept": "application/json",
        "x-cg-pro-api-key": API_KEY
    }
    params = {
        "ids": from_coin,
        "vs_currencies": to_currency
    }
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Lanza una excepción para códigos de error HTTP
    return response.json()

@app.get("/api/convert")
def convert_crypto(
    from_coin: str = Query(..., description="Cryptocurrency to convert from."),
    to_currency: str = Query(..., description="Currency to convert to."),
    amount: float = Query(1.0, description="Amount to convert.")
):
    from_coin = from_coin.lower()
    to_currency = to_currency.lower()

    # Validar que la moneda de origen y destino no sean iguales
    if from_coin == to_currency:
        return {
            "error": "Invalid request: from_coin and to_currency cannot be the same."
        }

    # Cacheo de resultados
    cache_key = f"{from_coin}_{to_currency}"
    if cache_key in cache:
        conversion_rate = cache[cache_key]
    else:
        try:
            result = fetch_price(from_coin, to_currency)
            if from_coin in result and to_currency in result[from_coin]:
                conversion_rate = result[from_coin][to_currency]
                cache[cache_key] = conversion_rate
            else:
                return {
                    "error": f"Conversion rate for {from_coin} to {to_currency} not available."
                }
        except requests.exceptions.RequestException as e:
            return {"error": f"Failed to fetch conversion rate: {str(e)}"}

    # Calcular el monto convertido
    converted_amount = conversion_rate * amount
    return {
        "from_coin": from_coin,
        "to_currency": to_currency,
        "amount": amount,
        "conversion_rate": conversion_rate,
        "converted_amount": converted_amount,
    }