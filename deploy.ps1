# PepiTalk 一键推送部署脚本
# 用法: .\deploy.ps1 "提交说明"
# 示例: .\deploy.ps1 "修复聊天界面样式"

param(
    [string]$Message = "update: auto deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PepiTalk Deploy Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 清除代理（如果本地代理未运行会导致 push 失败）
$env:http_proxy = ""
$env:https_proxy = ""
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""

# Step 1: Git add + commit
Write-Host "[1/3] Staging changes..." -ForegroundColor Yellow
git add -A

$status = git status --porcelain
if (-not $status) {
    Write-Host "  No changes to commit. Skipping..." -ForegroundColor Gray
} else {
    Write-Host "[2/3] Committing: $Message" -ForegroundColor Yellow
    git commit -m "$Message"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Commit failed!" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Push to GitHub
Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
git -c http.proxy="" -c https.proxy="" push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Push failed! Check network or auth." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deploy complete!" -ForegroundColor Green
Write-Host "  GitHub: https://github.com/lxrtc888/pepitalk-" -ForegroundColor Green
Write-Host "  Cloudflare Pages will auto-deploy." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
