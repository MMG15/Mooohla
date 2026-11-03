<p align="center">
  <img src="og-image.jpg" alt="Mooohla: vaquita con anteojos de sol. Cuentas claras conservan amistades" width="720">
</p>

<p align="center">
  <b><a href="https://mmg15.github.io/Mooohla/">👉 Abrir Mooohla</a></b>
</p>

# Mooohla 🐄

App para repartir gastos entre amigos. Nació para la despedida de soltero de
Cristian y quedó para todas las salidas que vengan.

El nombre mezcla *moola* (plata, en inglés) con el *muuu* de la vaca: hacemos la vaquita.

**Link:** https://mmg15.github.io/Mooohla/ (con **M** mayúscula; en minúscula da 404).

## Qué hace

- **Gastos:** cada uno anota lo que pagó, en qué categoría (combustible, comida,
  bebidas, salidas, otros) y entre quiénes se reparte.
- **Resumen:** total gastado, gasto por categoría, cuánto puso y cuánto le toca
  a cada uno, y **quién le paga a quién** con la menor cantidad de transferencias.
- **Participantes:** se agregan o quitan personas y se cambia la moneda.
- **En tiempo real:** lo que carga uno lo ven todos al instante.
- **Se instala como app** en el celular (PWA) y **funciona sin señal**.

## Cómo se usa

1. Abrí el link y elegí tu nombre en **"Vos sos:"**.
2. Instalala para tenerla a mano:
   - **Android / compu (Chrome o Edge):** botón naranja **Instalar** arriba a la derecha.
   - **iPhone (Safari):** **Compartir** → **Agregar a inicio**.
3. Cargá los gastos en la pestaña **Gastos** y mirá las cuentas en **Resumen**.

El indicador de arriba a la derecha muestra el estado:

| Indicador | Qué significa |
|---|---|
| 🟢 **Sincronizado** | Todo guardado en la nube. |
| 🟠 **Guardando…** | Subiendo un cambio. |
| 🟡 **Sin conexión** | No hay señal; ves los últimos datos guardados en el celular. |
| 🟡 **Sin conexión · pendiente** | Cargaste algo sin señal; se sube solo cuando vuelve internet. |
| 🟡 **Modo local** | No se pudo conectar a Firebase; lo que cargues queda solo en ese dispositivo. |

## Cómo está hecha

- **Página estática:** HTML, CSS y JavaScript en un solo `index.html`, sin
  frameworks ni build.
- **Base de datos:** [Firebase Firestore](https://firebase.google.com/docs/firestore),
  compartida y en tiempo real, con caché persistente para funcionar offline.
- **Login anónimo automático:** nadie ve pantalla de login, pero cada visita
  queda identificada para que las reglas de Firestore la dejen leer y escribir.
- **PWA:** manifest + service worker, así se instala y abre sin internet.
- **Hosting:** GitHub Pages. Cada `git push` a `main` publica la versión nueva
  en 1 o 2 minutos.

### Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa (pantallas, cálculos y conexión a Firebase). |
| `firebase-config.js` | Datos de conexión al proyecto de Firebase. |
| `firestore.rules` | Reglas de seguridad de la base (se cargan a mano en Firebase Console). |
| `manifest.webmanifest` | Nombre, colores e íconos de la app instalada. |
| `sw.js` | Service worker: guarda una copia de la app para abrirla sin señal. |
| `icons/` | `logo.svg` (vaquita del encabezado), `icon.svg` (ícono de la app) y los PNG generados a partir de él. |
| `og-image.jpg` | Imagen de la vista previa al compartir el link por WhatsApp y otras apps. |

## Hacer cambios

1. Editá los archivos en esta carpeta.
2. Probá en tu compu. Tiene que ser con un servidor, no con doble clic en
   `index.html`, porque así Firebase y el modo offline no funcionan:
   ```
   python -m http.server 8000
   ```
   y entrá a http://localhost:8000
3. Si el cambio es grande, subí el número de `VERSION` en `sw.js`
   (por ejemplo `mooohla-v3` → `mooohla-v4`). Así los celulares bajan la
   versión nueva y la app se recarga sola una vez.
4. `git commit` + `git push`. En 1 o 2 minutos está publicado.

## Firebase (por si hay que armarlo de cero)

1. En https://console.firebase.google.com creá un proyecto (gratis, sin tarjeta).
2. **Compilación → Firestore Database:** creá la base (región cercana, ej. `southamerica-east1`).
3. **Compilación → Authentication → Sign-in method:** activá **Anónimo**.
4. **Configuración del proyecto → Tus apps → `</>` (Web):** registrá una app
   y copiá el `firebaseConfig` en `firebase-config.js`.
5. **Firestore Database → Reglas:** pegá el contenido de `firestore.rules` y publicá.

Las reglas dejan leer y escribir a cualquiera que abra el link. No es un login
de verdad, pero alcanza para un grupo de amigos.

## Notas

- El plan gratis de Firebase (Spark) alcanza de sobra para esto.
- Para arrancar una salida nueva desde cero, borrá los documentos de las
  colecciones `expenses` (gastos) y, si querés, `config` desde
  Firebase Console → Firestore Database. **Ojo: no se puede deshacer.**
- El proyecto de Firebase se sigue llamando `despedida-de-soltero-kiki`.
  Es un nombre interno, nadie lo ve.
