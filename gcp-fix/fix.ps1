# 🐼 TuanTuan Supreme GCP One-Click Fixer (PowerShell Version)
# Run this in your local PowerShell if you have Google Cloud SDK installed and are logged in as Owner.

$PROJECT_ID = "tuantuanbot-28647"
$SA_EMAIL = "firebase-adminsdk-fbsvc@tuantuanbot-28647.iam.gserviceaccount.com"

Write-Host "🎯 Targeting Project: $PROJECT_ID" -ForegroundColor Cyan
gcloud config set project "$PROJECT_ID"

$roles = @(
  "roles/serviceusage.serviceUsageAdmin",
  "roles/run.admin",
  "roles/artifactregistry.admin",
  "roles/cloudbuild.builds.editor",
  "roles/storage.admin",
  "roles/iam.serviceAccountUser"
)

Write-Host "🚀 Injecting Supreme Roles into SA: $SA_EMAIL..." -ForegroundColor Green
foreach ($role in $roles) {
    gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="$role" --quiet
}

Write-Host "💡 Powering on all Cloud Services..." -ForegroundColor Yellow
gcloud services enable artifactregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com iam.googleapis.com secretmanager.googleapis.com

Write-Host "✨ DONE! Your cloud is now fully operational. Please re-run GitHub Actions. 🍡🐾" -ForegroundColor Green
