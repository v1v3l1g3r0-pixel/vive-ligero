// ============================================================
// Endpoint de setup — llamar UNA SOLA VEZ para crear campos en GHL
// Visita: https://diagnostico.vive-ligero.com/api/setup-ghl
// Después de usarlo, puedes eliminarlo de tu repo si quieres
// ============================================================

export default async function handler(req, res) {
  const apiKey     = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return res.status(500).json({ error: 'Variables de entorno GHL_API_KEY y GHL_LOCATION_ID no configuradas' });
  }

  const CAMPOS = [
    // ── Ya existentes (se saltarán si existen) ──
    { name: 'VL Score',          dataType: 'NUMERICAL', key: 'vl_score' },
    { name: 'VL Diagnóstico',    dataType: 'TEXT',      key: 'vl_diagnostico' },
    { name: 'VL Costo Oculto',   dataType: 'NUMERICAL', key: 'vl_costo_oculto' },
    { name: 'VL Capacidad Pago', dataType: 'NUMERICAL', key: 'vl_capacidad_pago' },
    { name: 'VL Tipo Pago',      dataType: 'TEXT',      key: 'vl_tipo_pago' },
    { name: 'VL Usa Tarjeta',    dataType: 'TEXT',      key: 'vl_usa_tarjeta' },
    { name: 'VL Ingreso Tipo',   dataType: 'TEXT',      key: 'vl_ingreso_tipo' },
    { name: 'VL Estrés',         dataType: 'NUMERICAL', key: 'vl_estres' },
    // ── Nuevos ──
    { name: 'VL Descripción',        dataType: 'TEXT',      key: 'vl_descripcion' },
    { name: 'VL Foco 1',             dataType: 'TEXT',      key: 'vl_foco_1' },
    { name: 'VL Foco 2',             dataType: 'TEXT',      key: 'vl_foco_2' },
    { name: 'VL Foco 3',             dataType: 'TEXT',      key: 'vl_foco_3' },
    { name: 'VL Saldo Total',        dataType: 'NUMERICAL', key: 'vl_saldo_total' },
    { name: 'VL Saldo Revolvente',   dataType: 'NUMERICAL', key: 'vl_saldo_revolvente' },
    { name: 'VL Tasa Anual',         dataType: 'NUMERICAL', key: 'vl_tasa_anual' },
    { name: 'VL Pago Real',          dataType: 'NUMERICAL', key: 'vl_pago_real' },
    { name: 'VL Saldo MSI',          dataType: 'NUMERICAL', key: 'vl_saldo_msi' },
    { name: 'VL Meses MSI',          dataType: 'NUMERICAL', key: 'vl_meses_msi' },
    { name: 'VL Pago Fijo MSI',      dataType: 'NUMERICAL', key: 'vl_pago_fijo_msi' },
    { name: 'VL Meses Sin Cambio',   dataType: 'NUMERICAL', key: 'vl_meses_sin_cambio' },
    { name: 'VL Ahorro Potencial',   dataType: 'NUMERICAL', key: 'vl_ahorro_potencial' },
    { name: 'VL Primera Acción',     dataType: 'TEXT',      key: 'vl_primera_accion' },
  ];

  const resultados = [];

  for (const campo of CAMPOS) {
    try {
      const r = await fetch(
        `https://services.leadconnectorhq.com/locations/${locationId}/customFields`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name:     campo.name,
            dataType: campo.dataType,
            model:    'contact'
          })
        }
      );
      const data = await r.json();

      if (r.ok) {
        resultados.push({ key: campo.key, status: '✅ creado', id: data?.customField?.id });
      } else if (r.status === 422 || data?.message?.toLowerCase().includes('exist')) {
        resultados.push({ key: campo.key, status: '⏭️ ya existía' });
      } else {
        resultados.push({ key: campo.key, status: `❌ error: ${data?.message || r.status}` });
      }
    } catch (e) {
      resultados.push({ key: campo.key, status: `❌ excepción: ${e.message}` });
    }

    // Pausa entre llamadas para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  const creados   = resultados.filter(r => r.status.startsWith('✅')).length;
  const existian  = resultados.filter(r => r.status.startsWith('⏭️')).length;
  const errores   = resultados.filter(r => r.status.startsWith('❌')).length;

  return res.status(200).json({
    resumen: `${creados} creados · ${existian} ya existían · ${errores} errores`,
    detalle: resultados
  });
}
