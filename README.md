# Proyecto: Dashboard Crypto APIs

## Descripción
Este proyecto es un dashboard para consultar precios de criptomonedas, realizar conversiones y leer noticias relacionadas con el mundo de las criptomonedas.
Está construido utilizando Docker para facilitar el despliegue y configuración.

## Requisitos Previos
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/YoelPerezCarrasco/DashboardCryptoAPIs.git
   ```

2. **Tener Docker instalado**:
   - Descarga e instala Docker Desktop desde [Docker](https://www.docker.com/).
   - Asegúrate de que Docker esté corriendo correctamente ejecutando:
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

   Este comando lanzará todos los contenedores necesarios para ejecutar la aplicación (frontend, backend, base de datos, etc.).

2. **Abrir el Frontend**:
   Una vez que los contenedores estén funcionando, abre tu navegador y accede a:
   ```
   http://localhost:3000
   ```
   Aquí se encuentra el frontend del proyecto.

## APIs Utilizadas

El proyecto utiliza las siguientes APIs para obtener datos:

1. **CoinGecko API**:
   - **Descripción**: Proporciona información sobre precios de criptomonedas, cambios de precios en 24 horas y mucho más.
   - **Endpoints utilizados**:
     - `GET /simple/price`: Para obtener precios actuales de criptomonedas.
     - `GET /simple/supported_vs_currencies`: Para listar monedas de cambio soportadas.

2. **NewsAPI**:
   - **Descripción**: Obtiene noticias relacionadas con criptomonedas y blockchain.
   - **Endpoints utilizados**:
     - `GET /v2/everything`: Para buscar noticias específicas sobre criptomonedas.

## Estructura del Proyecto

- **frontend/**: Contiene el código del dashboard desarrollado en React.
- **backend/**: Implementa las lógicas de negocio y sirve las APIs necesarias.
- **docker-compose.yml**: Configura los servicios necesarios (frontend, backend, base de datos, etc.).

## Comandos Útiles

- **Detener los contenedores**:
  ```bash
  docker-compose down
  ```

- **Reconstruir los contenedores** (si has realizado cambios en el código):
  ```bash
  docker-compose up --build
  ```

## Notas
- Asegúrate de que los puertos 3000 (frontend) y otros definidos en el archivo `docker-compose.yml` estén disponibles en tu sistema.
- Si tienes algún problema con el despliegue, verifica los logs de Docker para identificar el problema:
  ```bash
  docker-compose logs
  ```

