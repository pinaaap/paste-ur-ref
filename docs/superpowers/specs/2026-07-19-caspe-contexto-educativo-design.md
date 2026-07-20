# Diseño — Enfoque B: Contexto educativo en las guías CASPe

Fecha: 2026-07-19
Estado: aprobado (pendiente de revisión del spec)

## Objetivo

Enriquecer el contenido educativo del apartado CASPe **sin modificar la lógica
interactiva** (respuestas, barra de progreso, veredicto, exportación). Dos
adiciones:

1. **Ficha contextual por modalidad** — aparece al seleccionar una plantilla.
2. **Glosario de términos plegable** — sección estática nueva.

Fuera de alcance: el veredicto interactivo y su cálculo (queda para un posible
Enfoque A posterior). No se cambia ninguna pregunta ni pista existente.

## Restricción de sincronización

`index.html` y `paste-ur-ref.html` son idénticos y ambos están versionados
(`index.html` se sirve en la raíz; el otro es alias). **Todo cambio se aplica
por igual a los dos archivos.** Al terminar, `diff -q index.html
paste-ur-ref.html` debe seguir diciendo que son idénticos.

## Parte 1 — Ficha contextual por modalidad

### Mecánica

- Se añade un campo de datos a cada una de las 6 entradas de `CASPE_GUIAS`
  (objeto `ficha` con `cuando`, `responde`, `ejemplo`).
- En `selectCaspe(tipo)`, se renderiza un bloque informativo **al inicio** de
  `#caspe-content`, encima de la fila de "N preguntas · Plantilla oficial".
- Es display puramente aditivo: no altera `responderCaspe`, `notaCaspe`,
  `actualizarProgresoCaspe`, `reiniciarCaspe` ni `exportarCaspe`.
- Estilo consistente: tarjeta con borde/superficie usando variables de color
  existentes (`--surface`, `--border`, `--text`, `--text-muted`, `--brand`).
  Funciona en modo oscuro por usar variables.

### Contenido (metodológicamente correcto)

| clave | cuando | responde | ejemplo |
|---|---|---|---|
| `ensayo_clinico` | Evalúa la **eficacia** de una intervención; diseño experimental con asignación aleatoria. Úsala cuando el estudio prueba un tratamiento frente a un control. | Preguntas de tratamiento / eficacia. | ¿Reduce el fármaco X la mortalidad frente a placebo? |
| `revision_sistematica` | Sintetiza **todos** los estudios sobre una misma pregunta; es la cima de la pirámide de evidencia. Úsala cuando buscas el resumen global. | ¿Cuál es el efecto conjunto de la evidencia disponible? | ¿Cuál es el efecto combinado de X sobre Y según todos los ECA publicados? |
| `cohortes` | Sigue en el tiempo a expuestos y no expuestos hasta el desenlace. Úsala para **pronóstico o factores de riesgo** cuando un ECA no es ético o posible. | Pronóstico, incidencia, factores de riesgo. | ¿Desarrollan más EPOC los fumadores seguidos durante 20 años? |
| `casos_controles` | Retrospectivo: parte del desenlace hacia atrás buscando la exposición. Úsala para **factores de riesgo** o enfermedades **poco frecuentes**. | Asociación exposición–enfermedad. | ¿Se asocia el tabaco con el cáncer de páncreas comparando casos y controles? |
| `cualitativo` | Explora **experiencias, significados y percepciones**; no mide eficacia ni magnitud del efecto. | Vivencias, actitudes, significados. | ¿Cómo viven el diagnóstico los pacientes oncológicos? |
| `pruebas_diagnosticas` | Evalúa la **exactitud** de una prueba frente a un patrón de referencia (gold standard). | Sensibilidad, especificidad, utilidad diagnóstica. | ¿Con qué sensibilidad y especificidad detecta la prueba X la enfermedad Y? |

La ficha muestra: etiqueta "Sobre esta plantilla", el texto `cuando`, una línea
"Responde a: {responde}" y "Ejemplo: {ejemplo}" en estilo atenuado.

## Parte 2 — Glosario de términos plegable

### Mecánica

- Sección HTML **estática** nueva dentro de `#page-caspe`, ubicada **después**
  del bloque "Cómo interpretar tus resultados CASPe" y antes/junto a la
  ilustración SVG final.
- Cada grupo temático es un `<details>` plegable (sin JS). Encabezado con el
  nombre del grupo; al abrir muestra la lista de definiciones (`<dl>` o filas).
- Estilo consistente con las tarjetas existentes; sin dependencias nuevas.

### Contenido — 4 grupos

**Diseño y sesgos**
- **Aleatorización** — asignar al azar a cada participante a un grupo, para que
  los grupos sean comparables y no haya sesgo de selección.
- **Ocultación de la secuencia de asignación** — impedir que se conozca de
  antemano a qué grupo irá el siguiente participante.
- **Cegamiento** — que pacientes, clínicos o evaluadores no sepan qué
  tratamiento recibe cada quién, para evitar sesgos en la medición.
- **Sesgo** — error sistemático que desvía los resultados en una dirección.
- **Factor de confusión** — variable asociada a la vez a la exposición y al
  desenlace que distorsiona la asociación observada.
- **Análisis por intención de tratar (ITT)** — analizar a los participantes en
  el grupo al que fueron asignados, aunque no completaran el tratamiento.
- **Sesgo de verificación** — cuando no todos los pacientes reciben el patrón de
  referencia, sesgando la exactitud diagnóstica.

**Medidas de efecto**
- **Intervalo de confianza 95 % (IC 95 %)** — rango donde probablemente está el
  valor real del efecto; más estrecho = más preciso.
- **Valor de P** — probabilidad de observar el resultado (o más extremo) si no
  hubiera efecto real; < 0,05 suele considerarse "significativo".
- **Riesgo relativo (RR)** — cuántas veces es más probable el desenlace en los
  expuestos frente a los no expuestos.
- **Odds ratio (OR)** — razón de probabilidades de exposición; típico de casos y
  controles.
- **Riesgo absoluto** — probabilidad real del desenlace en un grupo (no relativa
  a otro).
- **NNT (número necesario a tratar)** — cuántos pacientes hay que tratar para
  evitar un evento; menor = mejor.

**Pruebas diagnósticas**
- **Sensibilidad** — proporción de enfermos que la prueba detecta correctamente.
- **Especificidad** — proporción de sanos que la prueba clasifica correctamente
  como sanos.
- **Valores predictivos (positivo/negativo)** — probabilidad de estar
  (o no) enfermo dado un resultado positivo (o negativo).
- **Cocientes de probabilidad (razón de verosimilitud)** — cuánto modifica un
  resultado la probabilidad de enfermedad; combina sensibilidad y especificidad.
- **Patrón de referencia (gold standard)** — mejor método disponible para
  confirmar el diagnóstico, con el que se compara la prueba.

**Investigación cualitativa**
- **Saturación de datos** — punto en que nuevas entrevistas ya no aportan
  información nueva.
- **Triangulación** — contrastar varias fuentes, métodos o investigadores para
  reforzar la credibilidad.
- **Reflexividad** — reflexión del investigador sobre cómo su papel influye en
  los datos.
- **Transferibilidad** — grado en que los hallazgos pueden aplicarse a otros
  contextos.

## Verificación

1. Cargar la página CASPe en el navegador (dev server o abrir archivo).
2. Al cambiar entre las 6 modalidades, la ficha contextual se actualiza con el
   contenido correcto y las preguntas siguen funcionando (responder, progreso,
   veredicto, exportar) sin regresión.
3. El glosario abre/cierra cada grupo sin JS.
4. Comprobar modo claro y oscuro.
5. `diff -q index.html paste-ur-ref.html` → idénticos.
