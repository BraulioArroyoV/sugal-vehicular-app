# 🚗 SUGAL — Control Vehicular | Instrucciones de Instalación

## Arquitectura del sistema

```
Guardia (celular/PC)
        ↓  abre URL
GitHub Pages (index.html)
        ↓  guarda automáticamente
Google Apps Script (Code.gs)
        ↓  escribe/lee
Google Sheets (base de datos)
        ↓  exportas cuando quieras
Excel (.xlsx)
```

---

## PASO 1 — Subir la app a GitHub

1. Entra a **github.com** e inicia sesión
2. Haz clic en **"New repository"** (botón verde arriba a la derecha)
3. Configura:
   - **Repository name:** `sugal-vehicular` (o el nombre que prefieras)
   - **Visibility:** Public ← importante para GitHub Pages gratis
   - **✓ Add a README file** (márcalo)
4. Haz clic en **"Create repository"**
5. En el repositorio creado, haz clic en **"Add file" → "Upload files"**
6. Arrastra el archivo `index.html` de esta carpeta
7. Haz clic en **"Commit changes"**

### Activar GitHub Pages:
8. Ve a **Settings** (pestaña del repositorio)
9. En el menú lateral, haz clic en **"Pages"**
10. En "Branch", selecciona **`main`** y carpeta **`/ (root)`**
11. Haz clic en **"Save"**
12. Espera 2-3 minutos → tu URL será: `https://TU_USUARIO.github.io/sugal-vehicular`

---

## PASO 2 — Crear el Google Sheet

1. Ve a **sheets.google.com**
2. Crea una hoja nueva: **"+ Nueva hoja de cálculo"**
3. Nómbrala: `Registro Vehicular SUGAL`
4. Deja la hoja abierta (la necesitas para el Paso 3)

---

## PASO 3 — Configurar Google Apps Script

1. En Google Sheets, haz clic en el menú **"Extensiones" → "Apps Script"**
2. Se abre el editor. Borra TODO el contenido que hay por defecto
3. Copia y pega **todo** el contenido del archivo `Code.gs` de esta carpeta
4. Haz clic en el ícono de **guardar** (💾) o `Ctrl+S`
5. Ponle nombre al proyecto: `Control Vehicular SUGAL`

### Desplegar como Web App:
6. Haz clic en el botón azul **"Implementar"** (arriba a la derecha)
7. Selecciona **"Nueva implementación"**
8. Haz clic en el ícono de engranaje ⚙ junto a "Tipo" → selecciona **"Aplicación web"**
9. Configura:
   - **Descripción:** `v1`
   - **Ejecutar como:** `Yo (tu correo@gmail.com)`
   - **Quién tiene acceso:** `Cualquier persona`
10. Haz clic en **"Implementar"**
11. Si pide autorización → haz clic en **"Autorizar acceso"** → selecciona tu cuenta Google → haz clic en "Avanzado" → "Ir a Control Vehicular SUGAL" → "Permitir"
12. **Copia la URL que aparece** — se ve así:
    ```
    https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
    ```
    ⚠️ Guarda esta URL, la necesitas en el Paso 4.

---

## PASO 4 — Conectar la app con Google Sheets

1. Abre tu app en: `https://TU_USUARIO.github.io/sugal-vehicular`
2. Haz clic en **"Configuración"** (⚙ en la barra superior)
3. Pega la URL del Paso 3 en el campo **"URL del Web App"**
4. Haz clic en **"Guardar y Probar Conexión"**
5. Si aparece ✓ "Conexión exitosa" → ¡listo! El sistema ya guarda en Google Sheets automáticamente.

---

## Uso diario

| Acción | Quién | Cómo |
|--------|-------|------|
| Registrar entrada | Guardia | Pestaña "Registrar" → llenar datos → "Registrar Entrada" |
| Registrar salida | Guardia | Pestaña "Registrar" → ingresar patente → "Buscar y Registrar Salida" |
| Ver quién está dentro | Guardia / Supervisor | Pestaña "En Planta" |
| Ver historial | Supervisor | Pestaña "Historial" |
| Exportar a Excel | Cualquiera | Abrir Google Sheets → Archivo → Descargar → .xlsx |
| Acceder desde celular | Guardia | Abrir la URL en Chrome del celular, agregar a pantalla de inicio |

---

## ¿Qué pasa si no hay internet?

La app funciona **offline-first**: guarda los registros localmente en el navegador aunque no haya internet. Cuando recupere conexión, se sincroniza automáticamente con Google Sheets.

---

## Agregar a pantalla de inicio (celular)

**Android (Chrome):**
1. Abre la URL en Chrome
2. Toca los 3 puntos ⋮ → "Añadir a pantalla de inicio"
3. Confirmar → ahora aparece como app

**iPhone (Safari):**
1. Abre la URL en Safari
2. Toca el ícono compartir □↑ → "Añadir a pantalla de inicio"
3. Confirmar → ahora aparece como app

---

## Actualizar la app en el futuro

Si quieres una nueva versión del `index.html`:
1. Ve a tu repositorio en GitHub
2. Haz clic en `index.html`
3. Haz clic en el ícono de lápiz ✏️ (editar)
4. Reemplaza el contenido → "Commit changes"
5. GitHub Pages se actualiza solo en 1-2 minutos
