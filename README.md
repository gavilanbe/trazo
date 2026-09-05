# ✏️ TRAZO

**Solo eras un garabato. Hasta que intentaron borrarte.**

[Jugar en GitHub Pages](https://gavilanbe.github.io/trazo/) · [Cartucho en el arcade](https://gavilanbe.github.io/)

Un hack & slash dibujado a mano sobre las páginas de una libreta. Creado con **OpenAI Astra**, siguiendo la colección `astra/web/trazo`; pegatina de modelo `astra`, edición 001.

La tapa amarilla se abre y Trazo despierta desarmado. Una goma le persigue; encuentra un lápiz clavado en el papel, tira dos veces y lo arranca. La escena presenta el legendario Nº 2 y espera tu primer corte con J, clic o toque antes de empezar la campaña: tres páginas, nueve oleadas y unas tijeras gigantes.

- Trazo tiene cuerpo de tinta, máscara de papel, ojos y cejas expresivos, pelo de garabato, zapatillas y una bufanda elástica. Sus poses cambian al respirar, caminar, esforzarse, atacar, asustarse y sonreír.
- Doña Miga, una goma bruta con dientes; El Enredo, un clip arácnido; Don Punta, un duelista de lápiz; y Señora Tijeras, una mantis gigante con dos fases. Cada enemigo tiene animaciones propias, anticipación del ataque y restos de su material.
- Interfaz de cómic: retrato y ficha del héroe, ticket de puntuación, capítulos manuscritos, barra de tinta, rótulos de combo, presentaciones de enemigos y mejoras ilustradas como recortes de papel. Renderizado nítido en pantallas Retina.
- Combo de tres golpes, esquiva con invulnerabilidad y ataque especial de tinta. Las líneas rojas anticipan los ataques enemigos.
- Dos elecciones de mejora entre páginas: daño, corazones o carga de tinta. Recuperación de vida, puntuación, multiplicador de combo, rango final y récord local.
- Salpicaduras, trazos de espada, estelas, sacudidas, breves pausas de impacto, números flotantes, paso de página y sonido sintetizado. Respeta movimiento reducido y ofrece control de sonido.
- Pausa al perder el foco, reinicio, teclado, ratón y controles táctiles con joystick. En teléfono se aprovecha mejor el papel en horizontal.

| Acción | Teclado / ratón |
| --- | --- |
| Mover | WASD / flechas |
| Atacar / combo | J / mantener clic izquierdo |
| Esquivar | Espacio / K |
| Garabato especial | E (tinta al 100 %) |
| Pausa | Esc / P |

## Ejecutar

El juego es estático: HTML, CSS y Canvas 2D, sin dependencias de ejecución ni servicios externos. Se puede servir directamente desde la raíz del repositorio:

```sh
python3 -m http.server 4174
```

Las fuentes Caveat y Bangers se sirven localmente y conservan sus licencias OFL en `assets/OFL.txt` y `assets/Bangers-OFL.txt`. Los dibujos y sonidos se generan con el código del juego. El récord y la preferencia de sonido se guardan únicamente en este navegador; la partida funciona también cuando el almacenamiento está bloqueado.

## Comprobaciones

```sh
npm ci
npm test
npm run build
npm run thumbnail
```

Las pruebas ejecutan el código de producción en JSDOM y un renderer Canvas nativo: descubrimiento interactivo del arma, bloqueo de entradas prematuras, primer golpe con teclado y toque, pausa durante el hallazgo, renderizado Retina, movimiento, combate, daño, invulnerabilidad, especial, ataques enemigos, las nueve oleadas, mejoras, victoria, pausa, reintento, almacenamiento bloqueado, movimiento reducido, cancelación de gestos táctiles y sintaxis CSS. No sustituyen una prueba manual en navegadores y dispositivos reales.

`npm run build` prepara `dist/`; GitHub Pages sirve los mismos archivos desde `main` y `/`. `npm run thumbnail` genera la miniatura 640 × 400 del cartucho desde el renderer original del juego.

Los navegadores compatibles con WebMCP pueden consultar el estado y abrir una nueva libreta mediante herramientas registradas condicionalmente. No son necesarias para jugar.
