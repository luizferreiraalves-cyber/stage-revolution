export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor' });
    }

    const { characterA, characterB, scenario, language, safeMode } = req.body || {};

    if (!characterA || !characterA.trim()) {
      return res.status(400).json({ error: 'Personagem A é obrigatório' });
    }
    if (!characterB || !characterB.trim()) {
      return res.status(400).json({ error: 'Personagem B é obrigatório' });
    }

    const isNinja = scenario === 'ninja';
    const lang = language || 'English';
    const isSafeMode = safeMode === true;

    // ─── CHARACTER IDENTITY RULES ─────────────────────────────────────────────
    function characterIdentityRule(label, name, position) {
      if (isSafeMode) {
        // SAFE MODE: NO name cited — describe only iconic visual elements
        // Claude must infer appearance from the name but never write the name in the prompt
        return `- ${label}: a professional stunt performer whose costume is inspired by the character known as "${name}". DO NOT write the character's name anywhere in the image prompt. Instead, describe only the iconic visual elements of their costume: silhouette, dominant colors, key accessories, hair style, and any recognizable symbols or patterns — enough to make the character identifiable without naming them. No reference photo needed. Photorealistic human performer, not CGI.`;
      } else {
        // STANDARD MODE: cite name + reference photo as identity
        return `- ${label} (${name}): a professional stunt performer dressed as ${name}. The user may attach a reference photo for this character — if provided, use it as the complete identity reference for face, hair, costume, colors, and all visual details. If no photo is attached, infer the character's iconic visual appearance from your knowledge of "${name}". Photorealistic human performer, not CGI.`;
      }
    }

    // ─── IMAGE CAMERA RULE ────────────────────────────────────────────────────
    const imageCameraRule = isSafeMode
      ? `- CAMERA FOR IMAGE: ultra wide-angle shot from deep in the audience, phone held high above heads — performers appear small on a large stage, full stage environment dominates the frame, no facial details visible, audience silhouettes and raised phones fill the lower third of the frame. The distance makes individual costume details subtle.`
      : `- CAMERA FOR IMAGE: wide-angle shot from the audience, phone held above heads — full stage visible, both performers clearly visible from head to toe, audience heads and phones along the bottom edge of frame.`;

    // ─── SYSTEM PROMPT ────────────────────────────────────────────────────────
    const systemPrompt = `You are a prompt engineer specialized in generating viral "stage show" image-to-video sequences for AI image and video generators (ChatGPT Image, Seedance, Kling).

RULES YOU MUST FOLLOW EXACTLY:

1. CAMERA & FORMAT (always, no exceptions):
- POV handheld phone footage filmed from the audience at a live outdoor stage show
- Slight handheld shake, phone held up above heads
- Audience heads and raised phones visible only along the very bottom edge of frame
- The stage must remain FULLY visible at all times — never zoom in, never cut close
- Camera always remains at audience distance — wide shot throughout
- Bright daylight, photorealistic, ultra sharp, high resolution, 4K
${imageCameraRule}

2. SCENARIO:
${isNinja
    ? `- Classic ninja village stage: tiled Japanese roof, grey stone wall, clan banners, large white cloth with black kanji, wooden pole, forested green mountains in the background`
    : `- Use the names "${characterA}" and "${characterB}" as context clues. Infer each character's visual universe and iconic aesthetic elements from your knowledge. Then build a cohesive live-stage-show set design that fuses or blends both universes — architecture style, dominant colors, props, banners, atmospheric lighting — into a single stage environment that feels native to both. Keep the audience-POV outdoor format.`}

3. CHARACTERS:
${characterIdentityRule('Character A (left)', characterA, 'left')}
${characterIdentityRule('Character B (right)', characterB, 'right')}
- Maximum 2 characters per scene.
- Performers are in realistic cosplay/costume — no real weapons, all moves are stage choreography/martial arts/acrobatics with practical effects.
- Each character must inherit the lighting, shadows and color grading of the stage environment.
- Photorealistic live-action adaptation: performers must look like real professional actors/stunt performers in high-quality costumes on a real stage — not CGI, not 3D renders, not video-game characters.

4. POWERS / ACTIONS:
${isNinja
    ? `- Use classic ninja jutsu-style effects: clone jutsu, fire breath, water shield, dust burst, smoke summoning. Pick the ones that best fit the characters.`
    : `- Infer each character's powers and signature moves from their name and known universe. Use canonical abilities (energy blasts, elemental powers, signature techniques, etc.). If a character is obscure or fictional, create thematically fitting powers based on their name and implied world.`}

5. SAFE MODE NAMING RULE (critical — only applies when safe mode is active):
${isSafeMode
    ? `- SAFE MODE IS ACTIVE. The IMAGE prompt must NEVER mention any character name, franchise name, or IP name. Describe characters only through visual elements (colors, silhouette, accessories, hair).
- The 4 VIDEO prompts must also NEVER mention character names or franchise names. Refer to characters only as "the performer on the left" or "the performer on the right".`
    : `- The IMAGE prompt MAY reference character names normally.
- The 4 VIDEO prompts must NEVER mention character names or franchise names. Refer to characters only as "the performer on the left" or "the performer on the right".`}

6. SEQUENCE STRUCTURE — exactly 1 image + 4 videos:
- IMAGE: a freeze-frame moment right before the confrontation begins, both performers facing off, stage fully visible. Must start with the word "Photorealistic."
- VIDEO 1 (0-5s): physical stage combat — running, strikes, blocks, spinning kicks, ending in a synchronized clash with a burst of dust/effects
- VIDEO 2 (5-8s): first character's signature power/move triggers
- VIDEO 3: second character's signature power/move or counter-move
- VIDEO 4: closing beat — big finishing visual (explosion of effects/smoke/light)

7. VIDEO PROMPT RULES — MANDATORY FOR ALL 4 VIDEO PROMPTS:
Every single video prompt MUST follow this exact structure in this exact order:

[A] CAMERA LINE (mandatory first line):
"POV handheld phone from the audience, slight shake, camera tracking the action from a distance — wide shot, never zooming in, stage fully visible at all times."

[B] STAGE LINE (mandatory second line):
One sentence re-establishing the stage environment and atmosphere.

[C] CHARACTER POSITIONS (mandatory):
One sentence describing where each performer is at the start of this clip.

[D] ACTION:
Describe the motion — what moves, how fast, end state. 20-30 words max.

[E] QUALITY CLOSE:
End with: "Photorealistic, bright daylight, cinematic live performance."

A video prompt that does not follow this exact 5-part structure is invalid. All 4 video prompts must follow it without exception.

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

    // ─── CALL ANTHROPIC ───────────────────────────────────────────────────────
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
            content: `Generate the sequence now for Character A: ${characterA} and Character B: ${characterB}.`,
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
    let result = textBlock ? textBlock.text : '';

    if (!result) {
      return res.status(500).json({ error: 'A API não retornou texto' });
    }

    // ─── SAFETY NET: inject camera line if model skipped it ──────────────────
    const cameraLine = 'POV handheld phone from the audience, slight shake, camera tracking the action from a distance — wide shot, never zooming in, stage fully visible at all times.';
    result = result.replace(
      /(## 🎬 VIDEO PROMPT \d+:[^\n]*\n)([\s\S]*?)(?=\n## |\n*$)/g,
      (match, header, body) => {
        const trimmed = body.trim();
        if (!trimmed.startsWith('POV')) {
          return `${header}${cameraLine} ${trimmed}\n`;
        }
        return match;
      }
    );

    return res.status(200).json({ result, safeMode: isSafeMode });
  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).json({ error: err?.message || 'Erro interno no servidor' });
  }
}
