export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor' });
    }

    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt não enviado' });
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      console.error('Erro da Anthropic:', data);
      return res.status(anthropicResponse.status).json({
        error: data?.error?.message || 'Erro ao chamar a API da Anthropic',
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).json({ error: err?.message || 'Erro interno no servidor' });
  }
}
