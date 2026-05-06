---
name: Ruta Mecánica
colors:
  surface: '#fff8f5'
  surface-dim: '#ecd6c4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e8'
  surface-container: '#ffeada'
  surface-container-high: '#fbe4d2'
  surface-container-highest: '#f5decd'
  on-surface: '#25190f'
  on-surface-variant: '#464740'
  inverse-surface: '#3b2e22'
  inverse-on-surface: '#ffeee1'
  outline: '#77786f'
  outline-variant: '#c7c7bd'
  surface-tint: '#5c614d'
  primary: '#535845'
  on-primary: '#ffffff'
  primary-container: '#6b705c'
  on-primary-container: '#eff4db'
  inverse-primary: '#c4c9b1'
  secondary: '#7e553e'
  on-secondary: '#ffffff'
  secondary-container: '#fdc6a9'
  on-secondary-container: '#795039'
  tertiary: '#565743'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f6f5a'
  on-tertiary-container: '#f4f3d8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e5cc'
  primary-fixed-dim: '#c4c9b1'
  on-primary-fixed: '#191d0e'
  on-primary-fixed-variant: '#444937'
  secondary-fixed: '#ffdbc9'
  secondary-fixed-dim: '#f1bb9e'
  on-secondary-fixed: '#301403'
  on-secondary-fixed-variant: '#633e28'
  tertiary-fixed: '#e5e4ca'
  tertiary-fixed-dim: '#c8c8af'
  on-tertiary-fixed: '#1c1d0c'
  on-tertiary-fixed-variant: '#474835'
  background: '#fff8f5'
  on-background: '#25190f'
  surface-variant: '#f5decd'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Noto Serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1200px
  gutter: 20px
---

## Marca y Estilo
Este sistema de diseño personifica la nostalgia de la era dorada del automovilismo, evocando la robustez de los talleres mecánicos clásicos y la elegancia de los tableros analógicos. La personalidad de la marca es **atemporal, confiable y técnica**, orientada a entusiastas que valoran la artesanía y el "feeling" mecánico por encima de la frialdad digital.

El estilo visual es **Táctil / Esquemórfico refinado**, fusionando elementos de la señalética de garaje vintage con interfaces modernas. Se busca una respuesta emocional de familiaridad y solidez, utilizando capas que parecen superpuestas físicamente y una paleta de colores que sugiere materiales naturales y metales oxidados por el tiempo.

## Colores
La paleta se inspira en los tonos terrosos y metálicos de las carrocerías clásicas y el cuero envejecido. 
- **Primario (#6b705c):** Un verde oliva industrial que evoca uniformes de trabajo y maquinaria pesada.
- **Secundario (#cb997e):** Tono terracota que imita el cuero de los asientos y detalles en óxido estético.
- **Fondo (#ffe8d6):** Un color crema que actúa como papel antiguo o pintura decapada, proporcionando una base cálida y legible.
- **Acentos (#a5a58d, #b7b7a4):** Tonos metálicos neutros para superficies secundarias y bordes de componentes.

## Tipografía
La jerarquía visual utiliza una combinación de autoridad clásica y precisión técnica:
- **Títulos (Noto Serif):** Una serif literaria y autoritaria que recuerda a los manuales de usuario antiguos y emblemas de lujo.
- **Cuerpo (Work Sans):** Una sans-serif funcional y neutral que garantiza la legibilidad en descripciones técnicas y textos largos.
- **Etiquetas (Space Grotesk):** Utilizada para micro-copy, indicadores de tableros y números de serie, aportando un toque mecánico y técnico.
- **Nota:** Los títulos deben aplicarse preferiblemente en colores oscuros (#6b705c) para maximizar el contraste sobre el fondo crema.

## Diseño y Espaciado
El sistema de diseño sigue un modelo de **cuadrícula fija** para los contenedores principales, manteniendo la sensación de una página impresa o un catálogo técnico. 
- Se utiliza un ritmo basado en 4px para mantener la alineación precisa.
- Los márgenes laterales en dispositivos móviles son de 20px, mientras que en escritorio se prefiere una caja centrada con un ancho máximo de 1200px.
- El espaciado entre secciones debe ser generoso (XL) para permitir que los elementos visuales "respiren", emulando la composición de los anuncios automovilísticos de mediados de siglo.

## Elevación y Profundidad
La profundidad no se crea mediante sombras genéricas, sino a través de **capas tonales y bordes físicos**:
- **Efecto de Relieve:** Los contenedores utilizan un borde sutil de 1px con un color ligeramente más oscuro que el fondo para parecer incrustados o atornillados.
- **Sombras Analógicas:** Las sombras son cortas y con una opacidad baja (15-20%), utilizando el tono #6b705c para el tinte de la sombra en lugar de negro puro, lo que refuerza la calidez.
- **Texturas:** Se recomienda aplicar un patrón de ruido muy fino (grain) de fondo o una textura de papel sutil en los contenedores principales para romper la perfección digital.

## Formas
Las formas en este sistema de diseño evitan la redondez excesiva de las interfaces modernas, prefiriendo la **geometría industrial**:
- **Radio Base:** Se utiliza un redondeado suave (0.25rem) que recuerda a las esquinas de las placas de metal prensado o las etiquetas de aceite.
- **Contenedores:** Los marcos de las tarjetas deben tener bordes definidos.
- **Iconografía:** Los iconos deben estar encerrados en formas circulares o hexagonales, imitando diales y medidores de presión.

## Componentes

### Botones y Conmutadores
Los botones principales deben parecer **insignias metálicas** o interruptores basculantes. Se utiliza un degradado lineal muy sutil y un borde inferior más grueso (2px) para simular volumen físico. El estado "hover" debe oscurecer ligeramente el color, y el estado "active" debe eliminar la sombra inferior para simular una pulsación mecánica.

### Campos de Entrada (Inputs)
Deben tener un fondo ligeramente más claro que la superficie base (#ffe8d6) y un borde interior (inset shadow) para parecer hendiduras en el tablero. Las etiquetas de los campos usan la fuente **Space Grotesk** en mayúsculas.

### Tarjetas (Cards)
Las tarjetas actúan como piezas de información técnica. Se recomienda el uso de un borde de tipo "dashed" o una línea doble en la parte superior para separar el encabezado del contenido, emulando cupones o registros de mantenimiento.

### Chips y Badges
Diseñados para parecer **etiquetas de inventario** o placas de número de chasis. Bordes rectos con esquinas sutilmente suavizadas y tipografía monospaciada.

### Componentes Sugeridos
- **Medidores de Progreso:** Diseñados como velocímetros o indicadores de combustible analógicos.
- **Divisores:** Líneas finas con un pequeño detalle circular o un rombo en el centro, como remaches metálicos.