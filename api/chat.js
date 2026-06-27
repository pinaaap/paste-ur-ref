// Proxy serverless para la API de Anthropic.
// La key vive solo aquí (variable de entorno ANTHROPIC_API_KEY en Vercel),
// nunca en el navegador. Así los visitantes no necesitan su propia key.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Método no permitido' } });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: { message: 'Falta la variable ANTHROPIC_API_KEY en el servidor.' }
    });
  }

  try {
    const { system, messages, max_tokens, model } = req.body || {};

    // Protección básica contra abuso: límite de tamaño de entrada
    const inputLen = JSON.stringify(messages || '').length + (system || '').length;
    if (inputLen > 24000) {
      return res.status(413).json({
        error: { message: 'El texto es demasiado largo. Acórtalo e inténtalo de nuevo.' }
      });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: { message: 'Petición inválida.' } });
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-6',
        max_tokens: Math.min(Number(max_tokens) || 1500, 2000),
        system: system || '',
        messages
      })
    });

    const data = await upstream.json();
    // Devolvemos la respuesta de Anthropic tal cual para que el frontend la procese igual
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: { message: e?.message || 'Error en el servidor.' } });
  }
}
