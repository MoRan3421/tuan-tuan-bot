#!/bin/bash
# 🐼 TuanTuan Supreme GCP One-Click Fixer (Bash Version)
# Run this inside Google Cloud Shell or any Linux/Mac environment with gcloud logged in as Owner.

PROJECT_ID="tuantuanbot-28647"
SA_EMAIL="firebase-adminsdk-fbsvc@tuantuanbot-28647.iam.gserviceaccount.com"

echo "🎯 Targeting Project: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

roles=(
  "roles/serviceusage.serviceUsageAdmin"
  "roles/run.admin"
  "roles/artifactregistry.admin"
  "roles/cloudbuild.builds.editor"
  "roles/storage.admin"
  "roles/iam.serviceAccountUser"
)

echo "🚀 Injecting Supreme Roles into SA: $SA_EMAIL..."
for role in "${roles[@]}"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="${role}" --quiet
done

echo "💡 Powering on all Cloud Services..."
gcloud services enable artifactregistry.googleapis.com \
                        run.googleapis.com \
                        cloudbuild.googleapis.com \
                        iam.googleapis.com \
                        secretmanager.googleapis.com

echo "✨ DONE! Your cloud is now fully operational. Please re-run GitHub Actions. 🍡🐾"
