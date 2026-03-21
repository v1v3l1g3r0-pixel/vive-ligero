export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey      = process.env.GHL_API_KEY;
  const locationId  = process.env.GHL_LOCATION_ID;
  const resendKey   = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = 'v1v3.l1g3r0@gmail.com';

  if (!apiKey || !locationId) return res.status(500).json({ error: 'GHL no configurado' });

  try {
    const d = req.body;

    // ── 1. Buscar contacto existente ──────────────────────────────────────
    const searchRes  = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(d.email)}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' } }
    );
    const existingId = (await searchRes.json())?.contact?.id || null;

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

    // ── 3. Crear o actualizar contacto en GHL ────────────────────────────
    let contactId;
    if (existingId) {
      const r = await fetch(`https://services.leadconnectorhq.com/contacts/${existingId}`,
        { method: 'PUT', headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28', 'Content-Type': 'application/json' }, body: JSON.stringify(contactPayload) });
      contactId = (await r.json())?.contact?.id || existingId;
    } else {
      const r = await fetch('https://services.leadconnectorhq.com/contacts/',
        { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28', 'Content-Type': 'application/json' }, body: JSON.stringify(contactPayload) });
      contactId = (await r.json())?.contact?.id;
    }

    // ── 4. Generar HTML del informe ───────────────────────────────────────
    const fmt = (n) => {
      if (n === null || n === undefined || n === '') return '—';
      const num = Number(n);
      if (!isNaN(num) && n !== '' && typeof n !== 'boolean') {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
      }
      return String(n);
    };

    const nivelEmoji = { 'Estructura Sana':'🟢', 'Fricción Financiera':'🟡', 'Drenaje de Liquidez':'🟠', 'Trampa de Deuda':'🔴' };
    const emoji  = nivelEmoji[d.vl_diagnostico] || '🟠';
    const fecha  = new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
    const capDisp = (Number(d.vl_capacidad_pago)||0) - (Number(d.vl_pago_fijo_msi)||0);

    const row = (label, value) => `
      <tr>
        <td style="padding:7px 12px;font-size:13px;color:#6B5F58;border-bottom:1px solid #F0EBE1">${label}</td>
        <td style="padding:7px 12px;font-size:13px;font-weight:600;color:#3D3530;text-align:right;border-bottom:1px solid #F0EBE1">${value}</td>
      </tr>`;

    const focos = [d.vl_foco_1, d.vl_foco_2, d.vl_foco_3].filter(Boolean);

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#F0EBE1;font-family:Arial,sans-serif;color:#3D3530">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">

  <!-- Header -->
  <div style="background:#3D3530;padding:28px 32px;text-align:center">
    <img src="https://assets.cdn.filesafe.space/1xgtTnreD0serAY0d4FN/media/69bb1c5653d4f1fc50b3d532.png" alt="Vive Ligero" style="height:36px">
    <h1 style="color:#FAFAF7;font-size:18px;margin:10px 0 2px;font-weight:600">Nuevo Diagnóstico Completado</h1>
    <p style="color:rgba(255,255,255,.4);font-size:12px;margin:0">${fecha}</p>
  </div>

  <!-- Score -->
  <div style="background:#3D3530;padding:4px 32px 28px;text-align:center">
    <p style="font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.1em;text-transform:uppercase;margin:0 0 4px">Vive Ligero Score</p>
    <div style="font-size:72px;font-weight:700;color:#FAFAF7;line-height:1;letter-spacing:-3px">${d.vl_score ?? '—'}</div>
    <div style="display:inline-block;margin-top:8px;padding:5px 18px;border-radius:100px;font-size:13px;background:rgba(181,113,90,.3);color:#F0DDD6;border:1px solid rgba(181,113,90,.4)">${emoji} ${d.vl_diagnostico || '—'}</div>
    <div style="max-width:280px;margin:14px auto 0;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 16px">
      <p style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.3);margin:0 0 4px">💸 Costo de no entender (12 meses)</p>
      <p style="font-size:22px;font-weight:700;color:#F0DDD6;margin:0">${fmt(d.vl_costo_oculto)}</p>
    </div>
  </div>

  <!-- Lead -->
  <div style="padding:20px 28px;border-bottom:1px solid #F0EBE1">
    <p style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A09088;margin:0 0 10px">Lead</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Nombre', d.firstName || '—')}
      ${row('Email', d.email || '—')}
      ${row('WhatsApp', d.phone || '—')}
    </table>
  </div>

  <!-- Datos financieros -->
  <div style="padding:20px 28px;border-bottom:1px solid #F0EBE1">
    <p style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A09088;margin:0 0 10px">Datos Financieros del Cliente</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Saldo total', fmt(d.vl_saldo_total))}
      ${row('Saldo revolvente', fmt(d.vl_saldo_revolvente))}
      ${row('Saldo MSI', fmt(d.vl_saldo_msi))}
      ${row('Meses restantes MSI', d.vl_meses_msi || '—')}
      ${row('Pago fijo MSI/mes', fmt(d.vl_pago_fijo_msi))}
      ${row('Tasa anual', d.vl_tasa_anual ? d.vl_tasa_anual + '%' : '—')}
      ${row('Pago real mensual', fmt(d.vl_pago_real))}
      ${row('Capacidad de pago bruta', fmt(d.vl_capacidad_pago))}
      ${row('Capacidad disponible (después de MSI)', fmt(capDisp))}
      ${row('Forma de pago habitual', d.vl_tipo_pago || '—')}
      ${row('Usa tarjeta activamente', d.vl_usa_tarjeta || '—')}
      ${row('Tipo de ingreso', d.vl_ingreso_tipo || '—')}
      ${row('Nivel de estrés', d.vl_estres ? d.vl_estres + '/10' : '—')}
    </table>
  </div>

  <!-- Operación -->
  <div style="padding:20px 28px;border-bottom:1px solid #F0EBE1">
    <p style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A09088;margin:0 0 10px">Operación del Diagnóstico</p>
    <div style="background:#F7F4EE;border-radius:8px;padding:14px 16px;font-family:monospace;font-size:12px;color:#6B5F58;line-height:1.9;white-space:pre-wrap">${
      d.vl_saldo_revolvente && d.vl_tasa_anual
        ? `tasa_mensual      = ${d.vl_tasa_anual}% ÷ 12 = ${(Number(d.vl_tasa_anual)/12).toFixed(3)}%
pago_fijo_msi     = ${d.vl_saldo_msi && d.vl_meses_msi ? `${fmt(d.vl_saldo_msi)} ÷ ${d.vl_meses_msi} meses = ${fmt(d.vl_pago_fijo_msi)}/mes` : 'no aplica (sin MSI)'}
capacidad_disp    = ${fmt(d.vl_capacidad_pago)} − ${fmt(d.vl_pago_fijo_msi)} = ${fmt(capDisp)}
costo_no_entender = ${fmt(d.vl_saldo_revolvente)} × ${(Number(d.vl_tasa_anual)/12/100).toFixed(5)} × 12 × 0.40 = ${fmt(d.vl_costo_oculto)}`
        : 'Datos extraídos de imagen — ver campos arriba'
    }</div>
  </div>

  <!-- Focos rojos -->
  <div style="padding:20px 28px;border-bottom:1px solid #F0EBE1">
    <p style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A09088;margin:0 0 10px">Focos Rojos Detectados</p>
    ${focos.length ? focos.map((f,i) => `
      <div style="background:#FDF5F2;border-left:3px solid #B5715A;border-radius:6px;padding:12px 14px;margin-bottom:8px">
        <p style="font-size:13px;font-weight:600;color:#3D3530;margin:0 0 3px">🔴 Foco ${i+1}</p>
        <p style="font-size:13px;color:#6B5F58;margin:0">${f}</p>
      </div>`).join('')
    : '<p style="color:#A09088;font-size:13px;margin:0">No disponibles</p>'}
  </div>

  <!-- Escenarios -->
  <div style="padding:20px 28px;border-bottom:1px solid #F0EBE1">
    <p style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A09088;margin:0 0 10px">Escenarios Proyectados</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48%" style="vertical-align:top;background:#F7F4EE;border-radius:8px;padding:14px">
          <p style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#A09088;margin:0 0 8px">Si todo sigue igual</p>
          <p style="font-size:13px;color:#6B5F58;margin:0 0 3px">Salida estimada</p>
          <p style="font-size:16px;font-weight:700;color:#3D3530;margin:0">${d.vl_meses_sin_cambio === 999 ? 'Deuda crece' : (d.vl_meses_sin_cambio ? d.vl_meses_sin_cambio + ' meses' : '—')}</p>
        </td>
        <td width="4%"></td>
        <td width="48%" style="vertical-align:top;background:#D0E4D3;border-radius:8px;padding:14px">
          <p style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#4A6B50;margin:0 0 8px">Con estrategia óptima</p>
          <p style="font-size:13px;color:#6B5F58;margin:0 0 3px">Ahorro potencial</p>
          <p style="font-size:16px;font-weight:700;color:#4A6B50;margin:0">${fmt(d.vl_ahorro_potencial)}</p>
        </td>
      </tr>
    </table>
  </div>

  <!-- Primera acción -->
  <div style="padding:20px 28px">
    <p style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A09088;margin:0 0 10px">Primera Acción Recomendada</p>
    <div style="background:#3D3530;border-radius:8px;padding:16px 18px">
      <p style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin:0 0 6px">Haz esto esta semana</p>
      <p style="font-size:13px;color:rgba(255,255,255,.8);line-height:1.65;margin:0">${d.vl_primera_accion || '—'}</p>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:16px 28px;text-align:center;background:#F7F4EE">
    <p style="font-size:11px;color:#A09088;margin:0">Generado en <strong>diagnostico.vive-ligero.com</strong> · Vive Ligero · Finanzas &amp; Bienestar</p>
  </div>

</div>
</body>
</html>`;

    // ── 5. Enviar email via Resend ────────────────────────────────────────
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from:    'Vive Ligero <onboarding@resend.dev>',
          to:      [ADMIN_EMAIL],
          subject: `📊 Nuevo diagnóstico — ${d.firstName || d.email} · Score ${d.vl_score} ${emoji} ${d.vl_diagnostico}`,
          html,
        })
      });
    }

    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
