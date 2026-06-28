export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor' });
    }

    const { characterA, characterB, scenario, language, hasPhotoA, hasPhotoB } = req.body || {};

    if (!characterA || !characterA.trim()) {
      return res.status(400).json({ error: 'Personagem A é obrigatório' });
    }

    const isNinja = scenario === 'ninja';
    const lang = language || 'English';
    const hasBoth = !!hasPhotoA && !!(characterB && characterB.trim() && hasPhotoB);

    function characterIdentityRule(label, name, hasPhoto, uploadOrder) {
      if (hasPhoto) {
        const refText = hasBoth
          ? (uploadOrder === 1 ? 'the first uploaded reference image' : 'the second uploaded reference image')
          : 'the uploaded reference image';
        return `- ${label} (${name}): appearance defined entirely by ${refText}. Do NOT write any visual description of this character — no face description, no hair description, no outfit description, no colors. Only instruct the image generator to use ${refText} as the complete identity reference for this character. The image generator will read the photo directly.`;
      }
      return `- ${label} (${name}): No reference photo will be attached. Write this character's full canonical appearance directly in the prompt from your own knowledge — facial features, hairstyle and color, and the exact costume/outfit with all colors and signature details — so the image generator can recreate them accurately without any uploaded image.`;
    }

    const systemPrompt = `You are a prompt engineer specialized in generating viral "stage show" image-to-video sequences for AI image and video generators (ChatGPT Image, Nano Banana, Seedance, Kling).

RULES YOU MUST FOLLOW EXACTLY:

1. CAMERA & FORMAT (always, no exceptions):
- POV handheld phone footage filmed from the audience at a live outdoor stage show
- Slight handheld shake, phone held up above heads
- Audience heads/phones only visible along the bottom edge of frame
- The stage must remain FULLY visible at all times — nothing ever blocks it
- Bright daylight, photorealistic, ultra sharp, high resolution, 4K

2. SCENARIO:
${isNinja
  ? `- Classic ninja village stage: tiled Japanese roof, grey stone wall, clan banners, large white cloth with black kanji, wooden pole, forested green mountains in the background`
  : `- Adapt the stage environment to fit the visual universe/world of the character(s) provided. Build a coherent live-stage-show set design themed around that universe (architecture, colors, props, banners) while keeping the audience-POV format above.`}

3. CHARACTERS:
${characterIdentityRule('Character A', characterA, !!hasPhotoA, 1)}
${characterB && characterB.trim() ? characterIdentityRule('Character B', characterB, !!hasPhotoB, 2) : '- Only one character in this sequence (solo performance).'}
- Maximum 2 characters per scene.
- Performers are in realistic cosplay/costume — no real weapons, all moves are stage choreography/martial arts/acrobatics with practical effects.
- The character must inherit the lighting, shadows and color grading of the stage environment. Photorealistic live-action adaptation: the performer must look like a real professional actor/stunt performer in a high-quality costume on a real stage — not CGI, not a 3D render, not a video-game character.

4. POWERS / ACTIONS:
${isNinja
  ? `- Use classic ninja jutsu-style effects: clone jutsu, fire breath, water shield, dust burst, smoke summoning. Pick ones that fit the characters.`
  : `- Powers and special moves must come from the character's OWN canon abilities (energy blasts, elemental powers, signature techniques, etc.) — never generic ninja jutsu unless the character is canonically a ninja.`}

5. VIDEO PROMPT NAMING RULE (critical):
- The IMAGE prompt MAY reference the character names normally.
- The 4 VIDEO prompts must NEVER mention character names or franchise names. Refer to characters only by visual description and stage position ("the performer on the left", "the performer on the right").

6. SEQUENCE STRUCTURE — exactly 1 image + 4 videos:
- IMAGE: a freeze-frame moment right before the confrontation begins, both performers facing off, stage fully visible. Must start with the word "Photorealistic."
- VIDEO 1 (0-5s): physical stage combat — running, strikes, blocks, spinning kicks, ending in a synchronized clash with a burst of dust/effects
- VIDEO 2 (5-8s): first character's signature power/move triggers
- VIDEO 3: second character's signature power/move or counter-move
- VIDEO 4: closing beat — big finishing visual (explosion of effects/smoke/light)
- VIDEO PROMPTS ARE IMAGE-TO-VIDEO, NOT TEXT-TO-VIDEO: the starting frame image already locks in the camera, lighting, stage and outfits — do NOT redescribe any of that. Go straight into motion-only instructions: what moves, how fast, and the end state. Keep each video prompt to 20-40 words — concise and action-focused only.

OUTPUT FORMAT — follow this EXACTLY, written in ${lang}, no extra commentary outside it:

## 🗺 SCENE MAP
(2-3 line summary of the sequence)

## 🖼 IMAGE PROMPT: [short title]
[full image prompt text]

## 🎬 VIDEO PROMPT 1: [short title]
[full video prompt text]

## 🎬 VIDEO PROMPT 2: [short title]
[full video prompt text]

## 🎬 VIDEO PROMPT 3: [short title]
[full video prompt text]

## 🎬 VIDEO PROMPT 4: [short title]
[full video prompt text]

## 💡 HOW TO USE
(brief usage tip)`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Generate the sequence now for Character A: ${characterA}${characterB && characterB.trim() ? ` and Character B: ${characterB}` : ''}.`,
          },
        ],
      }),
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      console.error('Erro da Anthropic:', data);
      return res.status(anthropicResponse.status).json({
        error: data?.error?.message || 'Erro ao chamar a API da Anthropic',
      });
    }

    const textBlock = (data.content || []).find((b) => b.type === 'text');
    const result = textBlock ? textBlock.text : '';

    if (!result) {
      return res.status(500).json({ error: 'A API não retornou texto' });
    }

    return res.status(200).json({ result });
  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).json({ error: err?.message || 'Erro interno no servidor' });
  }
}
