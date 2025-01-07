# Proyecto: Dashboard Crypto APIs

## Descripción
Este proyecto es un dashboard interactivo para consultar precios de criptomonedas, realizar conversiones, configurar alertas de precios y leer noticias relacionadas con el mundo de las criptomonedas.

Se utilizan diversas APIs para obtener datos en tiempo real, y el proyecto está configurado con Docker para simplificar su despliegue.

## Requisitos Previos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/YoelPerezCarrasco/DashboardCryptoAPIs.git
   ```

2. **Tener Docker instalado**:
   - Descarga e instala Docker Desktop desde [Docker](https://www.docker.com/).
   - Verifica que Docker esté funcionando correctamente:
     ```bash
     docker --version
     ```

3. **Acceder al directorio del proyecto**:
   ```bash
   cd DashboardCryptoAPIs
   ```

## Despliegue del Proyecto

1. **Ejecutar Docker Compose**:
   En la raíz del proyecto, ejecuta:
   ```bash
   docker-compose up
   ```

   Esto iniciará todos los contenedores necesarios para ejecutar la aplicación (frontend, backend, base de datos, etc.).

2. **Abrir el Frontend**:
   Una vez que los contenedores estén funcionando, abre tu navegador y accede a:
   ```
   http://localhost:3000
   ```
   Aquí se encuentra el frontend del proyecto.

## APIs Utilizadas

El proyecto utiliza las siguientes APIs externas para obtener datos:

### 1. **CoinGecko API**
   - **Descripción**: Proporciona datos sobre precios de criptomonedas, cambios en tiempo real y monedas soportadas para conversión.
   - **Endpoints utilizados**:
     - `GET /simple/price`: Para obtener los precios actuales de criptomonedas en varias monedas fiat.
     - `GET /simple/supported_vs_currencies`: Para listar las monedas soportadas para conversión.
   - **API Key**: No se requiere autenticación para los endpoints utilizados.

### 2. **NewsAPI**
   - **Descripción**: Permite obtener noticias relevantes sobre criptomonedas y blockchain.
   - **Endpoints utilizados**:
     - `GET /v2/everything`: Busca noticias relacionadas con criptomonedas usando términos como "bitcoin" o "ethereum".
   - **API Key**: Se obtiene registrándose en [NewsAPI](https://newsapi.org/) y configurándola en el archivo `.env` como `NEWS_API_KEY`.

### 3. **Twilio SMS API**
   - **Descripción**: Envía mensajes SMS a los usuarios cuando una alerta configurada se activa.
   - **Uso**:
     - Notificar al usuario que su alerta ha sido configurada.
     - Enviar un mensaje cuando el precio de una criptomoneda alcance el objetivo definido.
   - **API Key**:
     - Regístrate en [Twilio](https://www.twilio.com/).
     - Obtén las credenciales (`Account SID` y `Auth Token`) desde el panel de Twilio.
     - Configúralas en el archivo `.env` como:
       ```
       TWILIO_ACCOUNT_SID=your_account_sid
       TWILIO_AUTH_TOKEN=your_auth_token
       TWILIO_PHONE_NUMBER=your_twilio_number
       ```

## Características del Proyecto

1. **Consulta de Precios**:
   - Visualiza los precios actuales de las criptomonedas.
   - Revisa cambios porcentuales en las últimas 24 horas.

2. **Conversión de Monedas**:
   - Convierte montos entre diferentes criptomonedas y monedas fiat.

3. **Noticias Relevantes**:
   - Lee noticias actualizadas sobre criptomonedas y tecnología blockchain.

4. **Alertas de Precios**:
   - Configura alertas basadas en el precio objetivo de una criptomoneda.
   - Recibe notificaciones SMS cuando se active una alerta.

## Estructura del Proyecto

- **frontend/**: Contiene el código del dashboard desarrollado en React con TypeScript.
- **backend/**: Implementa las lógicas de negocio y expone las APIs necesarias usando FastAPI.
- **docker-compose.yml**: Configura los servicios del proyecto, incluyendo frontend, backend y otros contenedores necesarios.

## Comandos Útiles

- **Detener los contenedores**:
  ```bash
  docker-compose down
  ```

- **Reconstruir los contenedores** (si realizaste cambios en el código):
  ```bash
  docker-compose up --build
  ```

## Notas

- Asegúrate de que los puertos 3000 (frontend) y 8000 (backend) estén disponibles en tu sistema.
- Si tienes problemas con el despliegue, verifica los logs de Docker para diagnosticar errores:
  ```bash
  docker-compose logs
  ```

Con este proyecto, puedes monitorear criptomonedas, configurar alertas y estar siempre al tanto de las últimas noticias en el mundo cripto. ¡Listo para explorar! 🚀

