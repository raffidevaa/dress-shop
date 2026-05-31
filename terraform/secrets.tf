resource "google_secret_manager_secret" "mongodb_uri" {
  secret_id = "DATABASE_URI"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "access" {
  secret_id = google_secret_manager_secret.mongodb_uri.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.project_number}-compute@developer.gserviceaccount.com"
}
