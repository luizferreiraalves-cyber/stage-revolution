# STAGE REVOLUTION

Gerador de prompts virais para sequências de imagem + vídeo com personagens em shows de palco ao vivo.

## Deploy no Vercel

### 1. Suba para o GitHub
```bash
git init
git add .
git commit -m "STAGE REVOLUTION v1"
git remote add origin https://github.com/luiz-dktube-projects/stage-revolution.git
git push -u origin main
```

### 2. Importe no Vercel
- Acesse vercel.com → Add New Project
- Selecione o repositório `stage-revolution`
- Framework: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. Configure a variável de ambiente
Em Settings → Environment Variables:
```
ANTHROPIC_API_KEY = sua_chave_aqui
```

### 4. Deploy
Clique em Deploy. Pronto.

## Estrutura
```
stage-revolution/
├── api/
│   └── generate.js        # Serverless function → Claude API
├── src/
│   ├── App.jsx            # UI completa
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Como usar
1. Digite o nome dos personagens (A e B)
2. Escolha o cenário
3. Clique em Gerar Prompts
4. Copie o prompt de imagem → cole no ChatGPT Image ou Nano Banana + anexe suas imagens de referência
5. Use os 4 prompts de vídeo no Seedance ou Kling
