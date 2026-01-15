# Visualizador Nutricional 3D

## 🚀 Cómo Ejecutar la Aplicación

### 1. Iniciar el Backend (Flask)

Abre una terminal en la carpeta `backend` y ejecuta:

```bash
python run.py
```

El servidor estará disponible en: `http://127.0.0.1:5000`

### 2. Abrir el Frontend

Simplemente abre el archivo `frontend/index.html` en tu navegador web.

**Opción alternativa:** Usa un servidor local como Live Server de VS Code o ejecuta:

```bash
cd frontend
python -m http.server 8000
```

Luego abre: `http://localhost:8000`

---

## 🎯 Cómo Usar la Aplicación

1. **Buscar un producto:** Ingresa un código de barras en el campo de búsqueda
   - Ejemplo: `3017620422003` (Nutella)
   - Ejemplo: `5449000000996` (Coca-Cola)

2. **Visualizar en 3D:** Los nutrientes aparecerán como cilindros 3D de colores
   - Cada color representa un nutriente diferente
   - La altura indica la cantidad del nutriente

3. **Interactuar con la escena:**
   - 🖱️ **Click izquierdo + arrastrar:** Rotar la cámara
   - 🖱️ **Rueda del ratón:** Hacer zoom
   - 🖱️ **Click derecho + arrastrar:** Mover la cámara

4. **Calcular porciones:** Ingresa la cantidad de gramos y presiona "Calcular"

---

## 📁 Estructura del Proyecto

```
appInfNut/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Configuración de Flask + CORS
│   │   ├── config.py            # Configuración de la base de datos
│   │   ├── database.py          # Instancia de SQLAlchemy
│   │   ├── models/              # Modelos de datos
│   │   ├── routes/              # Endpoints de la API
│   │   ├── services/            # Lógica de negocio
│   │   └── utils/               # Utilidades
│   ├── instance/                # Base de datos SQLite
│   ├── requirements.txt         # Dependencias de Python
│   └── run.py                   # Punto de entrada
│
└── frontend/
    ├── index.html               # Estructura HTML
    ├── estilos.css              # Estilos (glassmorphism + dark theme)
    └── aplicacion.js            # Lógica + Three.js

```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3**
- **Flask 3.0.0** - Framework web
- **Flask-SQLAlchemy 3.1.1** - ORM
- **Flask-CORS 4.0.0** - Soporte CORS
- **Requests 2.31.0** - Cliente HTTP
- **SQLite** - Base de datos

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (Glassmorphism, animaciones)
- **JavaScript (Vanilla)** - Lógica
- **Three.js r128** - Renderizado 3D
- **OrbitControls** - Controles de cámara

---

## 🎨 Características del Frontend

✨ **Diseño Moderno:**
- Tema oscuro con colores vibrantes
- Efecto glassmorphism
- Animaciones suaves
- Diseño responsive

🌟 **Visualización 3D:**
- Escena 3D interactiva con Three.js
- Partículas de fondo animadas
- Iluminación dinámica
- Plataforma giratoria
- Cilindros 3D para cada nutriente

🎮 **Interactividad:**
- Búsqueda de productos por código de barras
- Calculadora de porciones
- Controles de cámara (rotar, zoom, mover)
- Indicadores de carga
- Mensajes de error

---

## 📊 API Endpoints

### `GET /`
Información de la API

### `GET /productos/<codigo_barras>`
Obtener información completa del producto

**Ejemplo:**
```
GET http://127.0.0.1:5000/productos/3017620422003
```

### `GET /productos/<codigo_barras>/porcion/<gramos>`
Calcular nutrientes por porción

**Ejemplo:**
```
GET http://127.0.0.1:5000/productos/3017620422003/porcion/50
```

---

## 🔧 Solución de Problemas

### El backend no inicia
- Verifica que las dependencias estén instaladas: `pip install -r requirements.txt`
- Asegúrate de estar en la carpeta `backend`

### Error de CORS
- Verifica que Flask-CORS esté instalado
- El backend debe estar corriendo en `http://127.0.0.1:5000`

### La visualización 3D no aparece
- Abre la consola del navegador (F12) para ver errores
- Verifica que Three.js se cargue correctamente desde el CDN
- Asegúrate de tener conexión a internet (para cargar Three.js)

### Producto no encontrado
- Verifica que el código de barras sea válido
- El producto debe existir en Open Food Facts
- Revisa la conexión a internet

---

## 💡 Códigos de Barras para Probar

- `3017620422003` - Nutella
- `5449000000996` - Coca-Cola
- `8480000590718` - Aceite de oliva
- `7622210449283` - Oreo

---

## 📝 Notas

- Los datos provienen de **Open Food Facts** (base de datos abierta)
- La primera búsqueda puede tardar unos segundos (consulta a la API externa)
- Los productos se guardan en la base de datos local para consultas futuras
- Todos los valores nutricionales son por 100g por defecto
