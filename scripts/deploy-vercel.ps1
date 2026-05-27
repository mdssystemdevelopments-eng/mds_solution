# Deploy direto na Vercel (ignora bloqueio de autor do commit no GitHub)
# Uso: .\scripts\deploy-vercel.ps1

Set-Location $PSScriptRoot\..

Write-Host "=== Deploy MDS -> Vercel (Producao) ===" -ForegroundColor Cyan
Write-Host "1. Faca login com a conta TITULAR da Vercel quando o navegador abrir."
Write-Host "2. Escolha o projeto mds-solution se perguntar."
Write-Host ""

npx vercel deploy --prod --yes

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Deploy concluido. Teste:" -ForegroundColor Green
  Write-Host "  https://www.mdssolution.com.br/logo-anim.mp4"
  Write-Host "  https://www.mdssolution.com.br/wallpaper.mp4"
} else {
  Write-Host "Deploy falhou. Tente: npx vercel login" -ForegroundColor Yellow
}
