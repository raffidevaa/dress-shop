# Secret Manager for Database URI
resource "google_secret_manager_secret" "mongodb_uri" {
  secret_id = "DATABASE_URI"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "access" {
  secret_id = google_secret_manager_secret.mongodb_uri.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
}

# Secret Manager for Next.js API URL
resource "google_secret_manager_secret" "api_url" {
  secret_id = "NEXT_PUBLIC_API_URL"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "api_url_access" {
  secret_id = google_secret_manager_secret.api_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
}

# Secret Manager for Discord Webhook URLs
resource "google_secret_manager_secret" "discord_webhooks" {
  for_each  = toset(["alerts", "errors", "uptime"])
  secret_id = "DISCORD_WEBHOOK_${upper(each.key)}"
  replication {
    auto {}
  }
}
