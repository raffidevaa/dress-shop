terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  backend "gcs" {
    bucket = "dress-shop-tf-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.PROJECT_ID
  region  = var.REGION
}
