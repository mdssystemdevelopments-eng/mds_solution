# Vídeos não aparecem no site

## ATENÇÃO: deploy do commit errado

Se o log da Vercel mostrar:

`Cloning ... (Commit: c7d74d5)`

esse commit **NÃO tem** os arquivos `logo-anim.mp4` nem `wallpaper.mp4`.

Use um destes commits na branch `main`:

- `3f0bd95` — fix: incluir vídeos MP4 em produção
- `2170c96` ou mais recente

Na Vercel → **Deployments** → escolha deploy com commit **`3f0bd95` ou mais novo** → **Redeploy**,  
ou **Deploy Hook** na branch `main` (pega o último commit automaticamente).

---

# Vídeos não aparecem no site (Vercel bloqueia Redeploy)

O site no ar **não tem** os arquivos `logo-anim.mp4` e `wallpaper.mp4` porque o deploy com esses arquivos **nunca foi publicado** (bloqueio do autor do commit).

## Solução A — Deploy pelo terminal (recomendado, 5 min)

Na pasta do projeto, com a **conta titular** da Vercel:

```powershell
cd "c:\Users\Windows 10\Documents\Projeto_Geral_Arquivos\mds_soluçoes_digitais"
.\scripts\deploy-vercel.ps1
```

Ou:

```powershell
npx vercel login
npx vercel deploy --prod
```

Isso envia os arquivos do seu PC (incluindo os vídeos) **sem** verificar quem fez o commit no GitHub.

---

## Solução B — Gancho de deploy (Deploy Hook)

1. Vercel → projeto → **Settings** → **Deploy Hooks**
2. **Create Hook** → nome: `production` → branch: `main` → **Create**
3. Copie a URL (ex.: `https://api.vercel.com/v1/integrations/deploy/...`)
4. Abra essa URL no navegador **ou** no PowerShell:

```powershell
Invoke-WebRequest -Uri "COLE_A_URL_DO_HOOK_AQUI" -Method POST
```

Aguarde o build terminar e teste os links dos MP4.

---

## Solução C — Desligar proteção de autor (equipe)

1. Vercel → **Team Settings** (não só do projeto)
2. **Security** → **Deployment Protection**
3. Desative regra que exige **commit author na equipe** (ou marque MathiasDevSystem como confiável)
4. Tente **Redeploy** de novo

---

## Depois que funcionar

Teste em aba anônima:

- https://www.mdssolution.com.br/logo-anim.mp4
- https://www.mdssolution.com.br/wallpaper.mp4

Os dois devem **abrir/baixar**. Depois: home com **Ctrl+F5**.

---

## Se o wallpaper (32 MB) falhar no build

Use só a imagem de fundo (já existe) ou hospede o vídeo grande em URL externa e na Vercel defina:

`NEXT_PUBLIC_WALLPAPER_VIDEO_URL` = URL pública do vídeo
