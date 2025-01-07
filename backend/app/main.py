from fastapi import FastAPI, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from cachetools import TTLCache
import time
from twilio.rest import Client


load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
API_KEY = "CG-pr8XL6o36UZCTfrGFUhh79Un"
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price"

app = FastAPI()
cache = TTLCache(maxsize=100, ttl=60)

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Lista para almacenar las alertas configuradas
alerts = []


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


@app.get("/api/alerts")
def list_alerts():
    """
    Lista todas las alertas configuradas.
    """
    return alerts

@app.delete("/api/alerts")
def delete_alert(phone: str, crypto: str):
    """
    Elimina una alerta específica.
    """
    global alerts
    alerts = [alert for alert in alerts if not (alert["phone"] == phone and alert["crypto"] == crypto)]
    return {"message": f"Alert for {crypto.capitalize()} has been deleted for {phone}"}


def send_sms(to: str, body: str):
    """
    Envía un SMS usando Twilio API.
    """
    url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
    auth = (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    data = {
        "To": to,
        "From": TWILIO_PHONE_NUMBER,
        "Body": body,
    }
    response = requests.post(url, auth=auth, data=data)
    if response.status_code != 201:
        print(f"Failed to send SMS: {response.status_code} - {response.text}")
    else:
        print(f"SMS sent successfully to {to}")

@app.post("/api/set-alert")
def set_price_alert(
    phone: str = Query(..., description="Phone number to send SMS."),
    crypto: str = Query(..., description="Cryptocurrency to monitor."),
    target_price: float = Query(..., description="Price threshold for alert."),
    background_tasks: BackgroundTasks = None
):
    """
    Configura una alerta de precio para una criptomoneda específica.
    """
    alert = {"phone": phone, "crypto": crypto.lower(), "target_price": target_price}
    alerts.append(alert)

    # Enviar mensaje SMS de confirmación
    confirmation_message = (
        f"Tu alerta para {crypto.capitalize()} se ha configurado con éxito. "
        f"Te notificaremos cuando alcance el precio objetivo de ${target_price}."
    )
    send_sms(phone, confirmation_message)

    # Monitoreo del precio en segundo plano
    background_tasks.add_task(monitor_price, phone, crypto.lower(), target_price)

    return {"message": f"Alert set for {crypto.capitalize()} at ${target_price}"}

def monitor_price(phone: str, crypto: str, target_price: float):
    """
    Monitorea el precio de una criptomoneda y envía un SMS cuando se cumple la condición.
    """
    while True:
        try:
            response = requests.get(COINGECKO_API, params={"ids": crypto, "vs_currencies": "usd"})
            response.raise_for_status()
            data = response.json()
            current_price = data.get(crypto, {}).get("usd", 0)

            if current_price >= target_price:
                alert_message = (
                    f"¡Alerta activada! {crypto.capitalize()} ha alcanzado el precio objetivo de ${target_price}. 🚀"
                )
                send_sms(phone, alert_message)
                break

        except Exception as e:
            print(f"Error monitoring price for {crypto}: {e}")
            break