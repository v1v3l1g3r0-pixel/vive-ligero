export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const apiKey    = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return res.status(500).json({ error: 'GHL no configurado' });
  }

  try {
    const d = req.body;

    // ── Paso 1: Buscar si el contacto ya existe por email ──────────────────
    const searchRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(d.email)}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        }
      }
    );
    const searchData = await searchRes.json();
    const existingId = searchData?.contact?.id || null;

    // ── Paso 2: Armar payload del contacto ─────────────────────────────────
    const contactPayload = {
      locationId,
      firstName:   d.firstName  || '',
      email:       d.email      || '',
      phone:       d.phone      || '',
      source:      'Diagnóstico Vive Ligero',
      tags:        d.tags       || [],
      customFields: [
        { key: 'vl_score',          field_value: String(d.vl_score          ?? '') },
        { key: 'vl_diagnostico',    field_value: String(d.vl_diagnostico    ?? '') },
        { key: 'vl_costo_oculto',   field_value: String(d.vl_costo_oculto   ?? '') },
        { key: 'vl_capacidad_pago', field_value: String(d.vl_capacidad_pago ?? '') },
        { key: 'vl_tipo_pago',      field_value: String(d.vl_tipo_pago      ?? '') },
        { key: 'vl_usa_tarjeta',    field_value: String(d.vl_usa_tarjeta    ?? '') },
        { key: 'vl_ingreso_tipo',   field_value: String(d.vl_ingreso_tipo   ?? '') },
        { key: 'vl_estres',         field_value: String(d.vl_estres         ?? '') },
        // Campos adicionales
        { key: 'vl_descripcion',          field_value: String(d.vl_descripcion          ?? '') },
        { key: 'vl_foco_1',               field_value: String(d.vl_foco_1               ?? '') },
        { key: 'vl_foco_2',               field_value: String(d.vl_foco_2               ?? '') },
        { key: 'vl_foco_3',               field_value: String(d.vl_foco_3               ?? '') },
        { key: 'vl_saldo_total',          field_value: String(d.vl_saldo_total          ?? '') },
        { key: 'vl_saldo_revolvente',     field_value: String(d.vl_saldo_revolvente     ?? '') },
        { key: 'vl_tasa_anual',           field_value: String(d.vl_tasa_anual           ?? '') },
        { key: 'vl_pago_real',            field_value: String(d.vl_pago_real            ?? '') },
        { key: 'vl_saldo_msi',            field_value: String(d.vl_saldo_msi            ?? '') },
        { key: 'vl_meses_msi',            field_value: String(d.vl_meses_msi            ?? '') },
        { key: 'vl_pago_fijo_msi',        field_value: String(d.vl_pago_fijo_msi        ?? '') },
        { key: 'vl_meses_sin_cambio',     field_value: String(d.vl_meses_sin_cambio     ?? '') },
        { key: 'vl_ahorro_potencial',     field_value: String(d.vl_ahorro_potencial     ?? '') },
        { key: 'vl_primera_accion',       field_value: String(d.vl_primera_accion       ?? '') },
      ].filter(f => f.field_value !== '' && f.field_value !== 'undefined')
    };

    // ── Paso 3: Crear o actualizar el contacto ─────────────────────────────
    let contactId;
    if (existingId) {
      // Actualizar contacto existente
      const updateRes = await fetch(
        `https://services.leadconnectorhq.com/contacts/${existingId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contactPayload)
        }
      );
      const updateData = await updateRes.json();
      contactId = updateData?.contact?.id || existingId;
    } else {
      // Crear contacto nuevo
      const createRes = await fetch(
        'https://services.leadconnectorhq.com/contacts/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contactPayload)
        }
      );
      const createData = await createRes.json();
      contactId = createData?.contact?.id;
    }

    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('GHL API error:', err);
    return res.status(500).json({ error: 'Error al guardar en GHL', detail: err.message });
  }
}
