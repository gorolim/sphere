param (
    [string]$CommitMessage = "chore: zero-friction automated deployment"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   ZERO-FRICTION DEPLOYMENT WORKFLOW      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Sync Code to GitHub
Write-Host "`n[1/3] Syncing Code to GitHub..." -ForegroundColor Yellow
git add .
git commit -m $CommitMessage
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "Git push failed or nothing to commit. Continuing to Railway Deploy..." -ForegroundColor DarkGray
}

# 2. Force Deploy Frontend (daring-enthusiasm) bypassing GitHub cache
Write-Host "`n[2/3] Bypassing Cache: Uploading Frontend (daring-enthusiasm)..." -ForegroundColor Yellow
npx @railway/cli up --service daring-enthusiasm --detach

# 3. Force Deploy Backend (devoted-love) bypassing GitHub cache
Write-Host "`n[3/3] Bypassing Cache: Uploading Nova Agent (devoted-love)..." -ForegroundColor Yellow
Set-Location -Path "nova-agent"
npx @railway/cli up --service devoted-love --detach
Set-Location -Path ".."

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host " DEPLOYMENTS INITIATED SUCCESSFULLY!      " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Railway is now building exactly what is on your local machine."
Write-Host "Watch the Railway UI to see the green checkmarks."
