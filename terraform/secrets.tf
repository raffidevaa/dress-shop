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
