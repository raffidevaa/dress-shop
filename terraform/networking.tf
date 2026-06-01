# Google-managed SSL Certificate
resource "google_compute_managed_ssl_certificate" "default" {
  name = "dress-shop-cert"
  managed {
    domains = [var.DOMAIN]
  }
}

# Serverless NEG for Client
resource "google_compute_region_network_endpoint_group" "client_neg" {
  name                  = "client-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.REGION
  cloud_run {
    service = "dress-shop-client"
  }
}

# Serverless NEG for Server
resource "google_compute_region_network_endpoint_group" "server_neg" {
  name                  = "server-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.REGION
  cloud_run {
    service = "dress-shop-server"
  }
}

# Backend Service
resource "google_compute_backend_service" "client_backend" {
  name     = "client-backend"
  protocol = "HTTP"
  backend {
    group = google_compute_region_network_endpoint_group.client_neg.id
  }
}

resource "google_compute_backend_service" "server_backend" {
  name     = "server-backend"
  protocol = "HTTP"
  backend {
    group = google_compute_region_network_endpoint_group.server_neg.id
  }
}

# URL Map (Routing: /api -> server, else -> client)
resource "google_compute_url_map" "url_map" {
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
      paths   = ["/api", "/api/*"]
      service = google_compute_backend_service.server_backend.id
    }
  }
}

# HTTP Proxy & Forwarding Rule
resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "dress-shop-https-proxy"
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

resource "google_compute_global_forwarding_rule" "default" {
  name       = "dress-shop-forwarding-rule"
  target     = google_compute_target_https_proxy.https_proxy.id
  port_range = "443"
}
