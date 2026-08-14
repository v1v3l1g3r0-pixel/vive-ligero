# Visión del Dashboard — Sistema Vive Ligero
## Documento de arquitectura conceptual · Base para Sprint 3

> Este documento captura la visión del dashboard confirmada por el
> fundador. Es la referencia conceptual sobre la que se construye el
> Sprint 3. No es especificación técnica — es la intención de producto
> que toda implementación debe respetar.

---

## Qué es el dashboard

El dashboard es la **interfaz permanente del usuario a partir del Low
Ticket**. Es su hogar dentro del Sistema Vive Ligero: el lugar al que
regresa siempre, que lo guía por las 4 fases, que guarda su información
y su progreso, y desde donde implementa y monitorea su transformación.

No es una pantalla que se ve una vez. Es la columna vertebral de toda
la experiencia post-compra.

---

## Los 7 principios

### 1. Nace en el Low Ticket
La parte gratuita (Lead Magnet) NO tiene dashboard. Ahí el usuario solo
hace su diagnóstico y ve su plan resumido. El dashboard aparece cuando
el usuario entra al primer producto de pago (Fase 1 — Plan de Enfoque
Ligero).

### 2. Es persistente y siempre disponible
No es una pantalla de un solo uso. Es la interfaz a la que el usuario
regresa siempre, su hogar dentro del sistema. Está disponible en todo
momento una vez desbloqueado.

### 3. Guía a través de las fases
Es lo que lleva al usuario por el camino de las 4 fases del sistema.
Le muestra dónde está, qué sigue, y qué tiene disponible en su momento
actual del recorrido.

### 4. Guarda su información y progreso
Es donde vive el estado del usuario: su plan, su manifiesto, sus
implementaciones, su avance. Es la memoria del sistema — lo que permite
continuidad entre sesiones y entre fases.

### 5. Es la interfaz de implementación y monitoreo
El usuario no solo consume contenido en el dashboard. Ahí ejecuta sus
implementaciones, marca sus avances, y da seguimiento a su
transformación. Es una herramienta activa, no un repositorio pasivo.

### 6. Se activa progresivamente por pago
Esta es la mecánica clave. Las fases y sus recursos están bloqueados
hasta que el usuario paga cada fase:
- Un usuario que pagó la Fase 1 ve activa la Fase 1 y sus recursos.
- Las Fases 2, 3 y 4 aparecen visibles pero bloqueadas.
- Cada fase se desbloquea cuando el usuario la paga.

La visibilidad de lo bloqueado es intencional: el usuario ve el camino
completo que le espera, lo que crea aspiración y claridad de hacia
dónde va.

### 7. La biblioteca de recursos vive dentro del dashboard
La biblioteca (18 recursos, definidos en `lib/biblioteca.ts`) es parte
del dashboard. Cada recurso se activa según la fase que el usuario haya
pagado:
- Los recursos de Fase 1 se activan al pagar la Fase 1.
- Los recursos de Fase 2 permanecen bloqueados hasta pagar la Fase 2.
- Y así sucesivamente.

Esto respeta el escalonamiento por fase y por costo con el que se curó
la biblioteca: el usuario recibe los recursos correctos en el momento
correcto de su camino.

---

## Implicaciones para el diseño (Sprint 3)

- El dashboard necesita un sistema de estado de pago por fase
  (qué fases ha pagado el usuario) que controle el bloqueo/desbloqueo.
- La biblioteca NO se conecta a la UI de forma aislada — se integra
  como parte del dashboard, filtrada por fase pagada.
- El estado del usuario (plan, manifiesto, implementaciones, progreso)
  debe persistir y estar disponible en el dashboard.
- La continuidad conversacional del Coach vive dentro del dashboard.
- Las fuentes de datos ya están listas: `lib/fases.ts` (las 4 fases con
  sus dos capas) y `lib/biblioteca.ts` (los 18 recursos por fase).

---

## Lo que este documento NO define todavía

- El diseño visual concreto del dashboard (layout, componentes)
- La mecánica técnica del control de pagos y desbloqueo
- Cómo se ve cada fase desbloqueada por dentro
- El flujo de continuidad conversacional del Coach

Estos se definirán al arrancar el Sprint 3, informados por el feedback
de usuarios reales — incluyendo el usuario experimental avanzado con
quien se probarán las fases 2 en adelante.

---

*Documento de visión. Base conceptual del Sprint 3 — El Dashboard del
Sistema Vive Ligero.*
