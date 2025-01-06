
# Proyecto DashboardCryptoAPIs

Este repositorio contiene un proyecto completo para un dashboard que utiliza APIs de criptomonedas. El proyecto se ejecuta mediante Docker, lo que simplifica su despliegue y configuración.

---

## **Requisitos Previos**

Antes de iniciar, asegúrate de tener los siguientes requisitos instalados en tu máquina:

1. **Git**: Para clonar el repositorio.
2. **Docker**: Para ejecutar los contenedores.
3. **Docker Compose**: Generalmente incluido con Docker Desktop.

Puedes verificar que Docker y Docker Compose estén instalados ejecutando:

```bash
docker --version
docker-compose --version
```

---

## **Pasos para Desplegar el Proyecto**

### 1. Clonar el Repositorio

Abre tu terminal y clona este repositorio ejecutando:

```bash
git clone https://github.com/YoelPerezCarrasco/DashboardCryptoAPIs.git
```

Luego, entra en la carpeta del proyecto:

```bash
cd DashboardCryptoAPIs
```

---

### 2. Iniciar el Proyecto con Docker Compose

Ejecuta el siguiente comando desde la raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`):

```bash
docker-compose up
```

Esto:
- Construirá las imágenes de Docker necesarias.
- Iniciará los contenedores para el backend, frontend y cualquier otra dependencia configurada.

---

### 3. Acceder a la Aplicación

Una vez que Docker Compose haya lanzado todos los servicios, puedes acceder al **frontend** del proyecto en tu navegador web:

```text
http://localhost:3000
```

El puerto 3000 es el predeterminado para el frontend en este proyecto. Asegúrate de que no haya otros servicios utilizando ese puerto.

---

## **Apagar el Proyecto**

Para detener y eliminar los contenedores, presiona `Ctrl + C` en el terminal donde se ejecutó `docker-compose up`, o bien ejecuta:

```bash
docker-compose down
```

Esto detendrá y eliminará los contenedores asociados al proyecto.

---

## **Notas Adicionales**

- Si necesitas reconstruir las imágenes de Docker (por ejemplo, después de realizar cambios en el código), utiliza:

```bash
docker-compose up --build
```

- Si encuentras problemas, verifica los logs ejecutando:

```bash
docker-compose logs
```

- Asegúrate de que los puertos necesarios (por ejemplo, 3000 para el frontend) estén disponibles en tu máquina.

---

¡Disfruta explorando y utilizando el DashboardCryptoAPIs! 🚀

