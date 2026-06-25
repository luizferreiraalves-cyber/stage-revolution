export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.json()
    const { characterA, characterB, scenario, language } = body

    if (!characterA) {
      return new Response(JSON.stringify({ error: 'characterA is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const scenarioDesc = scenario === 'ninja'
      ? 'NINJA CLASSIC: Hidden ninja village, tiled Japanese roof building, grey stone walls, clan banners, large white cloth with black kanji 忍, forested green mountains, bright sunny daylight'
      : 'UNIVERSE STAGE: Adapt the environment to match the characters universe and world'

    const userMessage = `Generate a STAGE REVOLUTION viral prompt sequence.

Character A (left): ${characterA}
Character B (right): ${characterB || 'none — solo performance'}
Scenario: ${scenarioDesc}
Output language: ${language || 'Portuguese (Brazilian)'}

Generate exactly:
1. A SCENE MAP table with 5 scenes
2. One IMAGE PROMPT for Scene 1 (confrontation standoff)
3. Four VIDEO PROMPTS for Scenes 2-5 (one per action)

IMAGE PROMPT rules:
- Start with "Photorealistic."
- POV handheld phone from third row, held above head, slight shake
- Audience heads only at very bottom edge, never blocking stage
- Stage fully visible at all times
- Character A on LEFT, Character B on RIGHT
- Capture moment BEFORE power release (tension)
- If reference images attached: ignore background, extract character only, convert cartoon to live-action
- No real weapons, props and visual effects only
- Environment matches the chosen scenario

VIDEO PROMPT rules:
- NEVER use character names, franchise names, or IP names
- Reference only by position: "the performer on the left" / "the performer on the right"
- Describe appearance by visual traits only (costume color, hair, silhouette)
- Structure: 0-5s physical combat ending with synchronized collision and dust burst; 5-8s signature power release described visually without naming it
- Handheld phone camera, slight shake, zoom toward action peaks
- Each video continues from its corresponding image

Use this exact output format:

---
## 🗺 SCENE MAP

| Cena | Imagem | Vídeo |
|------|--------|-------|
| 1 | Confronto Inicial | — |
| 2 | — | [nome da ação] |
| 3 | — | [nome da ação] |
| 4 | — | [nome da ação] |
| 5 | — | [nome da ação] |

---
## 🖼 PROMPT DE IMAGEM — Cena 1: Confronto Inicial

[prompt completo aqui]

---
## 🎬 PROMPT DE VÍDEO — Cena 2: [Nome da Ação]

[prompt completo aqui]

---
## 🎬 PROMPT DE VÍDEO — Cena 3: [Nome da Ação]

[prompt completo aqui]

---
## 🎬 PROMPT DE VÍDEO — Cena 4: [Nome da Ação]

[prompt completo aqui]

---
## 🎬 PROMPT DE VÍDEO — Cena 5: [Nome da Ação]

[prompt completo aqui]`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        messages: [{ role: 'user', content: userMessage }]
      })
    })

    const responseText = await response.text()

    if (!response.ok) {
      let errMsg = responseText
      try { errMsg = JSON.parse(responseText)?.error?.message || responseText } catch {}
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid response from Claude API' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const text = data.content?.[0]?.text || ''

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
