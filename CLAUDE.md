# garage-frontend

Frontend Next.js para la aplicación **Vintage Garage Ledger** — un garaje digital donde los usuarios exponen sus coches, registran eventos de mantenimiento y comparten su historia de automovilismo.

## Stack

- **Framework:** Next.js (SSR, `WEB_COMPUTE` en Amplify Hosting)
- **Hosting:** AWS Amplify Hosting (build spec en `amplify.yml`)
- **Auth:** Amazon Cognito (`NEXT_PUBLIC_USER_POOL_*`)
- **API:** REST en API Gateway (`NEXT_PUBLIC_API_URL`)
- **Assets:** S3 con presigned URLs (`NEXT_PUBLIC_ASSETS_BUCKET`)

## Variables de entorno

Copia `.env.example` como `.env.local` y rellena los valores:

```bash
NEXT_PUBLIC_API_URL=...           # CloudFormation output: ApiUrl
NEXT_PUBLIC_USER_POOL_ID=...      # CloudFormation output: UserPoolId
NEXT_PUBLIC_USER_POOL_CLIENT_ID=... # CloudFormation output: UserPoolClientId
NEXT_PUBLIC_ASSETS_BUCKET=...     # CloudFormation output: AssetsBucketName
```

## Sistema de diseño — "Ruta Mecánica"

**Estética:** vintage automovilístico, táctil/esquemórfico refinado. Evoca talleres mecánicos clásicos, tableros analógicos y cuadernos de bitácora de carrera.

### Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#535845` | Acción principal, CTA, elementos interactivos |
| `primary-container` | `#6b705c` | Fondos de secciones primarias, nav activa |
| `secondary` | `#7e553e` | Acento terracota, iconos, highlights |
| `secondary-container` | `#fdc6a9` | Fondos de chips, badges de estado |
| `background` | `#fff8f5` | Fondo global de la app |
| `surface` | `#fff8f5` | Superficies de tarjetas y paneles |
| `surface-container` | `#ffeada` | Contenedores anidados |
| `surface-container-high` | `#fbe4d2` | Contenedores elevados |
| `surface-variant` | `#f5decd` | Fondos alternativos, filas alternas |
| `on-surface` | `#25190f` | Texto principal sobre fondos claros |
| `on-surface-variant` | `#464740` | Texto secundario, labels, placeholders |
| `outline` | `#77786f` | Bordes de inputs, divisores |
| `outline-variant` | `#c7c7bd` | Bordes sutiles, separadores |
| `error` | `#ba1a1a` | Errores, validaciones fallidas |
| `error-container` | `#ffdad6` | Fondo de mensajes de error |

> **Referencia completa con todos los tokens** (surface-dim, inverse-*, fixed-*, etc.): [`docs/designs/DESIGN.md`](docs/designs/DESIGN.md)

### Tipografía

| Rol | Fuente | Tamaño | Peso | Uso |
|---|---|---|---|---|
| `display-lg` | **Noto Serif** | 48px | 700 | Hero titles, nombre del garaje |
| `headline-md` | **Noto Serif** | 32px | 600 | Títulos de sección, nombre del coche |
| `title-sm` | **Noto Serif** | 20px | 600 | Subtítulos, encabezados de tarjeta |
| `body-md` | **Work Sans** | 16px | 400 | Texto de cuerpo, descripciones |
| `body-sm` | **Work Sans** | 14px | 400 | Texto secundario, metadatos |
| `label-caps` | **Space Grotesk** | 12px | 700 | Labels de inputs, badges, etiquetas (UPPERCASE + letter-spacing 0.1em) |

### Espaciado (base 4px)

| Token | Valor | Uso habitual |
|---|---|---|
| `xs` | 4px | Gap interno mínimo |
| `sm` | 8px | Padding de chips/badges |
| `md` | 16px | Padding de tarjetas |
| `lg` | 24px | Gap entre secciones menores |
| `xl` | 40px | Gap entre secciones mayores |
| `container-max` | 1200px | Ancho máximo del layout |
| `gutter` | 20px | Margen lateral en móvil |

### Bordes y formas

- **Radio por defecto:** `0.25rem` (4px) — esquinas casi rectas, estética industrial
- **Radio grande:** `0.5rem` (8px) para modales/drawers
- **Sin border-radius generoso**: evitar look moderno/bubble
- **Sombras:** cortas, baja opacidad (15-20%), tinte `#6b705c` (no negro puro)
- **Texturas:** grain/noise sutil en contenedores principales para romper la perfección digital

### Guía de componentes

- **Botones:** aspecto de insignia metálica, borde inferior 2px más grueso, hover oscurece, active elimina sombra (simula pulsación mecánica)
- **Inputs:** fondo ligeramente más claro que la superficie, inset shadow (hendidura en tablero), label en Space Grotesk uppercase
- **Cards:** borde `dashed` o doble línea en la parte superior (cupón/registro de mantenimiento)
- **Chips/Badges:** bordes rectos, tipografía monospaciada, aspecto de placa de chasis
- **Iconos:** encerrados en círculo o hexágono (diales y medidores de presión)
- **Progress bars:** diseño de velocímetro o indicador de combustible analógico
- **Divisores:** línea fina con detalle circular/rombo en el centro (remache metálico)

## Diseños de referencia

Todos los mockups están en `docs/designs/`. Para cada pantalla hay un HTML interactivo (`code.html`) y una captura (`screen.png`).

| Pantalla | Móvil | Escritorio |
|---|---|---|
| Mi Garaje | [`mi_garaje/`](docs/designs/mi_garaje/) | [`mi_garaje_desktop/`](docs/designs/mi_garaje_desktop/) |
| Explorar Garajes | [`explorar_garajes/`](docs/designs/explorar_garajes/) | [`explorar_garajes_desktop/`](docs/designs/explorar_garajes_desktop/) |
| Perfil del Coche | [`perfil_del_coche/`](docs/designs/perfil_del_coche/) | [`perfil_del_coche_desktop/`](docs/designs/perfil_del_coche_desktop/) |
| Historial de Eventos | [`historial_de_eventos/`](docs/designs/historial_de_eventos/) | [`historial_de_eventos_desktop/`](docs/designs/historial_de_eventos_desktop/) |

## Páginas de la app

| Ruta | Descripción |
|---|---|
| `/` | Home — últimos coches públicos y más gustados |
| `/garage` | Mi Garaje — gestión de coches propios y privacidad |
| `/explore` | Explorar Garajes — garajes y coches públicos |
| `/cars/[id]` | Perfil del Coche — datos, resumen económico |
| `/cars/[id]/events` | Historial de Eventos — timeline de revisiones, gasolina, lavados |
| `/cars/[id]/events/new` | Crear Evento — formulario con imágenes, km, importe |

## Build

```bash
npm ci          # install
npm run dev     # desarrollo local
npm run build   # build de producción (.next/)
```

El pipeline de Amplify usa el `amplify.yml` de la raíz.
