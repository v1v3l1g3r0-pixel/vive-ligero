---
name: vive-ligero-diagnostico
description: >
  Plataforma de diagnóstico inteligente de tarjetas de crédito de Vive Ligero.
  Usa este skill siempre que el usuario mencione: diagnóstico de tarjeta, Vive Ligero,
  nivel de control, MSI, deuda revolvente, focos rojos financieros, prompt maestro de
  tarjetas, cálculo de índices financieros, integración GHL + Resend, o cualquier
  tarea relacionada con construir, modificar o entender esta plataforma.
  También úsalo cuando el usuario pida agregar funcionalidades, corregir bugs,
  actualizar el prompt, modificar el flujo del quiz, o hacer cambios en el modelo
  de diagnóstico financiero.
---

# Vive Ligero — Diagnóstico Inteligente de Tarjetas

## Visión del producto

**Lead magnet financiero.** El usuario sube su estado de cuenta o llena un formulario de 3 pasos, y recibe un diagnóstico personalizado generado por IA que explica exactamente qué está pasando con su deuda — en lenguaje humano, sin tecnicismos, sin juicios.

**Objetivo de conversión:** el diagnóstico termina con un CTA para agendar asesoría con Vive Ligero.

**Stack:** Next.js 14 + TypeScript + shadcn/ui + Tailwind · Anthropic API · GoHighLevel CRM · Resend email · Vercel

---

## Infraestructura actual

| Recurso | Valor |
|---------|-------|
| Repo GitHub | `v1v3l1g3r0-pixel/vive-ligero` |
| Producción | `diagnostico.vive-ligero.com` (rama `main`) |
| Preview v2 | `vive-ligero-git-v2-mejoras-...vercel.app` (rama `v2-mejoras`) |
| Vercel project | `prj_JSC2vUasgkk9ffZ2ppwvFsYG4aeK` |
| GHL Location ID | `1xgtTnreD0serAY0d4FN` |
| Email admin | `v1v3.l1g3r0@gmail.com` |

**Variables de entorno requeridas en Vercel:**
```
ANTHROPIC_API_KEY       → Anthropic API
GHL_API_KEY             → GoHighLevel API key (pit-...)
GHL_LOCATION_ID         → 1xgtTnreD0serAY0d4FN
RESEND_API_KEY          → Resend email (re_...)
NEXT_PUBLIC_APP_URL     → URL pública del deploy
NEXT_PUBLIC_PLAN_URL    → URL de landing de asesoría (CTA final)
```

---

## Paleta de colores y tipografía

```css
--carbon:       #3D3530   /* fondo oscuro principal */
--carbon-soft:  #6B5F58   /* texto secundario */
--carbon-muted: #A09088   /* texto tenue */
--terracota:    #B5715A   /* acento principal, CTA */
--crema:        #F0EBE1   /* fondo claro */
--tiza:         #FAFAF7   /* blanco cálido */
--salvia:       #6B8F71   /* verde positivo */
--salvia-light: #D0E4D3   /* verde claro */
--pizarra:      #5B7FA6   /* azul info */

Tipografía: Nunito (títulos, 700/800) + Poppins (cuerpo, 300/400/500/600)
Logo URL: https://assets.cdn.filesafe.space/1xgtTnreD0serAY0d4FN/media/69bb1c5653d4f1fc50b3d532.png
```

---

## Estructura del proyecto (20 archivos para V0)

```
├── lib/
│   ├── types.ts              ← Todos los tipos TypeScript del modelo
│   ├── core.ts               ← Calculations + Formatters + BuildPrompt fusionados
│   └── quiz-context.tsx      ← Estado global (React Context)
├── app/
│   ├── globals.css           ← Colores de marca Vive Ligero
│   ├── layout.tsx            ← Layout raíz
│   ├── page.tsx              ← Entrada SPA
│   └── api/
│       ├── diagnose/route.ts ← Proxy a Anthropic (soporta múltiples archivos)
│       ├── ghl/route.ts      ← Crea/actualiza contacto GHL + envía email Resend
│       └── setup-ghl/route.ts← Crea los 22 campos en GHL (correr 1 sola vez)
├── components/
│   ├── app-flow.tsx          ← Navegación entre las 3 vistas
│   ├── landing-page.tsx      ← Hero + preview + cómo funciona
│   ├── loading-spinner.tsx   ← Spinner con mensajes rotativos
│   ├── quiz-step1.tsx        ← Paso 1: datos de contacto + selector de lada
│   ├── quiz-step2.tsx        ← Paso 2: upload múltiple + formulario manual
│   ├── quiz-step3.tsx        ← Paso 3: contexto con pills + slider
│   └── result-display.tsx   ← Resultado completo del diagnóstico
├── package.json
├── tsconfig.json
├── next.config.mjs
└── .env.example
```

> **Nota para V0:** los archivos de `components/ui/` (shadcn) se heredan de la plantilla base y NO están en los 20 archivos — V0 los tiene ya instalados.

---

## Flujo de la aplicación

```
Landing → Quiz Paso 1 → Quiz Paso 2 → Quiz Paso 3
                                            ↓
                              /api/diagnose (Anthropic)
                                            ↓
                              Resultado del diagnóstico
                                            ↓
                    (paralelo) /api/ghl → GHL CRM + Email Resend
```

**Estado global (`QuizData`):** viaja por React Context a través de los 3 pasos. Al completar el paso 3, se dispara automáticamente la llamada a la API.

---

## Vista 1 — Landing

**Propósito:** convencer al usuario de que haga el diagnóstico.

**Elementos:**
- Logo Vive Ligero
- Headline: *"¿Tu tarjeta de crédito te está costando más de lo que crees?"*
- CTA: *"Hacer mi diagnóstico gratuito"*
- Preview card simulada: score 42, "Drenaje de Liquidez 🟠", 3 bullets de muestra
- Sección "¿Qué incluye?": 4 items con check (score, narrativa, focos rojos, escenarios)
- Sección "¿Cómo funciona?": 3 pasos numerados

---

## Vista 2 — Quiz (3 pasos)

### Paso 1: Datos de contacto
- Nombre completo
- Email (con validación)
- WhatsApp con selector de lada (20 países: MX, US, CO, AR, ES, CL, PE, VE, EC, GT, CR, DO, UY, PY, BO, HN, SV, NI, PA, BR)

### Paso 2: Datos de la tarjeta
**Upload de archivos (prioridad sobre formulario):**
- `type="file"` con `multiple` y `accept=".pdf,image/*"`
- Drag & drop
- Cada archivo subido muestra check verde con nombre
- Se convierten a base64 para enviar a la API

**Formulario manual (todos opcionales si hay archivo):**
```
saldo_total, saldo_revolvente, saldo_msi, meses_restantes_msi
pago_minimo, pago_no_intereses, tasa_anual, cat
intereses_mes, cargos_nuevos, linea_credito
```

### Paso 3: Contexto del usuario
```
pago_real        → $ cuánto paga realmente cada mes (INCLUYE MSI)
capacidad_pago   → $ máximo cómodo sin ahogarse
tipo_pago        → pills: "Pago mínimo" | "Entre mínimo y total" | "Pago total"
usa_tarjeta      → pills: "Sí, la uso seguido" | "No, la tengo parada"
ingreso_tipo     → pills: "Fijo (salario)" | "Variable (honorarios)" | "Mixto"
prioridad_usuario→ pills: "Liquidarla rápido" | "Bajar mi cuota" | "Recuperar liquidez"
estres_financiero→ slider 0-10
```

**Al hacer submit del paso 3:** se calculan los pre-cálculos MSI en el cliente y se dispara `/api/diagnose`.

**Pantalla de carga:** spinner + mensajes rotativos cada 2s:
1. "Leyendo tu estado de cuenta..."
2. "Calculando tu nivel de control..."
3. "Identificando focos rojos..."
4. "Preparando tu diagnóstico..."

---

## Vista 3 — Resultado

### 3.1 Header (fondo carbon oscuro)
- Label: "Nivel de Control de tu Tarjeta"
- Score 0–100 en grande (Nunito 700, 72px)
- Badge con emoji y nivel:
  - 80–100: "🟢 Estructura Sana"
  - 60–79: "🟡 Fricción Financiera"
  - 40–59: "🟠 Drenaje de Liquidez"
  - 0–39: "🔴 Trampa de Deuda"
- Descripción del diagnóstico (1–2 líneas)
- Caja "Costo de no entender tu tarjeta (12 meses)" → monto estimado en grande

### 3.2 Tres indicadores (grid 3 columnas)
**IMPORTANTE: solo 3, NO 4. Toxicidad es solo interna.**

| Indicador | Niveles | Color |
|-----------|---------|-------|
| Presión de liquidez | Alta / Media-alta / Media / Baja | Alta=rojo, Baja=verde |
| Qué tanto tu pago reduce la deuda | Bien / Aceptable / Poco / Muy poco / Nada | Bien=verde, Nada=rojo |
| Riesgo de que la deuda se alargue | Alto / Medio / Bajo | Alto=rojo, Bajo=verde |

Cada tarjeta muestra: label + nivel con punto de color + explicación breve con montos reales.

### 3.3 Lo que está pasando con tu tarjeta
Sección con 3 bullets (narrativa_central de la IA). Punto terracota por bullet. Fondo crema.

### 3.4 Tus 3 focos rojos
Tarjetas con borde izquierdo terracota. Cada una: título → que_pasa → por_que_importa → consecuencia (fondo terracota tenue).

### 3.5 Alerta MSI (condicional)
Mostrar solo si `bloque_c.pago_fijo_msi > 0`. Caja azul pizarra explicando el impacto de los MSI en el pago real.

### 3.6 Escenarios (2 columnas)
- Escenario 1 (naranja): tiempo de salida, intereses totales, presión, efecto en lenguaje humano
- Escenario 2 (verde): pago óptimo sugerido, tiempo, ahorro, liquidez recuperada, mejora

Si `meses_liquidacion === 999` → mostrar "Deuda en crecimiento" / "No posible aún"

### 3.7 Primera acción
Caja carbon oscuro, label "Haz esto esta semana", texto de 1–2 oraciones.

### 3.8 CTA final
- Botón terracota: "Quiero una asesoría personalizada →" → `NEXT_PUBLIC_PLAN_URL`
- Botón secundario: "Escribir por WhatsApp 💬" → link generado con número y mensaje pre-llenado

---

## Lógica de pre-cálculo (cliente, ANTES de llamar a la API)

```typescript
// REGLA CRÍTICA: pagos_realizados YA INCLUYE el pago de MSI.
// No sumar MSI encima del pago real. Descomponer así:

const pagos_realizados = context.pago_real || 0;

const pago_fijo_msi =
  card.saldo_msi > 0 && card.meses_restantes_msi > 0
    ? Math.round(card.saldo_msi / card.meses_restantes_msi)
    : card.saldo_msi > 0
    ? Math.round(card.saldo_msi * 0.05)  // fallback: 5% del saldo MSI
    : 0;

// Lo que queda del pago real para atacar el revolvente
const pago_a_revolvente = Math.max(0, pagos_realizados - pago_fijo_msi);

// Déficit: si el pago NO alcanza ni para cubrir los MSI
const deficit_msi = pagos_realizados < pago_fijo_msi
  ? pago_fijo_msi - pagos_realizados : 0;

// Máximo disponible para revolvente si maximizara pagos
const capacidad_disponible = Math.max(0, context.capacidad_pago - pago_fijo_msi);

const ratio_msi = card.saldo_total > 0 ? card.saldo_msi / card.saldo_total : 0;
const factor_msi = ratio_msi < 0.2 ? 1.15 : ratio_msi <= 0.4 ? 1.25 : 1.35;
const estructura_hibrida = card.saldo_msi > 0 && card.saldo_revolvente > 0;
const pct_msi_pago = pagos_realizados > 0
  ? Math.round((pago_fijo_msi / pagos_realizados) * 100) : 0;
```

---

## Prompt maestro del agente IA (9 pasos)

El prompt se construye dinámicamente en `buildMasterPrompt()`. Aquí la lógica completa:

### PASO 1 — Normalización
- Si falta `tasa_anual` → usar 45%
- Si falta `intereses_mes` → estimar: `saldo_revolvente × (tasa_anual/12/100)`
- Si falta `capacidad_pago_real` → usar `pago_minimo × 1.5`
- Si falta `linea_credito` → omitir `ratio_uso_linea`
- Si falta CAT → no usar en toxicidad

### PASO 2 — Descomposición del pago real (CRÍTICO)
`pagos_realizados` es el TOTAL mensual. YA INCLUYE MSI. NO sumar de nuevo.
```
tasa_mensual = tasa_anual / 12 / 100
pago_a_revolvente = MAX(0, pagos_realizados − pago_fijo_msi)
CASOS:
  A) pago_a_revolvente > 0 → cubre MSI y queda algo para revolvente
  B) pago_a_revolvente = 0 → apenas cubre MSI, nada al revolvente
  C) deficit_msi > 0       → no alcanza ni para los MSI (caso crítico)
```

### PASO 3 — Cálculos base
```
ratio_liquidez      = pagos_realizados / capacidad_pago_real
ratio_interes_pago  = intereses_mes / pago_a_revolvente
ratio_revolvente    = saldo_revolvente / saldo_total
ratio_uso_linea     = saldo_total / linea_credito (si existe)
```

### PASO 4 — Los 4 índices (0–100, mayor = mejor control)

**Índice 1 — Presión de Liquidez (peso 30%):**
```
ratio_liquidez < 0.70  → score 90, nivel_presion "Baja"
0.70 – 1.00            → score 70, nivel_presion "Media"
1.00 – 1.30            → score 50, nivel_presion "Media-alta"
≥ 1.30                 → score 25, nivel_presion "Alta"
Si deficit_msi > 0     → SIEMPRE "Alta" (score = 25)
```
⚠️ El nivel se expresa en términos de PRESIÓN (Alta/Baja), no de score. Score bajo = presión ALTA.

**Índice 2 — Qué tanto el pago reduce la deuda (peso 25%):**
```
Si pago_a_revolvente = 0 → score 0, nivel "Nada"
ratio_interes_pago < 0.15  → score 90, nivel "Bien"
0.15 – 0.30                → score 70, nivel "Aceptable"
0.30 – 0.50                → score 50, nivel "Poco"
≥ 0.50                     → score 25, nivel "Muy poco"
EXPLICACIÓN siempre: "De los $X que pagas, $Y van a MSI y $Z al revolvente..."
```

**Índice 3 — Riesgo de que la deuda se alargue (peso 25%):**
```
Empieza en 90, resta puntos:
saldo_revolvente > 0                → −20
cargos_nuevos > 0 y revolvente > 0  → −25
usa_tarjeta = "si" con deuda        → −20
tipo_pago = "minimo"                → −20
ratio_revolvente > 0.50             → −10
saldo_msi > 0                       → −10
ratio_msi > 0.30                    → −15
saldo_msi > 0 y revolvente > 0      → −25 adicional
pago_a_revolvente = 0               → −20 adicional
Score mínimo = 0
NIVEL: 70–90→"Bajo" | 40–69→"Medio" | 0–39→"Alto"
```

**Índice 4 — Toxicidad (peso 20%) — SOLO INTERNO, no mostrar al usuario:**
```
Empieza en 90, resta:
tasa < 25% → 0 | 25–40% → −15 | 40–60% → −35 | ≥ 60% → −50
CAT > 60% → −15 | CAT > 80% → −25
ratio_uso_linea ≥ 0.80 → −20
estructura_hibrida = true → −20
Score mínimo = 0
```

**Score final:**
```
NIVEL_CONTROL = round(liq×0.30 + reduccion×0.25 + alargamiento×0.25 + toxicidad×0.20)

80–100 = Estructura Sana
60–79  = Fricción Financiera
40–59  = Drenaje de Liquidez
0–39   = Trampa de Deuda
```

### PASO 5 — Costo de no entender
```
intereses_12m = saldo_revolvente × tasa_mensual × 12
factor_msi:
  ratio_msi < 0.20  → 1.15
  ratio_msi ≤ 0.40  → 1.25
  ratio_msi > 0.40  → 1.35
intereses_12m_ajustados = intereses_12m × factor_msi
costo_no_entender = intereses_12m_ajustados × 0.40
```
Presentar como estimación, no cifra exacta.

### PASO 6 — Narrativa central
- Máximo 3 bullets cortos y directos
- Prueba: ¿lo entendería en 5 segundos?
- Si `estructura_hibrida`: un bullet DEBE mencionar que los MSI consumen parte del pago
- Si `deficit_msi > 0`: CRÍTICO — mencionarlo explícitamente

### PASO 7 — 12 focos rojos (detecta todos, muestra los 3 más graves)
```
F1:  pagos_realizados > capacidad_pago_real
F2:  pagos_realizados ≈ pago_minimo (±5%)
F3:  tipo_pago = "total" y usa_tarjeta = "si"
F4:  ratio_interes_pago > 0.40
F5:  tasa_anual > 40%
F6:  cat > 60%
F7:  ratio_uso_linea > 0.80
F8:  estructura_hibrida y pct_msi > 30%
     → Si deficit_msi > 0: "Tus MSI consumen más de lo que pagas"
F9:  pago_a_revolvente / saldo_revolvente < 0.02
F10: pago_a_revolvente = 0
F11: usa_tarjeta = "si" y saldo_revolvente > 0
F12: estres_financiero ≥ 8

Prioridad: liquidez > costo alto > prolonga deuda > ciclo activo > bienestar
Si deficit_msi > 0 → F8 y F10 son automáticamente los más graves
```

Cada foco incluye: `titulo` + `que_pasa` (monto + proporción + significado) + `por_que_importa` + `consecuencia`

### PASO 8 — Escenarios

**Escenario 1 (si todo sigue igual):**
Amortización mensual sobre `saldo_revolvente` usando `pago_a_revolvente`:
```
Para cada mes:
  interes = saldo × tasa_mensual
  capital = pago_a_revolvente − interes
  Si capital ≤ 0 o pago_a_revolvente = 0 → meses = 999 (deuda crece)
Si deficit_msi > 0 → meses = 999 automáticamente
presion: ratio > 1.3→"Alta" | 1.0–1.3→"Media-alta" | 0.7–1.0→"Media" | <0.7→"Baja"
```

**Escenario 2 (con ajuste):**
```
pago_optimo = capacidad_disponible (MAX disponible para revolvente)
Si capacidad_disponible = 0: imposible mientras MSI activos
Si > 0: simular amortización con pago_optimo
ahorro_intereses = intereses_1 − intereses_2
liquidez_recuperada = pago_a_revolvente − pago_optimo
REGLA: NUNCA recomendar adelantar MSI
```

### PASO 9 — Primera acción
- Una sola acción concreta. ≤ 2 oraciones. Sin listas.
- Si `deficit_msi > 0`: abordar el déficit primero
- Si `estructura_hibrida` y `pct_msi_pago > 70%`: enfocarse en no agregar nuevos gastos
- Alinear con `prioridad_usuario` si está definida

**Instrucción de calidad final:**
1. ¿Entiende el usuario su problema en 15 segundos?
2. ¿Queda claro cómo los MSI afectan el pago real?
3. Si `deficit_msi > 0`: ¿queda claro que no alcanza ni para los MSI?
Si alguna respuesta es NO → reescribir.

---

## Schema JSON de respuesta (la IA SIEMPRE responde solo JSON)

```json
{
  "datos_extraidos": {
    "saldo_total": 0, "saldo_revolvente": 0, "pago_minimo": 0,
    "pago_no_intereses": 0, "tasa_anual": 0, "cat": 0,
    "intereses_mes": 0, "cargos_nuevos": 0, "linea_credito": 0,
    "saldo_msi": 0, "meses_restantes_msi": 0, "pago_fijo_msi": 0,
    "ratio_msi": 0, "estructura_hibrida": false
  },
  "bloque_c": {
    "pagos_realizados": 0, "pago_total_comprometido": 0,
    "tasa_mensual": 0, "pago_fijo_msi": 0,
    "capacidad_disponible_real": 0, "pct_capacidad_en_msi": 0,
    "ratio_liquidez": 0, "ratio_interes_pago": 0,
    "ratio_revolvente": 0, "ratio_uso_linea": 0
  },
  "indices": {
    "liquidez": {
      "score": 0,
      "nivel_presion": "Alta | Media-alta | Media | Baja",
      "explicacion": "string con montos reales"
    },
    "reduccion_deuda": {
      "score": 0,
      "nivel": "Bien | Aceptable | Poco | Muy poco | Nada",
      "explicacion": "De los $X que pagas, $Y van a MSI y $Z al revolvente..."
    },
    "riesgo_alargamiento": {
      "score": 0,
      "nivel": "Alto | Medio | Bajo",
      "explicacion": "string"
    }
  },
  "toxicidad_interna": { "score": 0 },
  "nivel_control": 0,
  "diagnostico_nivel": "Estructura Sana | Fricción Financiera | Drenaje de Liquidez | Trampa de Deuda",
  "descripcion_diagnostico": "string — 1-2 líneas en lenguaje humano",
  "costo_no_entender_12m": 0,
  "narrativa_central": ["bullet 1", "bullet 2", "bullet 3"],
  "focos_rojos": [
    {
      "numero": 1,
      "titulo": "string",
      "que_pasa": "string — monto + proporción + significado",
      "por_que_importa": "string",
      "consecuencia": "string"
    }
  ],
  "escenario_igual": {
    "meses_liquidacion": 0,
    "intereses_totales": 0,
    "presion": "Alta | Media-alta | Media | Baja",
    "efecto": "string en lenguaje humano"
  },
  "escenario_optimo": {
    "pago_optimo": 0,
    "meses_liquidacion": 0,
    "ahorro_intereses": 0,
    "liquidez_recuperada_mes": 0,
    "mejora": "string en lenguaje humano",
    "nota_msi": "string | null"
  },
  "primera_accion": "string — máx 2 oraciones"
}
```

---

## Integraciones backend

### Anthropic API (`/api/diagnose/route.ts`)
```
Modelo: claude-sonnet-4-20250514
max_tokens: 2500
Content: array de bloques (imágenes/PDFs en base64 + texto del prompt)
⚠️ La API key NUNCA va en el frontend — solo en variables de entorno de Vercel
```

**Flujo:**
1. Recibe datos del quiz + pre-cálculos
2. Construye array de contenido con los archivos adjuntos (si hay)
3. Llama a Claude con el prompt maestro
4. Parsea el JSON de respuesta
5. Llama a `/api/ghl` en background (fire and forget)
6. Retorna el diagnóstico al frontend

### GoHighLevel CRM (`/api/ghl/route.ts`)
```
Base URL: https://services.leadconnectorhq.com
Version: 2021-07-28
Auth: Bearer {GHL_API_KEY}
```

**Flujo:**
1. Buscar contacto por email (`/contacts/search/duplicate`)
2. Si existe → `PUT /contacts/{id}` (actualizar)
3. Si no existe → `POST /contacts/` (crear)
4. Enviar email de informe via Resend

**Tags automáticos según nivel:**
- score 0–39 → `diagnostico-trampa`
- score 40–59 → `diagnostico-drenaje`
- score 60–79 → `diagnostico-friccion`
- score 80–100 → `diagnostico-sano`

**22 campos personalizados `vl_*` en GHL:**
`vl_score, vl_diagnostico, vl_costo_oculto, vl_capacidad_pago, vl_tipo_pago, vl_usa_tarjeta, vl_ingreso_tipo, vl_estres, vl_descripcion, vl_foco_1, vl_foco_2, vl_foco_3, vl_saldo_total, vl_saldo_revolvente, vl_tasa_anual, vl_pago_real, vl_saldo_msi, vl_meses_msi, vl_pago_fijo_msi, vl_meses_sin_cambio, vl_ahorro_potencial, vl_primera_accion`

**Setup inicial:** visitar `/api/setup-ghl` una sola vez para crear los campos en GHL.

### Resend Email (`dentro de /api/ghl/route.ts`)
```
Endpoint: POST https://api.resend.com/emails
From: "Vive Ligero <onboarding@resend.dev>"
To: v1v3.l1g3r0@gmail.com
Subject: "📊 Nuevo diagnóstico — {nombre} · Score {X} {emoji} {nivel}"
```

**Contenido del email:**
- Datos del lead (nombre, email, WhatsApp)
- Score + nivel + emoji
- Costo de no entender
- Narrativa central (bullets)
- Focos rojos detectados
- Escenarios proyectados
- Primera acción recomendada
- Pie con fecha y URL

---

## Notas críticas de implementación

1. **Lógica MSI (la más importante):** `pagos_realizados` YA INCLUYE el pago de MSI. Nunca sumar MSI encima del pago real. `pago_a_revolvente = pagos_realizados − pago_fijo_msi`.

2. **Presión de liquidez:** el nivel se expresa en términos de presión (Alta/Baja), NO de score. Score 25 = situación mala = presión ALTA. Implementar fallback en el render: si Claude devuelve "Alto/Bajo" en vez de "Alta/Baja", normalizar usando el score.

3. **Toxicidad solo interna:** NO mostrar al usuario. Solo se usa para calcular el score final. El render solo muestra 3 indicadores (grid de 3 columnas, no 4).

4. **Múltiples archivos:** el upload acepta varios PDFs e imágenes simultáneamente. Todos se envían como bloques separados en el contenido del mensaje a Claude.

5. **Formato de moneda:** MXN sin decimales. `new Intl.NumberFormat("es-MX", {style:"currency", currency:"MXN", maximumFractionDigits:0}).format(n)`

6. **`meses_liquidacion === 999`:** significa que la deuda está creciendo o que no es posible liquidar. Mostrar "Deuda en crecimiento" / "No posible aún".

7. **CTA WhatsApp:** generar link con `https://wa.me/{lada}{numero}?text={mensaje}`, limpiando caracteres no numéricos del teléfono.

8. **Fire and forget:** la llamada a `/api/ghl` desde `/api/diagnose` es asíncrona y no bloquea la respuesta al usuario. Errores de GHL se logean pero no se propagan.

---

## Ejemplo de diagnóstico completo (caso de prueba)

**Input:**
- saldo_total: $500,000 | saldo_revolvente: $200,000 | saldo_msi: $300,000
- meses_restantes_msi: 8 | tasa_anual: 45% | pagos_realizados: $20,000
- capacidad_pago: $25,000 | usa_tarjeta: sí | estres: 8/10

**Pre-cálculos:**
```
pago_fijo_msi       = 300,000 / 8 = $37,500/mes
pago_a_revolvente   = MAX(0, 20,000 − 37,500) = $0
deficit_msi         = 37,500 − 20,000 = $17,500
capacidad_disponible= MAX(0, 25,000 − 37,500) = $0
ratio_msi           = 300,000 / 500,000 = 0.60
factor_msi          = 1.35 (ratio > 0.40)
estructura_hibrida  = true
```

**Score resultante:**
```
Índice 1 (Presión): deficit_msi > 0 → SIEMPRE Alta → score = 25
Índice 2 (Reducción): pago_a_revolvente = 0 → score = 0, nivel = "Nada"
Índice 3 (Alargamiento): 90−20−20−10−10−25−20 = max(0,-15) = 0
Índice 4 (Toxicidad): 90−35−20 = 35 (tasa 45%, estructura_hibrida)

NIVEL_CONTROL = round(25×0.30 + 0×0.25 + 0×0.25 + 35×0.20)
             = round(7.5 + 0 + 0 + 7.0) = 15 → 🔴 Trampa de Deuda

Costo: 200,000 × 0.0375 × 12 × 1.35 × 0.40 = $48,600
Escenario 1: meses = 999 (deuda crece $5,633/mes)
Escenario 2: meses = 999 (sin margen hasta que terminen los MSI en 8 meses)
```

---

## Prompt para V0

Al subir los 20 archivos a V0, usar este prompt:

> *"Este es un proyecto Next.js completo de Vive Ligero — una plataforma de diagnóstico inteligente de tarjetas de crédito. El proyecto incluye toda la lógica de negocio, el modelo de IA, las integraciones con GHL y Resend, y los 3 pasos del quiz ya implementados. Tu tarea es mejorar el diseño visual y la UX manteniendo EXACTAMENTE la lógica de negocio, los tipos TypeScript, el prompt maestro (buildMasterPrompt en lib/core.ts), y el schema JSON de respuesta tal como están. No cambies la lógica de cálculo de MSI, los 4 índices, ni el flujo de datos. Solo mejora lo visual: tipografía Nunito + Poppins, paleta de colores Vive Ligero (carbon #3D3530, terracota #B5715A, crema #F0EBE1, salvia #6B8F71), y la experiencia de usuario en mobile-first."*

---

## Estructura de archivos modularizada (Low Ticket + Diagnóstico)

Esta es la estructura target del proyecto después de la refactorización.
Úsala siempre para determinar en qué archivo hacer cada cambio.

```
/lib/
  avalanche-engine.ts     ← Motor de cálculo del plan Avalanche
                            calcularPlanAvalanche(), calcularUmbrales()
                            FilaAmortizacion, ItemPlan, interfaces
                            NO importa React — lógica pura

  build-prompt.ts         ← System prompt del agente IA del chat
                            buildSystemPrompt(diagnosis, tarjetas, user)
                            NO importa React — lógica pura

  data-extractor.ts       ← Lectura de localStorage
                            getDiagnosisData(), getTarjetas(), getUser()
                            Manejo de múltiples claves posibles
                            Solo corre en cliente (typeof window check)

  formatters.ts           ← Utilidades de formato
                            fmtMXN(), calcularFechaLibertad()
                            COUNTRY_CODES, isValidEmail(), isValidPhone()
                            extractJSON(), isValidJSON()

  calculations.ts         ← Pre-cálculos MSI (diagnóstico)
                            calculateAllMetrics()

  quiz-context.tsx        ← Estado global del diagnóstico (React Context)

  types.ts                ← Todos los tipos TypeScript del proyecto

/components/
  /diagnostico/
    StepContact.tsx       ← Paso 1: nombre, email, WhatsApp con lada
    StepCardCapture.tsx   ← Paso 2: upload imagen → confirmación → formulario
                            CardCapture reutilizable, máx 5 tarjetas
                            Estado A (upload) → B (confirmación) → C (formulario)
    StepContext.tsx       ← Paso 3: capacidad pago, prioridad, estrés, pills
    DiagnosisResult.tsx   ← Resultado completo del diagnóstico
                            Score, indicadores, narrativa, focos, escenarios

  /low-ticket/
    LandingPage.tsx       ← Página de venta
                            Hero + Roadmap (4 puntos) + Plan Preview bloqueado
                            + Qué incluye + Para quién es
    CheckoutPage.tsx      ← Checkout simulado
                            Lee vl_user de localStorage
                            Si existe → /bienvenida directo
                            Si no existe → redirige a diagnóstico gratuito
    WelcomePage.tsx       ← Bienvenida con disclaimer integrado
                            Bloque 1: confirmación + mini roadmap
                            Bloque 2: disclaimer + botón "Entendido, quiero mi plan →"

  /modulo1/
    Disclaimer.tsx        ← Aviso de deslinde (fase 'aviso')
                            Texto fijo, botón "Entendido, empecemos →"
    ChatInterface.tsx     ← Interfaz de chat con el agente IA (fase 'chat')
                            Llama a /api/chat
                            Muestra desglose de flujo mensual al inicio
                            Tablas de amortización bajo demanda
                            Loop de confirmación hasta que usuario aprueba
    PlanDashboard.tsx     ← Dashboard del plan confirmado (fase 'dashboard')
                            Mismos componentes visuales del Plan Preview
                            Checklist de acciones, orden de ataque
    Modulo1Flow.tsx       ← ORQUESTADOR — archivo más crítico del módulo
                            type Fase = 'aviso' | 'chat' | 'dashboard'
                            useState<Fase>('aviso') — SIEMPRE empieza en aviso
                            Limpia vl_plan al montar para evitar saltar chat
                            Fase solo avanza hacia adelante, nunca salta

  /modulo2/
    EnergyChecklist.tsx   ← Checklist de energía semanal (6 preguntas semáforo)
                            Score 0-100, interpretación, compromiso semanal

  /modulo3/
    ManifestoExercise.tsx ← 3 preguntas + generación del Manifiesto con IA
                            Manifiesto guardado en vl_manifesto

  /shared/
    AmortizationTable.tsx ← Tabla mes a mes reutilizable
                            Columnas: Mes/Saldo inicial/Interés/Capital/Pago/Saldo final
                            Totales al pie, visible bajo demanda
    ResourcesSection.tsx  ← Sección "Recursos de apoyo" (placeholders)
                            Presente en todos los módulos
    SystemRoadmap.tsx     ← Línea de tiempo del Sistema Vive Ligero
                            4 puntos: Plan/Sistema/Diseño/Arquitectura
                            Punto activo en terracota, futuros en gris
                            Versión completa (landing) y mini (bienvenida)
    CardSummary.tsx       ← Tarjeta resumen de tarjeta confirmada
                            ✓ nombre + saldo revolvente + tasa + botón Editar

/app/api/
  /chat/route.ts          ← Proxy al agente IA del Módulo 1
                            fetch directo a Anthropic (NO usar @ai-sdk ni 'ai')
                            model: claude-sonnet-4-20250514
                            Lee systemPrompt del body, no lo construye aquí
  /diagnose/route.ts      ← Diagnóstico de tarjetas
                            Soporta múltiples imágenes/PDFs en base64
                            Extrae JSON de respuesta con extractJSON()
                            Llama a /api/ghl en background (fire and forget)
  /ghl/route.ts           ← Crea/actualiza contacto GHL + email Resend
                            Busca contacto por email antes de crear
                            22 campos vl_* personalizados
  /setup-ghl/route.ts     ← Crea los 22 campos en GHL (correr 1 sola vez)
                            GET request, sin parámetros

docs/coach-personalidad.md   ← Personalidad, perfiles y voz del Coach Vive Ligero
docs/guion-parte1.md         ← Guión conversacional: flujo compartido y detección de perfil
```

---

## Mapa de cambios → archivos

Usar esta tabla para determinar qué archivo editar en cada tipo de cambio:

| Tipo de cambio | Archivo a editar |
|---------------|-----------------|
| Lógica de cálculo del plan (Avalanche) | `lib/avalanche-engine.ts` |
| System prompt del agente IA del chat | `lib/build-prompt.ts` |
| Leer datos del diagnóstico/tarjetas | `lib/data-extractor.ts` |
| Cálculo del costo de no entender | `lib/calculations.ts` |
| Formato de moneda o fechas | `lib/formatters.ts` |
| Flujo de fases del Módulo 1 (aviso/chat/dashboard) | `components/modulo1/Modulo1Flow.tsx` |
| Diseño o comportamiento del chat | `components/modulo1/ChatInterface.tsx` |
| Dashboard del plan confirmado | `components/modulo1/PlanDashboard.tsx` |
| Aviso de deslinde | `components/modulo1/Disclaimer.tsx` |
| Tabla mes a mes | `components/shared/AmortizationTable.tsx` |
| Roadmap del sistema | `components/shared/SystemRoadmap.tsx` |
| Paso 2 del diagnóstico (upload/formulario) | `components/diagnostico/StepCardCapture.tsx` |
| Resultado del diagnóstico | `components/diagnostico/DiagnosisResult.tsx` |
| Landing del Low Ticket | `components/low-ticket/LandingPage.tsx` |
| Checkout | `components/low-ticket/CheckoutPage.tsx` |
| Página de bienvenida | `components/low-ticket/WelcomePage.tsx` |
| API del chat (conexión con Anthropic) | `app/api/chat/route.ts` |
| API del diagnóstico | `app/api/diagnose/route.ts` |
| Integración GHL + email | `app/api/ghl/route.ts` |

---

## Instrucción permanente para todos los prompts de V0

**INCLUIR SIEMPRE AL INICIO DE CADA PROMPT:**

> Haz SOLO los cambios específicos que describo a continuación.
> NO reescribas componentes completos.
> Edita únicamente las líneas necesarias del archivo indicado.
> Si para hacer el cambio necesitas modificar más de 20 líneas
> de un componente, detente y pregunta antes de continuar.

---

## Reglas críticas de implementación (actualizadas)

### Motor de cálculo del Low Ticket (Avalanche)

```typescript
// MÉTODO AVALANCHE — mayor tasa primero
// 1. Ordenar tarjetas de MAYOR a MENOR tasa
// 2. Pagar el MÍNIMO a todas
// 3. TODO el excedente va a la tarjeta de mayor tasa
// 4. Al liquidar, su pago completo pasa a la siguiente
// 5. Objetivo: minimizar intereses totales (óptimo matemático)

// BASE DEL CÁLCULO:
capacidad_base = lo que el usuario dijo que puede pagar cómodamente
capacidad_disponible = capacidad_base - pago_fijo_msi
excedente = MAX(0, capacidad_disponible - suma_mínimos)

// FECHA DE LIBERTAD — siempre desde HOY:
const fecha = new Date();
fecha.setMonth(fecha.getMonth() + meses_total);
// NUNCA hardcodear fechas ni usar fechas del pasado

// AHORRO — siempre positivo:
ahorro = intereses_sin_plan - intereses_con_plan
// intereses_sin_plan = simulación pagando solo mínimos
// Si ahorro = 0 hay un error de cálculo
```

### Los 4 casos de capacidad (infalible para cualquier escenario)

```
CASO 1: capacidad_cómoda < pago_fijo_msi
  → No alcanza ni para los MSI
  → Mostrar 3 umbrales (MSI / MSI+mínimos / plan 24 meses)
  → Preguntar si puede estirar el monto
  → NO ofrecer análisis de dónde conseguir dinero

CASO 2: capacidad_disponible < suma_mínimos
  → Cubre MSI pero no los mínimos del revolvente
  → Mismo tratamiento que Caso 1

CASO 3: excedente < interés_mensual_objetivo
  → Cubre mínimos pero deuda crece en tarjeta objetivo
  → Mostrar plan con advertencia + umbral de beneficio
  → Dar opción de continuar o ajustar

CASO 4: plan viable
  → Ejecutar Avalanche normalmente
```

### Flujo del Módulo 1 (irrompible)

```typescript
// ESTADO DE FASE — nunca saltar pasos
type Fase = 'aviso' | 'chat' | 'dashboard';
const [fase, setFase] = useState<Fase>('aviso'); // SIEMPRE empieza en aviso

// AL MONTAR: limpiar plan anterior para evitar saltar el chat
useEffect(() => {
  localStorage.removeItem('vl_plan');
  setFase('aviso');
}, []);

// RENDERIZADO — orden obligatorio:
{fase === 'aviso'     && <Disclaimer onAceptar={() => setFase('chat')} />}
{fase === 'chat'      && <ChatInterface onConfirmar={() => setFase('dashboard')} />}
{fase === 'dashboard' && <PlanDashboard />}

// dashboard solo aparece cuando usuario confirma en el chat
// vl_plan en localStorage NO se usa para saltar fases
```

### API del chat — conexión con Anthropic

```typescript
// SIEMPRE usar fetch directo — NUNCA usar @ai-sdk/anthropic ni 'ai'
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
    system: systemPrompt,
    messages,
  }),
});
// Leer respuesta: data.content[0].text (NO data.model ni data.text)
```
NOTA IMPORTANTE SOBRE LA REFACTORIZACIÓN:
Los archivos lib/ (avalanche-engine.ts, build-prompt.ts, formatters.ts)
son re-exportaciones de lib/core.ts — la fuente real del código.
Para editar la lógica de cálculo, editar lib/core.ts directamente.
Para editar el system prompt del chat, editar lib/build-prompt.ts
que apunta a lib/core.ts.

## Rediseño en proceso (Camino A)
Ver `docs/coach-personalidad.md` y `docs/guion-parte1.md` para la
nueva arquitectura conversacional. El SKILL.md se actualizará cuando
los cambios estén implementados en V0.
