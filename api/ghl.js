export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey      = process.env.GHL_API_KEY;
  const locationId  = process.env.GHL_LOCATION_ID;
  const ADMIN_EMAIL = 'v1v3.l1g3r0@gmail.com';

  if (!apiKey || !locationId) {
    return res.status(500).json({ error: 'GHL no configurado' });
  }

  try {
    const d = req.body;

    // ── 1. Buscar contacto existente ──────────────────────────────────────
    const searchRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(d.email)}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' } }
    );
    const searchData  = await searchRes.json();
    const existingId  = searchData?.contact?.id || null;

    // ── 2. Payload del contacto ───────────────────────────────────────────
    const contactPayload = {
      locationId,
      firstName: d.firstName || '',
      email:     d.email     || '',
      phone:     d.phone     || '',
      source:    'Diagnóstico Vive Ligero',
      tags:      d.tags      || [],
      customFields: [
        { key: 'vl_score',            field_value: String(d.vl_score            ?? '') },
        { key: 'vl_diagnostico',      field_value: String(d.vl_diagnostico      ?? '') },
        { key: 'vl_costo_oculto',     field_value: String(d.vl_costo_oculto     ?? '') },
        { key: 'vl_capacidad_pago',   field_value: String(d.vl_capacidad_pago   ?? '') },
        { key: 'vl_tipo_pago',        field_value: String(d.vl_tipo_pago        ?? '') },
        { key: 'vl_usa_tarjeta',      field_value: String(d.vl_usa_tarjeta      ?? '') },
        { key: 'vl_ingreso_tipo',     field_value: String(d.vl_ingreso_tipo     ?? '') },
        { key: 'vl_estres',           field_value: String(d.vl_estres           ?? '') },
        { key: 'vl_descripcion',      field_value: String(d.vl_descripcion      ?? '') },
        { key: 'vl_foco_1',           field_value: String(d.vl_foco_1           ?? '') },
        { key: 'vl_foco_2',           field_value: String(d.vl_foco_2           ?? '') },
        { key: 'vl_foco_3',           field_value: String(d.vl_foco_3           ?? '') },
        { key: 'vl_saldo_total',      field_value: String(d.vl_saldo_total      ?? '') },
        { key: 'vl_saldo_revolvente', field_value: String(d.vl_saldo_revolvente ?? '') },
        { key: 'vl_tasa_anual',       field_value: String(d.vl_tasa_anual       ?? '') },
        { key: 'vl_pago_real',        field_value: String(d.vl_pago_real        ?? '') },
        { key: 'vl_saldo_msi',        field_value: String(d.vl_saldo_msi        ?? '') },
        { key: 'vl_meses_msi',        field_value: String(d.vl_meses_msi        ?? '') },
        { key: 'vl_pago_fijo_msi',    field_value: String(d.vl_pago_fijo_msi    ?? '') },
        { key: 'vl_meses_sin_cambio', field_value: String(d.vl_meses_sin_cambio ?? '') },
        { key: 'vl_ahorro_potencial', field_value: String(d.vl_ahorro_potencial ?? '') },
        { key: 'vl_primera_accion',   field_value: String(d.vl_primera_accion   ?? '') },
      ].filter(f => f.field_value !== '' && f.field_value !== 'undefined')
    };

    // ── 3. Crear o actualizar contacto ────────────────────────────────────
    let contactId;
    if (existingId) {
      const r = await fetch(
        `https://services.leadconnectorhq.com/contacts/${existingId}`,
        { method: 'PUT', headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28', 'Content-Type': 'application/json' }, body: JSON.stringify(contactPayload) }
      );
      contactId = (await r.json())?.contact?.id || existingId;
    } else {
      const r = await fetch(
        'https://services.leadconnectorhq.com/contacts/',
        { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28', 'Content-Type': 'application/json' }, body: JSON.stringify(contactPayload) }
      );
      contactId = (await r.json())?.contact?.id;
    }

    // ── 4. Generar y enviar email de informe ──────────────────────────────
    const fmt = (n) => {
      if (n === null || n === undefined || n === '') return '—';
      const num = Number(n);
      if (!isNaN(num) && typeof n !== 'string') {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
      }
      return String(n);
    };

    const nivelEmoji = { 'Estructura Sana':'🟢', 'Fricción Financiera':'🟡', 'Drenaje de Liquidez':'🟠', 'Trampa de Deuda':'🔴' };
    const emoji = nivelEmoji[d.vl_diagnostico] || '🟠';
    const fecha = new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

    const capDisp = (Number(d.vl_capacidad_pago)||0) - (Number(d.vl_pago_fijo_msi)||0);

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#F0EBE1;margin:0;padding:20px;color:#3D3530}
  .wrap{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:#3D3530;padding:28px 32px;text-align:center}
  .hdr img{height:36px}
  .hdr h1{color:#FAFAF7;font-size:20px;margin:10px 0 2px;font-weight:600}
  .hdr p{color:rgba(255,255,255,.45);font-size:12px;margin:0}
  .score-area{background:#3D3530;padding:0 32px 24px;text-align:center}
  .score-num{font-size:72px;font-weight:700;color:#FAFAF7;line-height:1;letter-spacing:-3px}
  .score-sub{font-size:12px;color:rgba(255,255,255,.35);margin-bottom:8px}
  .badge{display:inline-block;padding:5px 16px;border-radius:100px;font-size:13px;background:rgba(181,113,90,.3);color:#F0DDD6;border:1px solid rgba(181,113,90,.4)}
  .costo{max-width:300px;margin:14px auto 0;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 16px}
  .costo .cl{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:4px}
  .costo .cv{font-size:24px;font-weight:700;color:#F0DDD6}
  .sec{padding:20px 28px;border-bottom:1px solid #F0EBE1}
  .sec:last-child{border-bottom:none}
  .sec h2{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A09088;margin:0 0 12px}
  .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #F7F4EE;font-size:13px}
  .row:last-child{border-bottom:none}
  .rl{color:#6B5F58}
  .rv{font-weight:600;color:#3D3530;text-align:right;max-width:55%}
  .foco{background:#FDF5F2;border-left:3px solid #B5715A;border-radius:6px;padding:12px 14px;margin-bottom:8px;font-size:13px}
  .foco b{color:#3D3530;display:block;margin-bottom:3px}
  .mono{background:#F7F4EE;border-radius:8px;padding:12px 14px;font-family:monospace;font-size:12px;color:#6B5F58;line-height:1.8;white-space:pre-wrap}
  .accion{background:#3D3530;border-radius:8px;padding:14px 16px;color:rgba(255,255,255,.8);font-size:13px;line-height:1.6}
  .accion .al{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:6px}
  .esc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .esc{background:#F7F4EE;border-radius:8px;padding:12px}
  .esc.opt{background:#D0E4D3}
  .esc .et{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#A09088;margin-bottom:8px}
  .esc.opt .et{color:#4A6B50}
  .foot{padding:16px 28px;text-align:center;font-size:11px;color:#A09088}
</style>
</head>
<body>
<div class="wrap">

  <div class="hdr">
    <img src="https://assets.cdn.filesafe.space/1xgtTnreD0serAY0d4FN/media/69bb1c5653d4f1fc50b3d532.png" alt="Vive Ligero">
    <h1>Nuevo Diagnóstico Completado</h1>
    <p>${fecha}</p>
  </div>

  <div class="score-area">
    <div class="score-sub">Vive Ligero Score</div>
    <div class="score-num">${d.vl_score ?? '—'}</div>
    <div class="badge">${emoji} ${d.vl_diagnostico || '—'}</div>
    <div class="costo">
      <div class="cl">💸 Costo de no entender (12 meses)</div>
      <div class="cv">${fmt(d.vl_costo_oculto)}</div>
    </div>
  </div>

  <div class="sec">
    <h2>Lead</h2>
    <div class="row"><span class="rl">Nombre</span><span class="rv">${d.firstName || '—'}</span></div>
    <div class="row"><span class="rl">Email</span><span class="rv">${d.email || '—'}</span></div>
    <div class="row"><span class="rl">WhatsApp</span><span class="rv">${d.phone || '—'}</span></div>
  </div>

  <div class="sec">
    <h2>Datos Financieros del Cliente</h2>
    <div class="row"><span class="rl">Saldo total</span><span class="rv">${fmt(d.vl_saldo_total)}</span></div>
    <div class="row"><span class="rl">Saldo revolvente</span><span class="rv">${fmt(d.vl_saldo_revolvente)}</span></div>
    <div class="row"><span class="rl">Saldo MSI</span><span class="rv">${fmt(d.vl_saldo_msi)}</span></div>
    <div class="row"><span class="rl">Meses restantes MSI</span><span class="rv">${d.vl_meses_msi || '—'}</span></div>
    <div class="row"><span class="rl">Pago fijo MSI/mes</span><span class="rv">${fmt(d.vl_pago_fijo_msi)}</span></div>
    <div class="row"><span class="rl">Tasa anual</span><span class="rv">${d.vl_tasa_anual ? d.vl_tasa_anual + '%' : '—'}</span></div>
    <div class="row"><span class="rl">Pago real mensual</span><span class="rv">${fmt(d.vl_pago_real)}</span></div>
    <div class="row"><span class="rl">Capacidad de pago bruta</span><span class="rv">${fmt(d.vl_capacidad_pago)}</span></div>
    <div class="row"><span class="rl">Capacidad disponible (después MSI)</span><span class="rv">${fmt(capDisp)}</span></div>
    <div class="row"><span class="rl">Forma de pago habitual</span><span class="rv">${d.vl_tipo_pago || '—'}</span></div>
    <div class="row"><span class="rl">Usa tarjeta activamente</span><span class="rv">${d.vl_usa_tarjeta || '—'}</span></div>
    <div class="row"><span class="rl">Tipo de ingreso</span><span class="rv">${d.vl_ingreso_tipo || '—'}</span></div>
    <div class="row"><span class="rl">Nivel de estrés</span><span class="rv">${d.vl_estres ? d.vl_estres + '/10' : '—'}</span></div>
  </div>

  <div class="sec">
    <h2>Operación del Diagnóstico</h2>
    <div class="mono">${d.vl_saldo_revolvente && d.vl_tasa_anual ? `tasa_mensual      = ${d.vl_tasa_anual}% ÷ 12 = ${(Number(d.vl_tasa_anual)/12).toFixed(3)}%
pago_fijo_msi     = ${d.vl_saldo_msi && d.vl_meses_msi ? `${fmt(d.vl_saldo_msi)} ÷ ${d.vl_meses_msi} meses = ${fmt(d.vl_pago_fijo_msi)}/mes` : 'no aplica (sin MSI)'}
capacidad_disp    = ${fmt(d.vl_capacidad_pago)} − ${fmt(d.vl_pago_fijo_msi)} = ${fmt(capDisp)}
costo_no_entender = ${fmt(d.vl_saldo_revolvente)} × ${(Number(d.vl_tasa_anual)/12/100).toFixed(5)} × 12 × 0.40 = ${fmt(d.vl_costo_oculto)}` : 'Datos extraídos de imagen — ver campos arriba'}</div>
  </div>

  <div class="sec">
    <h2>Focos Rojos Detectados</h2>
    ${[d.vl_foco_1, d.vl_foco_2, d.vl_foco_3].filter(Boolean).map((f,i) =>
      `<div class="foco"><b>🔴 Foco ${i+1}</b>${f}</div>`
    ).join('') || '<p style="color:#A09088;font-size:13px;margin:0">No disponibles</p>'}
  </div>

  <div class="sec">
    <h2>Escenarios Proyectados</h2>
    <div class="esc-grid">
      <div class="esc">
        <div class="et">Si todo sigue igual</div>
        <div class="row"><span class="rl">Salida estimada</span><span class="rv">${d.vl_meses_sin_cambio === 999 ? 'Deuda crece' : (d.vl_meses_sin_cambio ? d.vl_meses_sin_cambio + ' meses' : '—')}</span></div>
      </div>
      <div class="esc opt">
        <div class="et">Con estrategia óptima</div>
        <div class="row"><span class="rl">Ahorro potencial</span><span class="rv">${fmt(d.vl_ahorro_potencial)}</span></div>
      </div>
    </div>
  </div>

  <div class="sec">
    <h2>Primera Acción Recomendada</h2>
    <div class="accion">
      <div class="al">Haz esto esta semana</div>
      ${d.vl_primera_accion || '—'}
    </div>
  </div>

  <div class="foot">
    Generado en <strong>diagnostico.vive-ligero.com</strong> · Vive Ligero · Finanzas & Bienestar
  </div>

</div>
</body>
</html>`;

    // Enviar email via API de GHL
    if (contactId) {
      await fetch('https://services.leadconnectorhq.com/conversations/messages/outbound', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type:      'Email',
          contactId,
          locationId,
          fromName:  'Vive Ligero',
          fromEmail: ADMIN_EMAIL,
          to:        ADMIN_EMAIL,
          subject:   `📊 Nuevo diagnóstico — ${d.firstName || d.email} · Score ${d.vl_score} ${emoji} ${d.vl_diagnostico}`,
          html,
        })
      });
    }

    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('GHL error:', err);
    return res.status(500).json({ error: err.message });
  }
}
