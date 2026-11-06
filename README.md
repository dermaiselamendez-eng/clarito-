# Clínica Dermatológica Isela Méndez — App de gestión

Panel de administración + landing de agenda de citas, hechos a la medida de la clínica.

## Cómo usarla en tu computadora

1. Instala [Node.js](https://nodejs.org) (versión 18 o más nueva) una sola vez.
2. Abre una terminal en esta carpeta y corre:

   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   ```

3. Abre tu navegador en **http://localhost:3000**
   - Landing pública: `http://localhost:3000`
   - Panel admin: `http://localhost:3000/admin/login`

### Acceso al panel de administrador

- **Correo:** `admin@iselamendez.mx`
- **Contraseña temporal:** `IselaMendez2026!`

Cámbiala en cuanto entres (sección **Equipo**, crea tu cuenta personal y desactiva la temporal, o pide que te ayuden a agregar un cambio de contraseña).

### Para dejarla corriendo siempre

`npm run dev` es para probar. Para uso diario real, usa:

```bash
npm run build
npm run start
```

## Qué incluye

- **Panel principal**: simulación financiera (marcada como "Simulación") + resultados reales de la landing (visitas, registros, conversión).
- **Pacientes**: ficha con historial de citas, cobros y expediente clínico.
- **Citas, Tratamientos, Cobros, Recordatorios, Inventario**: gestión diaria de la clínica.
- **Mi página**: edita los textos de tu landing sin tocar código.
- **Equipo**: agrega cuentas para otros doctores o recepción, con roles.
- **Landing pública**: con tu marca, tratamientos reales y formulario de agenda que alimenta el panel.

## Notas importantes

- La simulación financiera del dashboard usa los promedios que diste (venta mensual, pacientes/mes, gastos/mes) — **no son cifras contables reales**, están marcadas como "Simulación" en toda la app.
- Los precios de tratamientos no estaban publicados en tu sitio, así que quedaron en "A consultar". Captúralos en **Tratamientos** cuando quieras.
- La base de datos vive en el archivo `dev.db` en esta misma carpeta — haz respaldo de ese archivo de vez en cuando.
