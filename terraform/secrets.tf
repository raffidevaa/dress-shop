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

# Secret Manager for Staging Database URI
resource "google_secret_manager_secret" "mongodb_uri_staging" {
  secret_id = "DATABASE_URI_STAGING"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "mongodb_uri_staging_access" {
  secret_id = google_secret_manager_secret.mongodb_uri_staging.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
}

# Secret Manager for Staging Next.js API URL
resource "google_secret_manager_secret" "api_url_staging" {
  secret_id = "NEXT_PUBLIC_API_URL_STAGING"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "api_url_staging_access" {
  secret_id = google_secret_manager_secret.api_url_staging.id
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

resource "google_secret_manager_secret_version" "discord_webhooks" {
  for_each = {
    alerts = var.DISCORD_WEBHOOK_ALERTS
    errors = var.DISCORD_WEBHOOK_ERRORS
    uptime = var.DISCORD_WEBHOOK_UPTIME
  }
  secret      = google_secret_manager_secret.discord_webhooks[each.key].id
  secret_data = each.value
}

# Secret Manager for Stripe Secret API Key (server runtime)
resource "google_secret_manager_secret" "stripe_secret_api_key" {
  secret_id = "STRIPE_SECRET_API_KEY"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "stripe_secret_api_key_access" {
  secret_id = google_secret_manager_secret.stripe_secret_api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_version" "stripe_secret_api_key" {
  secret      = google_secret_manager_secret.stripe_secret_api_key.id
  secret_data = var.STRIPE_SECRET_API_KEY
}

# Secret Manager for Stripe Publishable Key (client build-time)
resource "google_secret_manager_secret" "stripe_publishable_key" {
  secret_id = "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "stripe_publishable_key_access" {
  secret_id = google_secret_manager_secret.stripe_publishable_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_version" "stripe_publishable_key" {
  secret      = google_secret_manager_secret.stripe_publishable_key.id
  secret_data = var.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}

# Secret Manager for Google OAuth
resource "google_secret_manager_secret" "google_secrets" {
  for_each  = toset(["web_client_id", "client_secret"])
  secret_id = "GOOGLE_${upper(each.key)}"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "google_access" {
  for_each  = toset(["web_client_id", "client_secret"])
  secret_id = google_secret_manager_secret.google_secrets[each.key].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
}
