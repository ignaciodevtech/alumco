# Plataforma E-Learning ONG Alumco

Plataforma web centralizada desarrollada para la ONG Alumco, orientada a la gestión, digitalización y automatización de su programa de capacitación. El sistema permite a los colaboradores acceder a material de estudio (PDF, videos), rendir evaluaciones de selección múltiple y obtener certificados automáticos al aprobar, optimizando los tiempos operativos del área de formación.

## Stack Tecnológico

* **Backend:** PHP / Laravel
* **Frontend:** Vue.js + Inertia.js + Tailwind CSS
* **Base de Datos:** MySQL
* **Arquitectura:** Single Page Application (SPA) / MVC

---

## 💻 Entorno Local (Desarrollo)

Sigue estas instrucciones para levantar el proyecto en tu propio equipo para realizar modificaciones o pruebas.

### Requisitos Previos (Local)
Asegúrate de tener instalado el siguiente software en tu equipo:
1. **[PHP](https://www.php.net/)** (v8.1 o superior)
2. **[Composer](https://getcomposer.org/)** (Gestor de dependencias de PHP)
3. **[Node.js y npm](https://nodejs.org/)** (Para compilar los recursos de Vue y Tailwind)
4. **[MySQL](https://www.mysql.com/)** (XAMPP, Laragon o Workbench)
5. **[Git](https://git-scm.com/)** (Para clonar el repositorio)

### Instrucciones de Instalación
Abre tu terminal y ejecuta los siguientes comandos:

1. **Obtener el código fuente:**
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DE_LA_CARPETA>
```
2. **Instalar dependencias del Backend:**
```bash
composer install
```
3. **Instalar dependencias del Frontend:**
```bash
npm install
```
4. **Configurar variables de entorno:**
```bash
cp .env.example .env
```
*(Abre el archivo `.env` recién creado y configura las credenciales de tu base de datos local `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).*

5. **Generar clave de la aplicación:**
```bash
php artisan key:generate
```
6. **Ejecutar las migraciones:**
```bash
php artisan migrate
```
7. **Compilar los recursos del Frontend (Modo observación):**
```bash
npm run dev
```
8. **Levantar servidor local:**
En una nueva pestaña de la terminal, ejecuta:
```bash
php artisan serve
```
*Ingresa a `http://localhost:8000` en tu navegador.*

---

## ☁️ Entorno en la Nube (Producción / Servidor Linux)

Estas instrucciones están diseñadas para desplegar la aplicación en un servidor VPS o instancia en la nube (ej. AWS EC2 con Ubuntu y Apache).

### Requisitos del Servidor
* Servidor web (Apache o Nginx)
* PHP 8.1+ y extensiones requeridas por Laravel (xml, mbstring, curl, zip, etc.)
* MySQL Server instalado y configurado
* Composer y Node.js instalados en el servidor

### Instrucciones de Despliegue

**1. Ubicar el proyecto en el servidor:**
Normalmente, los proyectos web en Linux se alojan en el directorio público del servidor web.
```bash
cd /var/www
git clone <URL_DEL_REPOSITORIO> alumco
cd alumco
```

**2. Instalar dependencias optimizadas:**
Para producción, excluimos los paquetes de desarrollo.
```bash
composer install --optimize-autoloader --no-dev
npm install
npm run build
```

**3. Configurar entorno de Producción:**
Genera el archivo `.env` y ajústalo estrictamente para producción:
```bash
cp .env.example .env
```
Edita el archivo `.env` (`nano .env`) y asegúrate de modificar estas líneas clave:
* `APP_ENV=production`
* `APP_DEBUG=false`
* `APP_URL=http://<IP_PUBLICA_O_DOMINIO>`
* *Configura también las credenciales de la base de datos de producción.*

**4. Preparar la Base de Datos y Caché:**
```bash
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**5. Configurar Permisos del Servidor (Crítico):**
Para que el sistema pueda subir archivos (como fotos de cursos o generar certificados), el servidor web (usualmente `www-data` en Ubuntu/Apache) debe tener los permisos correctos sobre las carpetas de almacenamiento y caché.
```bash
sudo chown -R www-data:www-data /var/www/alumco/storage
sudo chown -R www-data:www-data /var/www/alumco/bootstrap/cache
sudo chmod -R 775 /var/www/alumco/storage
sudo chmod -R 775 /var/www/alumco/bootstrap/cache
```

**6. Generar Enlace Simbólico de Almacenamiento:**
Obligatorio para que las imágenes y archivos subidos sean visibles públicamente.
```bash
sudo php artisan storage:link
```

**7. Configurar el Virtual Host (Apache):**
Asegúrate de que la configuración de tu servidor apunte a la carpeta `public` del proyecto, no a la raíz.
`DocumentRoot /var/www/alumco/public`
npm run dev
### 8. Levantar servidor local
php artisan serve
### Ingresar al localhost
