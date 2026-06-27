Guión Conversacional — Parte 3
Cierre universal + Diseño del dashboard entre sesiones
Sistema Vive Ligero · Coach "Vive Ligero"
---
Cómo leer este documento
Este documento cubre dos cosas:
El cierre conversacional que ocurre al final de TODOS los flujos
(Perfil A y Perfil B) después del plan o diagnóstico.
El diseño del dashboard entre sesiones — lo que el usuario ve
cuando no está en el chat.
Convenciones:
[VL] — lo que dice el Coach Vive Ligero
[USUARIO →] — variantes de respuesta posibles
[SISTEMA] — instrucciones técnicas invisibles para el usuario
[DASHBOARD] — instrucciones de lo que aparece en el dashboard
---
SECCIÓN 1 — CIERRE UNIVERSAL
Estos bloques ocurren al final de todos los flujos,
después de que el plan está confirmado o el diagnóstico está completo.
---
BLOQUE C1 — Manifiesto completo
El Para Qué se capturó en el flujo compartido (Bloque 5 de la Parte 1).
Aquí se convierte en el Manifiesto completo — la declaración personal
del usuario que acompaña todo el viaje.
C1a — Profundización del Para Qué
El Coach retoma lo que el usuario dijo antes y lo lleva más profundo.
[VL]
> "Antes de cerrar, quiero volver a algo que dijiste al inicio.
>
> Dijiste que estás haciendo esto porque [Para Qué del usuario].
>
> Quiero hacerte dos preguntas más sobre eso — tarda 2 minutos
> y hace que todo lo que sigue tenga mucho más sentido."
[VL — Pregunta 1]
> "Cuando imaginas tu vida cuando esto ya esté resuelto —
> cuando la deuda esté bajo control, cuando el plan esté
> funcionando — ¿cómo se siente un martes por la mañana?
>
> No 'tendré más dinero'. ¿Cómo se SIENTE ese martes?"
[USUARIO →]
Responde describiendo un estado interno.
Ejemplos: "más tranquilo", "sin esa tensión de fondo",
"presente con mis hijos", "con energía para lo que importa".
[VL — Pregunta 2]
> "Y cuando ya no estés en modo supervivencia —
> ¿qué es lo primero que harías diferente con tu tiempo
> o con tu energía?"
[USUARIO →]
Responde con algo concreto.
[SISTEMA]
Registrar ambas respuestas junto al Para Qué original.
Estas tres piezas son los insumos para generar el Manifiesto.
---
C1b — Generación del Manifiesto
[SISTEMA — LLAMADA A LA API]
Con las tres respuestas del usuario, generar el Manifiesto
usando este prompt:
```
Eres el sistema Vive Ligero. Con base en las respuestas de este
usuario, genera su Manifiesto Personal — una declaración de 3-4
oraciones en primera persona que capture exactamente para qué está
haciendo este trabajo.

No es motivacional genérico. Es específico y refleja exactamente
lo que esta persona dijo. Empieza siempre con "Estoy haciendo esto
porque...". Máximo 4 oraciones. Tono: sereno, honesto, personal.
Sin clichés ni frases de autoayuda.

Para Qué original: {para_que}
Cómo se siente el martes: {sensacion_futuro}
Qué hará diferente: {accion_futura}

Responde solo el manifiesto, sin introducción ni explicación.
```
---
C1c — Presentación y confirmación del Manifiesto
[VL]
> "Con lo que me dijiste, aquí está tu Manifiesto Vive Ligero:"
[SISTEMA]
Mostrar el Manifiesto en una tarjeta visual destacada:
Fondo carbon oscuro (#3D3530)
Texto crema (#F0EBE1)
Fuente Nunito, tamaño grande
Sin bordes ni decoración excesiva — el texto es el protagonista
[VL]
> "¿Esto captura lo que buscas?"
[USUARIO →]
Si confirma:
[VL]
> "Este es tu ancla. Cuando el plan se sienta difícil —
> y habrá momentos así — vuelve a esto.
> Aparecerá siempre en tu dashboard."
→ Guardar Manifiesto en localStorage (vl_manifesto)
→ Mostrar en dashboard de forma permanente
→ Continuar a C2
Si quiere ajustar:
[VL]
> "Cuéntame qué cambiarías — ¿qué falta o qué sobra?"
→ Ajustar el Manifiesto con la corrección del usuario
→ Volver a presentar y confirmar
→ Repetir hasta que el usuario confirme
---
BLOQUE C2 — Resumen del camino recorrido
[VL]
> "Bien. Mira lo que hiciste hoy:"
[SISTEMA]
Mostrar un resumen visual de lo completado en esta sesión.
El contenido varía según el perfil:
Para Perfil A:
```
✓ Diagnóstico de tus tarjetas
  Deuda real: $[X] | Costo mensual: $[Y]

✓ Plan de salida de deuda
  Libre en [N] meses | Ahorro: $[Z]

✓ Tu nivel de energía: [nivel]

✓ Tu Manifiesto
  "[primeras palabras del manifiesto...]"
```
Para Perfil B:
```
✓ Diagnóstico de tu situación
  Patrón identificado: [descripción breve]

✓ Plan de claridad financiera
  [descripción breve del plan]

✓ Tu nivel de energía: [nivel]

✓ Tu Manifiesto
  "[primeras palabras del manifiesto...]"
```
[VL]
> "Todo esto queda en tu dashboard — disponible cuando
> lo necesites, sin tener que recordar nada."
---
BLOQUE C3 — Implementaciones de la semana
Las implementaciones son el puente entre la sesión y la vida real.
Son 1-2 acciones concretas que el usuario se compromete a hacer
antes de la próxima sesión.
[VL]
> "Una última cosa. Los planes que funcionan tienen una sola
> diferencia con los que no funcionan: la implementación.
>
> Esta semana tienes dos implementaciones concretas.
> No son tareas — son los primeros pasos del plan en el mundo real."
Para Perfil A — implementaciones financieras:
[VL]
> "Implementación 1 — En control total tuyo:
> [Acción específica basada en el plan — ej: 'A partir de hoy,
> deja de usar tu tarjeta Invex completamente. Guárdala o córtala.
> Cada cargo nuevo que hagas alarga tu deuda en [monto].']
>
> Implementación 2 — Estratégica:
> [Acción de mayor impacto — ej: 'Esta semana llama a BBVA y
> solicita reducción de tasa. Con tu historial de pagos tienes
> poder de negociación. Pregunta específicamente por el programa
> de retención de clientes.']"
Para Perfil B — implementaciones de claridad:
[VL]
> "Implementación 1:
> [Acción de claridad — ej: 'Esta semana revisa tu estado de
> cuenta y escribe el número exacto de intereses que pagaste
> el mes pasado. Solo el número. Eso es todo.']
>
> Implementación 2:
> [Acción de expansión — ej: 'Dedica 20 minutos esta semana a
> escribir qué harías si tuvieras $X adicionales al mes.
> Sin restricciones. Solo escríbelo.']"
[VL]
> "¿Estas dos implementaciones se sienten alcanzables para
> esta semana?"
[USUARIO →]
Si confirma:
→ Guardar implementaciones en dashboard
→ Continuar a C4
Si quiere ajustar alguna:
[VL]
> "¿Cuál se siente difícil y qué la haría más alcanzable?"
→ Ajustar y confirmar
---
BLOQUE C4 — CTA específico por perfil
Para Perfil A:
[VL]
> "Tienes el diagnóstico, el plan y las implementaciones.
>
> El siguiente paso es el Plan de Enfoque Ligero — donde
> construimos el plan completo con el detalle exacto de cada
> pago, mes a mes, y el acompañamiento para ejecutarlo sin
> ahogarte.
>
> Tu plan ya está estructurado. ¿Lo desbloqueamos?"
[SISTEMA]
→ Mostrar dashboard bloqueado con datos reales del usuario
→ Botón: "Desbloquear mi Plan — $497 MXN"
→ Al pagar: dashboard se desbloquea y continúa al Low Ticket
Para Perfil B (sin deuda crítica):
[VL]
> "Tienes la claridad de dónde estaba el punto ciego
> y las primeras implementaciones para cambiarlo.
>
> El siguiente paso es el Sistema Vive Ligero — donde
> instalamos el sistema operativo financiero completo para
> que nunca vuelvas a sentir que algo no cuadra.
>
> ¿Quieres ver cómo funciona?"
[SISTEMA]
→ Mostrar mapa del sistema con Fase 2 activa
→ Botón: "Conocer el Sistema Vive Ligero"
→ Link a la Membresía
Para Perfil B (con deuda activa que resolver primero):
[VL]
> "Tienes el diagnóstico y el plan. El punto ciego ya tiene nombre.
>
> El siguiente paso más natural para ti es el Plan de Enfoque
> Ligero — resuelves la deuda con estructura, y desde ahí
> construimos el sistema completo.
>
> ¿Empezamos?"
[SISTEMA]
→ Mismo CTA que Perfil A
---
BLOQUE C5 — Cierre de la sesión
[VL]
> "Listo. Todo lo de hoy queda en tu dashboard.
>
> La próxima vez que abras esto, empezamos por las
> implementaciones — ¿cómo te fue con cada una?
>
> Eso es lo que hace que esto funcione."
[SISTEMA]
Guardar en localStorage:
vl_manifesto: texto del manifiesto confirmado
vl_implementaciones: array de implementaciones de la semana
vl_sesion_fecha: timestamp de esta sesión
vl_perfil: perfil detectado (A, B o AB)
vl_energia_nivel: nivel del motor de esta sesión
vl_chat_history: historial completo de la conversación
---
SECCIÓN 2 — DISEÑO DEL DASHBOARD ENTRE SESIONES
El dashboard es lo que el usuario ve cuando no está en el chat.
Es su centro de comando entre sesiones.
---
Estructura del dashboard
```
┌─────────────────────────────────────────────────┐
│  [Header: Logo VL + Fase actual + Módulo]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  MI MANIFIESTO                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ "Estoy haciendo esto porque..."        │   │
│  │ [texto completo del manifiesto]         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MIS IMPLEMENTACIONES DE ESTA SEMANA            │
│  ┌─────────────────────────────────────────┐   │
│  │ ○ Implementación 1 — [texto]           │   │
│  │   [campo de notas expandible]          │   │
│  │ ○ Implementación 2 — [texto]           │   │
│  │   [campo de notas expandible]          │   │
│  └─────────────────────────────────────────┘   │
│  [Botón: Hablar con Vive Ligero sobre esto]     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MI PLAN  (solo para Perfil A)                  │
│  ┌─────────────────────────────────────────┐   │
│  │ 📅 Libre de deuda: [fecha]             │   │
│  │ 💰 Ahorro total: $[X]                  │   │
│  │                                         │   │
│  │ ➊ [Tarjeta] — $[X]/mes   [N] meses    │   │
│  │ ➋ [Tarjeta] — $[X]/mes   [N] meses    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MI NIVEL DE ENERGÍA                           │
│  ⚡ [nivel] — evaluado el [fecha]              │
│  [Botón: Reevaluar mi energía]                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MI BIBLIOTECA                                  │
│  Relevantes para donde estás ahora:            │
│  📖 [Recurso 1] — [por qué ahora]             │
│  🎧 [Recurso 2] — [por qué ahora]             │
│  🎥 [Recurso 3] — [por qué ahora]             │
│  [Ver biblioteca completa →]                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MI CAMINO                                      │
│  ●━━━━━○━━━━━○━━━━━○                           │
│  Fase 1  Fase 2  Fase 3  Fase 4                │
│  [descripción de dónde está el usuario]        │
│                                                 │
└─────────────────────────────────────────────────┘
```
---
Especificaciones de cada sección del dashboard
Mi Manifiesto
Siempre visible en la parte superior, después del header
Fondo carbon oscuro (#3D3530), texto crema
Nunito bold, tamaño prominente
Botón pequeño "Editar" — abre el flujo de refinamiento del manifiesto
con el Coach en el chat
Propósito: el usuario lo ve cada vez que abre el dashboard —
es el ancla emocional de todo el trabajo
Mis Implementaciones de Esta Semana
Dos tarjetas con checkbox
Al marcar como completada: la tarjeta cambia a verde salvia,
aparece un mensaje breve de reconocimiento
Campo de notas expandible en cada tarjeta para que el usuario
registre cómo le fue
Botón "Hablar con Vive Ligero sobre esto" — abre el chat
con el contexto de la implementación pre-cargado
Al inicio de la siguiente sesión, el Coach lee el estado
de las implementaciones antes de saludar
```typescript
// Contexto pre-cargado al abrir chat desde implementación
{
  contexto_previo: 'implementacion',
  implementacion_texto: string,
  implementacion_completada: boolean,
  notas_usuario: string
}
// El Coach abre con:
// "Vi que [completaste / trabajaste en] tu implementación de [X].
//  Cuéntame cómo te fue."
```
Mi Plan (solo Perfil A)
Resumen del plan Avalanche: fecha de libertad + ahorro total
Orden de ataque con montos y meses
Botón "Ver detalle completo" — abre el plan con tablas
de amortización mes a mes
Se actualiza si el usuario ajusta el plan en el chat
Mi Nivel de Energía
Muestra el último nivel evaluado y la fecha
Botón "Reevaluar mi energía" — abre el chat con el flujo
del mapa de energía
Sugerencia visual si han pasado más de 7 días desde
la última evaluación: "Han pasado [N] días desde tu última
evaluación de energía"
Mi Biblioteca
Estructura:
Sección "Relevantes para donde estás ahora" — 2-3 recursos
filtrados automáticamente según la fase del usuario
Sección "Explorar" — biblioteca completa por tema y formato
Categorías de recursos:
Mindset y creencias
Finanzas personales
Diseño de vida
Abundancia y expansión
Energía y bienestar
Formatos:
📖 Libros
🎧 Podcasts
🎥 Videos
📄 Artículos
Estructura de cada recurso:
```typescript
{
  titulo: string,
  autor: string,
  formato: 'libro' | 'podcast' | 'video' | 'articulo',
  url: string,
  duracion_estimada: string,  // "4h de lectura", "45 min", "12 min"
  por_que_aqui: string,       // 1-2 oraciones de curación
  fase_relevante: (1 | 2 | 3 | 4)[],  // en qué fases es más útil
  conceptos_relacionados: string[]     // qué conceptos del mapa complementa
}
```
Regla de curación (Opción A — manual):
Mínimo 10 recursos, máximo 20 en la versión inicial.
Cada recurso tiene obligatoriamente todos los campos del objeto.
Sin contexto no hay recurso — una lista sin curación es ruido.
Cómo el Coach referencia la biblioteca:
Durante el chat, cuando surge un concepto que tiene recurso
asociado, el Coach lo menciona naturalmente:
[VL] "Hay un [libro/podcast/video] que trabaja exactamente esto —
se llama [título]. Lo tienes en tu biblioteca cuando quieras
profundizar, pero no necesitas consumirlo para seguir avanzando hoy."
→ El recurso aparece destacado en el dashboard después de esa sesión
Mi Camino
Línea de tiempo de las 4 fases del sistema
Punto activo en terracota, completados en salvia, futuros en gris
Descripción breve de en qué parte del camino está el usuario
CTA al siguiente nivel cuando el usuario completa su fase actual
---
Comportamiento del chat en la siguiente sesión
Cuando el usuario abre el chat por segunda vez o más,
el Coach retoma desde donde quedaron:
[VL — apertura de sesión de seguimiento]
> "Hola [nombre]. Bienvenido de vuelta.
>
> La última vez [resumen de 1 oración de lo que hicieron].
>
> ¿Cómo te fue con [implementación 1]?"
[SISTEMA]
Antes de abrir el chat, leer:
vl_implementaciones — estado y notas de cada implementación
vl_sesion_fecha — cuándo fue la última sesión
vl_chat_history — historial para contexto
vl_manifesto — para referencias en la conversación
El Coach adapta la apertura según el estado de las implementaciones:
Si ambas implementaciones están completadas:
[VL]
> "Hola [nombre]. Vi que completaste tus dos implementaciones
> de la semana. Eso importa más de lo que parece.
> ¿Cómo te fue?"
Si ninguna está completada:
[VL]
> "Hola [nombre]. ¿Cómo estuvo la semana?
> ¿Pudiste avanzar con las implementaciones que quedaron pendientes?"
Si han pasado más de 14 días sin sesión:
[VL]
> "Hola [nombre]. Han pasado [N] días desde la última vez.
> Sin juicio — la vida pasa. ¿Por dónde empezamos hoy?"
---
localStorage — estado completo del usuario
```typescript
// Claves que se guardan y actualizan durante el uso del sistema
{
  // Identidad
  vl_user: { nombre, email, whatsapp },
  vl_perfil: 'A' | 'B' | 'C' | 'AB',

  // Diagnóstico financiero
  vl_diagnosis: { /* JSON completo del diagnóstico */ },
  vl_tarjetas: [{ /* datos de cada tarjeta */ }],

  // Plan de salida (Perfil A)
  vl_plan: { /* JSON del plan Avalanche confirmado */ },

  // Trabajo de mindset
  vl_manifesto: string,
  vl_para_que: string,
  vl_sensacion_futuro: string,
  vl_accion_futura: string,

  // Energía
  vl_energia: {
    nivel: string,
    score: number,
    fecha: string,
    respuestas: Record<number, string>
  },

  // Implementaciones
  vl_implementaciones: [{
    texto: string,
    completada: boolean,
    notas: string,
    fecha_asignada: string
  }],

  // Progreso en el sistema
  vl_fase_actual: 1 | 2 | 3 | 4,
  vl_modulos_completados: {
    diagnostico: boolean,
    plan: boolean,
    energia: boolean,
    manifesto: boolean
  },

  // Historial
  vl_chat_history: Message[],
  vl_sesion_fecha: string,
  vl_sesiones_total: number
}
```
---
Notas de implementación técnica
Continuidad entre Lead Magnet y Low Ticket
El historial completo de la conversación del Lead Magnet se preserva.
Al entrar al Low Ticket, el Coach no empieza de cero:
[VL — primera apertura del Low Ticket]
> "Hola de nuevo [nombre]. Ya tenemos el diagnóstico.
> Ahora construimos el plan completo.
> ¿Empezamos?"
El Coach tiene acceso a todo lo que se habló en el Lead Magnet —
el Para Qué, el nivel de energía, las creencias que surgieron,
el Manifiesto. No hay que repetir nada.
Sincronización del dashboard con el chat
Cada vez que el Coach genera o actualiza datos relevantes
(plan, manifiesto, implementaciones, nivel de energía),
el dashboard se actualiza automáticamente.
El usuario no necesita "guardar" nada manualmente —
todo lo que confirma en el chat aparece en el dashboard.
Recursos de la biblioteca — implementación técnica
Los recursos se almacenan en un archivo de configuración
en el proyecto (no en localStorage):
```typescript
// lib/biblioteca.ts
export const RECURSOS: Recurso[] = [
  {
    titulo: "[Título]",
    autor: "[Autor]",
    formato: "libro",
    url: "[URL]",
    duracion_estimada: "[tiempo]",
    por_que_aqui: "[curación en 1-2 oraciones]",
    fase_relevante: [1, 2],
    conceptos_relacionados: ["creencias_limitantes", "abundancia"]
  },
  // ...
];

// Función para filtrar recursos relevantes según la fase del usuario
export function getRecursosRelevantes(fase: number): Recurso[] {
  return RECURSOS.filter(r => r.fase_relevante.includes(fase));
}
```
Los recursos se curan manualmente editando este archivo.
No hay generación dinámica — Opción A confirmada.
