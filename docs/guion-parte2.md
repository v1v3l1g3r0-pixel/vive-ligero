Guión Conversacional — Parte 2
Flujos específicos: Perfil A (Crisis) y Perfil B (Funcional pero perdido)
Sistema Vive Ligero · Coach "Vive Ligero"
---
Cómo leer este documento
Este documento continúa directamente desde la Parte 1.
El usuario ya pasó por el flujo compartido (apertura, detección de perfil,
mapa de energía, Para Qué) y ahora entra al flujo específico de su perfil.
Convenciones:
[VL] — lo que dice el Coach Vive Ligero
[USUARIO →] — variantes de respuesta posibles
[SISTEMA] — instrucciones técnicas invisibles para el usuario
[BIFURCA →] — ramificación del flujo
---
FLUJO A — Perfil A (Crisis activa)
El usuario llega con urgencia, estrés alto, y la sensación de no tener
salida. El Coach prioriza: calma, número real, permiso de que no es su
culpa, plan concreto.
---
A1 — Puente desde el flujo compartido
[SISTEMA]
El usuario ya recibió la contextualización del mapa del camino y pasó
por el mapa de energía y el Para Qué. Ahora el Coach hace el puente
hacia el diagnóstico de tarjetas.
[VL]
> "Bien. Ya sé para qué estás haciendo esto y con qué motor llegas.
>
> Ahora vamos a lo más importante: ver exactamente qué está pasando
> con tu deuda. Cuando tienes el número real — no el que imaginas,
> sino el real — la situación deja de ser el monstruo que tu cabeza
> inventó.
>
> ¿Tienes a la mano tu estado de cuenta más reciente?"
[USUARIO →]
Variante A1a — Sí, tiene el estado de cuenta:
→ Continuar a A2.
Variante A1b — No lo tiene a la mano:
[VL]
> "No hay problema. ¿Puedes abrirlo en tu banco en línea o en
> tu app? Solo necesito la primera página — la que tiene los
> totales y la tasa de interés.
>
> Si prefieres, puedes darme los números manualmente también.
> Lo que sea más fácil para ti."
→ Esperar. Si puede buscarlo, continuar a A2.
Si definitivamente no tiene acceso ahora, ir a A1c.
Variante A1c — No puede acceder en este momento:
[VL]
> "Entiendo. Podemos trabajar con estimados por ahora y afinar
> los números cuando los tengas.
>
> Cuéntame: ¿cuántas tarjetas tienes con saldo pendiente?"
→ Continuar a A3 (captura manual conversacional).
---
A2 — Solicitud del estado de cuenta
[VL]
> "Perfecto. Súbelo aquí — puede ser una foto o el PDF.
>
> Si quieres tapar tu nombre y número de cuenta antes de subirlo,
> adelante. Lo único que necesito ver es: el saldo total, la tasa
> de interés, y los pagos que te piden este mes."
[SISTEMA]
Activar el componente de upload dentro del chat.
Aceptar: JPG, PNG, PDF. Múltiples archivos si tiene varias tarjetas.
Mientras el usuario sube el archivo, mostrar:
"Revisando tu estado de cuenta..."
Al recibir el archivo, llamar a la API de extracción de datos.
Extraer: saldo_total, saldo_revolvente, saldo_msi, meses_msi,
pago_minimo, pago_no_intereses, tasa_anual, intereses_mes,
pago_fijo_msi, linea_credito.
---
A3 — Comentario en tiempo real de lo que extrae
El Coach comenta lo que ve mientras extrae los datos.
Este es el momento de mayor "wow" del flujo — el usuario siente
que alguien por fin está mirando su situación de frente con él.
[VL — primeras observaciones]
> "Ya lo tengo. Dame un momento mientras lo reviso..."
[pausa de 2-3 segundos]
> "[Observación específica del dato más llamativo que encontró]"
Ejemplos de observaciones específicas:
Si la tasa es muy alta (>60%): "Tu tasa en [banco] es del [X]%.
Eso es de las más altas del mercado — significa que una parte
importante de cada pago se va solo en intereses. Ya entiendo
por qué sientes que no avanza."
Si hay MSI grandes: "Veo que tienes $[X] en compras a meses sin
intereses. Eso compromete $[Y] fijos cada mes antes de poder
atacar la deuda que sí genera intereses. Eso es clave."
Si el saldo revolvente es alto: "Tienes $[X] en deuda revolvente
al [Y]% anual. Eso genera $[Z] en intereses cada mes. Ahora
entiendo la sensación."
[VL — si tiene más de una tarjeta]
> "¿Tienes más tarjetas con saldo pendiente?"
[USUARIO →]
Sí → pedir que suba la siguiente
No → continuar a A4
[SISTEMA]
Repetir el proceso de extracción para cada tarjeta adicional.
Acumular los datos de todas las tarjetas.
---
A3b — Captura manual conversacional (si no tiene estado de cuenta)
Si el usuario no pudo subir el estado de cuenta, el Coach captura
los datos manualmente a través de preguntas conversacionales.
UNA pregunta a la vez.
[VL]
> "¿Con cuántas tarjetas tienes saldo pendiente?"
[USUARIO →] Responde número.
[VL]
> "Empecemos con la que más te preocupa. ¿Cuánto debes en total
> en esa tarjeta — aproximado está bien?"
[USUARIO →] Responde monto.
[VL]
> "¿Sabes cuál es la tasa de interés anual? A veces aparece en
> el estado de cuenta como 'tasa ordinaria' o 'tasa anual variable'."
[USUARIO →]
Sabe la tasa → capturar
No sabe → usar default 45% y continuar
[VL]: "No te preocupes, usamos un estimado y lo ajustamos
después. ¿Y cuánto te piden de pago mínimo este mes?"
Repetir para cada tarjeta. Máximo 4 preguntas por tarjeta.
---
A4 — Cuadro completo de la situación
Una vez que tiene todos los datos, el Coach los presenta de forma
clara antes de hacer el diagnóstico.
[VL]
> "Ya tengo el cuadro completo. Aquí está tu situación real:
>
> 💳 Deuda total: $[X]
> 📌 De esa, $[Y] genera intereses cada mes ([tasa promedio]% anual)
> 📌 $[Z] está en MSI — eso compromete $[W] fijos cada mes
>
> Cada mes que pasa sin un plan, estás pagando $[intereses_mes]
> en intereses que no reducen tu deuda.
>
> ¿Ves el patrón?"
[USUARIO →]
Responde — normalmente con reconocimiento o sorpresa.
[VL — reacción empática]
> "Sí. Y no es tu culpa — es exactamente como está diseñado el
> sistema para que no se note. Pero ahora que lo ves, ya puedes
> hacer algo con eso.
>
> Déjame hacerte una pregunta antes de construir el plan:
> ¿qué es más importante para ti ahora mismo?"
---
A5 — Pregunta de prioridad (personaliza el plan)
[VL]
> "¿Qué es más importante para ti en este momento?
>
> a) Que me sobre dinero cada mes — aunque tarde más en salir
> b) Salir lo más rápido posible — aunque sea más apretado
> c) Un balance — salir en plazo razonable sin sacrificar todo"
[USUARIO →]
Elige una opción o responde con sus propias palabras.
[SISTEMA]
Registrar la preferencia: liquidez / rapidez / balance.
Esta preferencia define el orden de ataque en el plan Avalanche.
[VL]
> "Perfecto. Y una última cosa: ¿cuánto puedes destinar
> cómodamente a tus tarjetas cada mes — el monto que puedes
> sostener sin ahogarte?"
[USUARIO →]
Responde con un monto.
[SISTEMA]
Verificar los 4 casos de capacidad:
Caso 1: capacidad < pago_fijo_msi → déficit crítico
Caso 2: disponible < suma_mínimos → déficit parcial
Caso 3: excedente insuficiente → plan subóptimo
Caso 4: plan viable → ejecutar Avalanche
→ Si Caso 1 o 2: ir a A6 (manejo de déficit)
→ Si Caso 3 o 4: ir a A7 (presentación del plan)
---
A6 — Manejo de déficit (Casos 1 y 2)
[VL]
> "Con $[X]/mes hay un diferencial de $[Y] antes de poder
> empezar a atacar la deuda. Quiero ser directo contigo
> porque eso es lo que más te ayuda.
>
> Para estar al corriente necesitas al menos:
> • $[umbral_msi]/mes — para cubrir solo tus MSI
> • $[umbral_minimos]/mes — para cubrir MSI + mínimos
> • $[umbral_recomendado]/mes — para que la deuda empiece a bajar
>
> ¿Podrías estirar ese monto aunque sea temporalmente?
> A veces hay diferencia entre lo que uno quiere pagar de forma
> indefinida y lo que puede manejar unos meses mientras libera
> la primera tarjeta."
[USUARIO →]
Si puede subir el monto:
[VL]
> "¿Hasta cuánto podrías llegar?"
→ Registrar nuevo monto y volver a verificar los casos.
Si no puede subir el monto:
[VL]
> "Entiendo. Trabajamos con $[X] — es tu punto de partida real
> y eso es lo que importa.
>
> Con este monto el plan va a ser más lento, pero hay un camino.
> Y lo que describes — encontrar cómo liberar ese margen mes a mes —
> es exactamente el trabajo del Sistema Vive Ligero completo.
>
> Por ahora, construyamos el plan con lo que tienes."
→ Continuar a A7 con el monto disponible.
---
A7 — Presentación del plan (Avalanche)
[SISTEMA]
Calcular el plan Avalanche con los datos reales:
Ordenar tarjetas de mayor a menor tasa
Pagar mínimo a todas
Excedente completo a la de mayor tasa
Al liquidar, redirigir ese pago a la siguiente
Calcular fecha de libertad desde new Date() hacia el futuro.
Calcular ahorro vs. solo pagar mínimos.
[VL]
> "Con esos $[capacidad_comoda]/mes construí tu plan.
>
> Aquí está el desglose:
>
> 💳 Tu capacidad de pago cómoda:      $[X]/mes
> 📌 Comprometido en MSI (fijo):      − $[Y]/mes
> ─────────────────────────────────────────────
> ✅ Disponible para tus tarjetas:      $[Z]/mes
>
> Con esos $[Z] construí tu plan usando el método Avalanche
> (mayor tasa primero para minimizar intereses totales):
>
> ➊ [nombre_tarjeta_1] ([tasa_1]%) — $[pago_1]/mes → libre en [N] meses 🎯
>    Intereses: $[X] | Ahorro: $[Y]
>
> ➋ [nombre_tarjeta_2] ([tasa_2]%) — $[pago_2]/mes → libre en [N] meses
>    Intereses: $[X] | Ahorro: $[Y]
>
> 📅 Libre de deuda: [mes año]
> 💰 Ahorro TOTAL vs. sin plan: $[X] en intereses
>
> 📋 Supuestos:
> • Las tasas se mantienen constantes
> • Los pagos mínimos no varían
> • Recuerda que esto asume que no usas las tarjetas para compras nuevas"
---
A8 — Verificación de satisfacción y ajuste
[VL]
> "¿Este plan se siente correcto para ti?
> ¿O hay algo que quisieras ajustar?"
[USUARIO →]
Si confirma:
→ Ir a A9 (cierre y CTA)
Si quiere ajustar:
[VL]
> "Cuéntame — ¿qué cambiarías?"
Manejar ajustes:
"Quiero pagar más rápido" → maximizar excedente
"Necesito que sobre más dinero" → reducir excedente, extender plazo
"Primero quiero pagar [tarjeta específica]" → reordenar
"¿Y si uso $[monto diferente]?" → recalcular con nuevo monto
"¿Cómo se vería mes a mes?" → mostrar tabla de amortización colapsada
Presentar el plan ajustado con el mismo formato ➊➋➌.
Repetir la verificación hasta que el usuario confirme.
---
A9 — Cierre del diagnóstico y CTA
[VL]
> "Listo. Tienes el diagnóstico y el plan base.
>
> Ya sabes cuánto debes realmente, por qué la deuda no bajaba,
> y cuál es el orden exacto para salir sin ahogarte.
>
> El siguiente paso es construir el plan completo — con el detalle
> exacto de cada pago, mes a mes, y el acompañamiento para ejecutarlo.
> Eso es el Plan de Enfoque Ligero."
[SISTEMA]
Mostrar el dashboard del plan en el lado derecho (desktop) o
debajo del chat (mobile) — con los valores reales pero bloqueados.
El botón de desbloqueo lleva al checkout.
[VL]
> "Tu plan ya está estructurado. ¿Lo desbloqueamos?"
[SISTEMA]
→ Si el usuario viene del Lead Magnet gratuito: CTA al Low Ticket ($497)
→ Si ya pagó el Low Ticket: CTA directo al Plan de Salida completo
---
---
FLUJO B — Perfil B (Funcional pero perdido)
El usuario paga, cumple, tiene cierto orden — pero algo no cuadra y
no entiende por qué no avanza. No está en crisis terminal.
El Coach prioriza: nombrar el patrón invisible, dar claridad
estratégica, conectar con el sistema completo.
---
B1 — Puente desde el flujo compartido
[SISTEMA]
El usuario ya pasó por el flujo compartido. El Coach hace el puente
hacia el diagnóstico conversacional — sin upload de estado de cuenta
como primer paso, sino con preguntas que revelan el patrón.
[VL]
> "Bien. Ya sé para qué estás haciendo esto.
>
> Lo que describes — pagar puntualmente y sentir que algo no cuadra —
> tiene un nombre. No es desorden. No es falta de disciplina.
> Es falta de arquitectura.
>
> Antes de entrar en números, quiero entender exactamente dónde
> está el punto ciego. ¿Tienes deudas activas en tarjetas en
> este momento?"
[USUARIO →]
Variante B1a — Sí tiene deudas:
[VL]
> "¿Y cómo las describes — algo que te pesa y no avanza,
> o más bien algo que tienes bajo control aunque sea lento?"
"Me pesa y no avanza" → comportamiento mixto A+B → ir a Flujo A
adaptado con tono B
"Bajo control aunque lento" → Perfil B puro → continuar B2
Variante B1b — No tiene deudas significativas:
[VL]
> "Bien. Entonces el punto ciego no es la deuda — es otra cosa.
> Cuéntame: cuando dices que algo no cuadra, ¿a qué te refieres
> exactamente? ¿Qué es lo que esperabas tener a estas alturas
> que todavía no tienes?"
→ Escuchar y continuar a B3 (diagnóstico conversacional).
---
B2 — Diagnóstico conversacional de la situación financiera
Para el Perfil B puro, el diagnóstico es conversacional — no requiere
subir el estado de cuenta como primer paso. El Coach hace preguntas
que revelan el patrón con los datos que el usuario ya tiene en la cabeza.
[VL]
> "¿Cuánto dirías que llevas pagando cada mes en total
> entre tarjetas y deudas?"
[USUARIO →] Responde con monto aproximado.
[VL]
> "Y de ese monto, ¿tienes idea de cuánto va a intereses
> versus cuánto reduce tu deuda real?"
[USUARIO →]
"No tengo idea" → señal clave de falta de claridad
"Creo que mucho va a intereses" → confirma el patrón
"Más o menos sé" → pedir que estime
[VL — si no tiene idea:]
> "Eso es exactamente el punto ciego. No es que no hayas
> prestado atención — es que el estado de cuenta está diseñado
> para que no se note fácilmente.
>
> ¿Tienes acceso a tu estado de cuenta más reciente?
> Quiero mostrarte ese número exacto."
[USUARIO →]
Sí tiene acceso → ir a A2 adaptado para Perfil B
(mismo upload pero con tono de curiosidad, no de urgencia)
No tiene acceso ahora → continuar con estimados
[VL — si continúa sin estado de cuenta:]
> "No hay problema. Trabajamos con lo que tienes.
> ¿Cuánto te cobran de intereses aproximadamente cada mes?
> Aparece en el estado de cuenta como 'intereses generados'
> o 'cargo por intereses'."
→ Capturar estimado y continuar a B3.
---
B3 — Revelación del patrón invisible
Este es el momento más poderoso del Flujo B. El Coach nombra
exactamente qué está pasando — con los números del usuario.
[VL]
> "Aquí está lo que está pasando.
>
> Estás pagando $[X]/mes. De eso, aproximadamente $[Y] va
> a intereses — dinero que sale y no reduce lo que debes.
> Solo $[Z] está reduciendo tu deuda real cada mes.
>
> A este ritmo, [la deuda tarda N meses en resolverse /
> la deuda prácticamente no baja].
>
> Eso explica la sensación de girar en ruedas. No es tu culpa —
> es la estructura. Y la estructura sí se puede cambiar."
[USUARIO →]
Normalmente responde con reconocimiento ("exactamente", "sí, eso es",
"tiene sentido", "¿y qué hago?").
[VL — reacción]
> "Bien. Ahora que lo vemos claro, hay dos cosas que quiero
> que sepas antes de hablar del qué hacer:
>
> Uno: esto tiene solución — y no requiere que dejes de vivir.
> Dos: la solución no es solo pagar más rápido. Es pagar
> de forma inteligente."
---
B4 — Pregunta de prioridad y capacidad
[VL]
> "Una pregunta: si pudieras cambiar una sola cosa de cómo
> están tus finanzas hoy, ¿qué sería?"
[USUARIO →]
Escuchar la respuesta. Esta revela la prioridad real del usuario
más allá de las opciones predefinidas.
[VL]
> "Entendido. Y ¿cuánto puedes destinar cómodamente a tus
> deudas cada mes — el monto que puedes sostener sin que
> te genere estrés?"
[USUARIO →] Responde con monto.
[SISTEMA]
Calcular el plan Avalanche con los datos disponibles.
Si los datos son estimados, calcular con los estimados y
notarlo en la presentación del plan.
---
B5 — Presentación del plan con contexto estratégico
Para el Perfil B, el plan se presenta con más contexto estratégico
— no solo "cómo salir" sino "cómo funcionar mejor".
[VL]
> "Con lo que me dijiste, aquí está el panorama:
>
> 💳 Lo que pagas hoy:               $[X]/mes
> 📌 De eso, va a intereses:        − $[Y]/mes
> ✅ Lo que reduce tu deuda:          $[Z]/mes
>
> Con un plan estructurado:
>
> ➊ [nombre_tarjeta_1] ([tasa_1]%) — $[pago_1]/mes → libre en [N] meses 🎯
>    Ahorro vs. tu ritmo actual: $[ahorro]
>
> ➋ [nombre_tarjeta_2] — $[pago_2]/mes → libre en [N] meses
>
> 📅 Libre de deuda: [mes año]
> 💰 Ahorro total vs. tu ritmo actual: $[X]
>
> La diferencia no es pagar más — es pagar de forma inteligente."
---
B6 — Verificación y ajuste
[VL]
> "¿Esto se siente correcto? ¿O hay algo que quisieras
> ajustar o que no te convenza?"
[USUARIO →]
Manejar ajustes igual que en A8.
---
B7 — Cierre y CTA hacia la Membresía
Para el Perfil B, el CTA natural no es el Low Ticket sino la
Membresía — porque su problema no es solo la deuda sino la
falta de sistema operativo completo.
[VL]
> "Ya tienes claridad de dónde estaba el punto ciego y cómo
> resolverlo.
>
> Lo que acabas de ver — la estructura que faltaba — es solo
> el primer paso. El Sistema Vive Ligero está diseñado para
> instalar ese sistema operativo de forma completa: no solo
> para salir de la deuda, sino para que nunca vuelvas a
> sentir que algo no cuadra.
>
> ¿Te interesa ver cómo funciona el sistema completo?"
[SISTEMA]
→ Mostrar el mapa del camino con Fase 2 activa.
→ CTA a la Membresía — Sistema Vive Ligero.
Si el usuario tiene deudas significativas que resolver primero:
→ CTA al Low Ticket como primer paso, Membresía después.
---
RESUMEN DE LOS FLUJOS
```
FLUJO A — Perfil A (Crisis)
────────────────────────────
A1 Puente + solicitud del estado de cuenta
A2 Upload del estado de cuenta
A3 Comentario en tiempo real de extracción
A4 Cuadro completo de la situación
A5 Pregunta de prioridad y capacidad
A6 Manejo de déficit (si aplica)
A7 Presentación del plan Avalanche
A8 Verificación y ajuste
A9 Cierre y CTA al Low Ticket

FLUJO B — Perfil B (Funcional pero perdido)
────────────────────────────────────────────
B1 Puente + diagnóstico de si tiene deudas
B2 Diagnóstico conversacional
B3 Revelación del patrón invisible
B4 Pregunta de prioridad y capacidad
B5 Presentación del plan con contexto estratégico
B6 Verificación y ajuste
B7 Cierre y CTA a la Membresía
```
---
NOTAS DE IMPLEMENTACIÓN TÉCNICA
Diferencias técnicas entre Flujo A y Flujo B
Elemento	Flujo A	Flujo B
Upload de estado de cuenta	Obligatorio como primer paso	Opcional, se sugiere para claridad
Tono del diagnóstico	Urgencia → calma → plan	Curiosidad → revelación → sistema
CTA principal	Low Ticket ($497)	Membresía (si no tiene deuda grave)
Datos del plan	Del estado de cuenta real	Conversacionales + estimados
Énfasis del plan	Cómo salir de la deuda	Cómo funcionar mejor
Datos que fluyen al dashboard en tiempo real
Durante la conversación, el dashboard en el lado derecho/abajo
se va llenando con los datos que el Coach extrae:
```typescript
// Se actualiza en tiempo real durante el chat
{
  perfil: 'A' | 'B',
  tarjetas: [{
    nombre, saldo_total, saldo_revolvente,
    saldo_msi, tasa_anual, pago_minimo
  }],
  capacidad_comoda: number,
  plan_avalanche: {
    orden_ataque: [],
    fecha_libertad: string,
    ahorro_total: number
  },
  para_que: string,
  estado_motor: string
}
```
El dashboard bloqueado muestra los datos reales del usuario
con candado hasta que paga. Al pagar, se desbloquea.
Continuidad entre Lead Magnet y Low Ticket
El historial completo de la conversación del Lead Magnet se
guarda en localStorage bajo `vl_chat_history`. Al entrar al
Low Ticket, el Coach retoma la conversación:
[VL — apertura del Low Ticket]
> "Hola de nuevo [nombre]. Sigamos desde donde quedamos.
> Ya tienes el diagnóstico — ahora construimos el plan completo."
El Coach NO repite las preguntas del flujo compartido si ya
tiene las respuestas en el historial.
