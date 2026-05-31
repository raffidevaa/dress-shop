output "load_balancer_ip" {
  description = "The static IP address of the load balancer"
  value       = google_compute_global_address.default.address
}
