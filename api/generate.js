export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor' });
    }

    const { characterA, characterB, scenario, language } = req.body || {};

    if (!characterA || !characterA.trim()) {
      return res.status(400).json({ error: 'Personagem A é obrigatório' });
    }
    if (!characterB || !characterB.trim()) {
      return res.status(400).json({ error: 'Personagem B é obrigatório' });
    }

    const isNinja = scenario === 'ninja';
    const lang = language || 'English';

    function characterIdentityRule(label, name, uploadOrder) {
      const refText = uploadOrder === 1
        ? 'the first uploaded reference image'
        : 'the second uploaded reference image';
      return `- ${label} (${name}): appearance defined entirely by ${refText}. Do NOT write any visual description of this character — no face description, no hair description, no outfit description, no colors. Only instruct the image generator to use ${refText} as the complete identity reference for this character. The image generator will read the photo directly.`;
    }

    const systemPrompt = `You are a prompt engineer specialized in generating viral "stage show" image-to-video sequences for AI image and video generators (ChatGPT Image, Nano Banana, Seedance, Kling).

RULES YOU MUST FOLLOW EXACTLY:

1. CAMERA & FORMAT (always, no exceptions):
- POV handheld phone footage filmed from the audience at a live outdoor stage
