# ✏️ TRAZO

**Solo eras un garabato. Hasta que intentaron borrarte.**

[Jugar en GitHub Pages](https://gavilanbe.github.io/trazo/) · [Cartucho en el arcade](https://gavilanbe.github.io/)

Un hack & slash dibujado a mano sobre las páginas de una libreta. Creado con **OpenAI Astra**, siguiendo la colección `astra/web/trazo`; pegatina de modelo `astra`, edición 001.

La tapa se abre, un monigote aparece sobre el papel y la papelería decide borrarlo. Empuña un lápiz, enlaza combos y sobrevive a tres páginas, nueve oleadas y unas tijeras gigantes.

- Monigote animado con bufanda amarilla; gomas que embisten, clips que saltan y lápices que disparan. Las tijeras tienen cargas, proyectiles radiales y una segunda fase.
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

La fuente Caveat se sirve localmente y conserva su licencia OFL en `assets/OFL.txt`. Los dibujos y sonidos se generan con el código del juego. El récord y la preferencia de sonido se guardan únicamente en este navegador; la partida funciona también cuando el almacenamiento está bloqueado.

## Comprobaciones

```sh
npm ci
npm test
npm run build
npm run thumbnail
```

Las pruebas ejecutan el código de producción en JSDOM y un renderer Canvas nativo: intro, movimiento, combate, daño, invulnerabilidad, especial, ataques enemigos, las nueve oleadas, mejoras, victoria, pausa, reintento, almacenamiento bloqueado, movimiento reducido, cancelación de gestos táctiles y sintaxis CSS. No sustituyen una prueba manual en navegadores y dispositivos reales.

`npm run build` prepara `dist/`; GitHub Pages sirve los mismos archivos desde `main` y `/`. `npm run thumbnail` genera la miniatura 640 × 400 del cartucho desde el renderer original del juego.

Los navegadores compatibles con WebMCP pueden consultar el estado y abrir una nueva libreta mediante herramientas registradas condicionalmente. No son necesarias para jugar.
