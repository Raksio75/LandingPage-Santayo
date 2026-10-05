/*********************************************************/
	Extructura de archivos 
/*********************************************************/

LandingPage Santayo/
│
├── index.html                  # Orquestador central (Carga los templates dinámicamente)
│
├── assets
│   │
│   └───img/
│       ├── logo.png
│       ├── favicon.ico
│       └── products/               # Todas las fotos de las gorras optimizadas
│       css/
│       ├── tailwind.config.js      # Configuración de colores y fuentes
│       └── main.css                # Estilos personalizados y animaciones
│
├── js/
│   ├── logger.js               # Trazabilidad empresarial (consola)
│   ├── catalog-data.js         # Base de datos local (JSON con los productos, IDs, rutas de imagen)
│   └── app.js                  # Lógica de renderizado, carrito/selección y envío de formulario

