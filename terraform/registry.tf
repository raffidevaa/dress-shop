resource "google_artifact_registry_repository" "dress_shop_repo" {
  location      = var.region
  repository_id = "dress-shop"
  description   = "Docker repository for DRESS SHOP images"
  format        = "DOCKER"

  # cleanup_policy_dry_run = false
  # cleanup_policies {
  #  id     = "keep-minimum-versions"
  #  action = "KEEP"
  #  most_recent_versions {
  #    keep_count = 5
  #  }
  # }
}
