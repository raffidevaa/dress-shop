# IP Statis Global
resource "google_compute_global_address" "default" {
  name = "dress-shop-static-ip"
}

# Serverless NEG for Client (Cloud Run)
resource "google_compute_region_network_endpoint_group" "client_neg" {
  name                  = "client-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = "dress-shop-client"
  }
}

# Serverless NEG for Server (Cloud Run)
resource "google_compute_region_network_endpoint_group" "server_neg" {
  name                  = "server-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = "dress-shop-server"
  }
}

# URL Map (Routing Logic)
resource "google_compute_url_map" "default" {
  name            = "dress-shop-url-map"
  default_service = google_compute_backend_service.client_backend.id

  host_rule {
    hosts        = ["*"]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_service.client_backend.id

    path_rule {
      paths   = ["/api/*"]
      service = google_compute_backend_service.server_backend.id
    }
  }
}

# Backend Services
resource "google_compute_backend_service" "client_backend" {
  name        = "client-backend"
  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30
  backend {
    group = google_compute_region_network_endpoint_group.client_neg.id
  }
}

resource "google_compute_backend_service" "server_backend" {
  name        = "server-backend"
  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30
  backend {
    group = google_compute_region_network_endpoint_group.server_neg.id
  }
}

# HTTP Proxy 
resource "google_compute_target_http_proxy" "default" {
  name    = "dress-shop-http-proxy"
  url_map = google_compute_url_map.default.id
}

# Forwarding Rule
resource "google_compute_global_forwarding_rule" "default" {
  name       = "dress-shop-forwarding-rule"
  target     = google_compute_target_http_proxy.default.id
  port_range = "80"
  ip_address = google_compute_global_address.default.address
}
