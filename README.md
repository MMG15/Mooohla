# Mooohla 🐄

App para repartir gastos entre amigos (nació para la despedida de Cristian).
El nombre mezcla *moola* (plata, en inglés) con el *mooo* de la vaca: hacemos la vaquita.
Corre como página estática (HTML/CSS/JS) + Firebase Firestore como base de datos
compartida en tiempo real. Login anónimo automático (nadie ve una pantalla de
login, pero por atrás cada visita queda identificada para la base de datos).

## 1. Crear el proyecto en Firebase (gratis)

1. Andá a https://console.firebase.google.com y creá un proyecto nuevo
   (por ejemplo `despedida-kiki`). No hace falta tarjeta de crédito para esto.
2. En el menú de la izquierda, andá a **Compilación > Firestore Database** y
   creá una base de datos. Elegí el modo que sea (después vamos a pisar las
   reglas con las de este proyecto). Elegí una región cercana (ej: `southamerica-east1`).
3. Andá a **Compilación > Authentication**, pestaña **Sign-in method**, y
   activá el proveedor **Anónimo**.
4. Andá a **Configuración del proyecto** (el engranaje) > pestaña **General**
   > sección **Tus apps** > ícono `</>` (Web) > registrá una app (el nombre
   no importa, no hace falta Firebase Hosting).
5. Te va a mostrar un objeto `firebaseConfig` con `apiKey`, `authDomain`,
   `projectId`, etc. **Copiá esos valores** y pegalos en el archivo
   `firebase-config.js` de esta carpeta, reemplazando los placeholders.

## 2. Cargar las reglas de seguridad

1. En Firebase Console, andá a **Firestore Database > Reglas**.
2. Reemplazá el contenido por el de `firestore.rules` (está en esta carpeta).
3. Publicá los cambios.

Estas reglas dejan que cualquiera que abra el link (con su sesión anónima
automática) lea y escriba los gastos y la config del evento. No es un login
"de verdad", pero alcanza para un grupo cerrado de amigos con el link.

## 3. Probar en tu compu antes de subir

Abrí `index.html` con algo como la extensión "Live Server" de VS Code, o corré
en esta carpeta:

```
npx serve .
```

y entrá a la URL que te muestre. Fijate que arriba a la izquierda diga
**"Sincronizado"** (verde) y no "Modo local" (amarillo) — si dice "Modo
local", revisá que `firebase-config.js` tenga los valores reales y que
hayas activado el login Anónimo en el paso 1.

## 4. Deployar a Vercel

Con la cuenta de Vercel ya creada:

**Opción A — sin Git, arrastrando la carpeta:**
1. Entrá a https://vercel.com/new
2. Elegí la opción de subir una carpeta directamente (drag & drop) y
   soltá esta carpeta completa (`index.html`, `firebase-config.js`, etc.).
3. Vercel te da un link tipo `despedida-kiki.vercel.app` — ese es el
   definitivo para mandarle al grupo.

**Opción B — con la CLI de Vercel:**
```
npm i -g vercel
cd despedida-kiki
vercel login
vercel --prod
```

## 5. Mandale el link al grupo

Una vez deployado, el link de Vercel ya sirve para que **todos** —logueados
o no en ningún lado— puedan cargar y ver los gastos en tiempo real. No
necesitan cuenta de Claude ni nada especial, solo abrir el link.

## 6. Instalarla como app (PWA)

La app es una PWA: se puede instalar en el celular y funciona sin internet.

- **Android (Chrome):** aparece un botón **Instalar** arriba a la derecha
  (o desde el menú ⋮ > "Instalar app").
- **iPhone (Safari):** tocá **Compartir** > **Agregar a inicio**. La app
  muestra un cartelito con esta instrucción la primera vez.

Sin señal, la app abre igual, muestra los últimos gastos que vio y deja
cargar gastos nuevos. Arriba a la derecha dice **"Sin conexión · pendiente"**
y, cuando vuelve internet, los sube solos.

Archivos de la PWA:
- `manifest.webmanifest`: nombre, colores e íconos de la app instalada.
- `sw.js`: service worker que guarda una copia de la app para abrirla offline.
  Si hacés un cambio grande y no aparece en los celulares, subí el número de
  `VERSION` en este archivo.
- `icons/`: `logo.svg` es la vaquita del encabezado; `icon.svg` es el ícono de
  la app (vaquita sobre fondo naranja) y los PNG se generan a partir de él.

Los gastos offline los maneja la caché persistente de Firestore, no el service worker.

## Notas

- Si en algún momento las reglas del paso 2 no están cargadas, la app se
  cae sola a "Modo local" (guarda solo en el celular de esa persona) para
  no romperse — pero no vas a tener sincronización real hasta que las
  cargues.
- Los datos quedan en tu proyecto de Firebase — plan gratis (Spark) alcanza
  de sobra para esto (unas decenas de gastos, 8 personas).
- Si querés borrar todo y arrancar de cero, es más fácil hacerlo desde
  Firebase Console > Firestore Database > borrando los documentos de las
  colecciones `config` y `expenses`.
