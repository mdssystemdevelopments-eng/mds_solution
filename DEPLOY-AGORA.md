# Deploy quando Redeploy da Vercel falha

A mensagem *"Esta implantação não pode ser reimplantada"* é normal em deploys antigos.
**Não use Redeploy** nesses — use uma destas opções:

---

## Opção 1 — Deploy Hook (mais fácil)

1. Vercel → projeto → **Settings** → **Deploy Hooks**
2. **Create Hook** → Name: `production` → Branch: **`main`**
3. Copie a URL (ex.: `https://api.vercel.com/v1/integrations/deploy/prj_.../...`)
4. **Cole só a URL** no navegador e Enter  
   **OU** no PowerShell (substitua pela URL real):

```powershell
Invoke-WebRequest -Uri "https://api.vercel.com/v1/integrations/deploy/prj_SEU_ID/SEU_TOKEN" -Method POST
```

Resposta esperada: **StatusCode 201** e `"state":"PENDING"`.

5. **Deployments** → aguarde **Ready**
6. No log, confirme commit **3f0bd95** ou mais novo (não `c7d74d5`)

---

## Opção 2 — Novo commit no GitHub

```powershell
cd "c:\Users\Windows 10\Documents\Projeto_Geral_Arquivos\mds_soluçoes_digitais"
git commit --allow-empty -m "chore: trigger vercel deploy"
git push origin main
```

A Vercel faz deploy automático do último commit da `main`.

---

## Opção 3 — Terminal Vercel (ignora Git)

```powershell
cd "c:\Users\Windows 10\Documents\Projeto_Geral_Arquivos\mds_soluçoes_digitais"
npx vercel login
npx vercel deploy --prod
```

Sobe os arquivos do seu PC (inclui vídeos em `public/`).

---

## Teste final

- https://www.mdssolution.com.br/logo-anim.mp4
- https://www.mdssolution.com.br/wallpaper.mp4

Os dois devem abrir. Depois: home com **Ctrl+F5**.
