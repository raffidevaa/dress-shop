# Notification Channels
resource "google_monitoring_notification_channel" "discord" {
  for_each     = toset(["alerts", "errors", "uptime"])
  display_name = "Discord ${title(each.key)}"
  type         = "webhook_tokenauth"
  labels = {
    url = "https://${var.REGION}-${var.PROJECT_ID}.cloudfunctions.net/discord-bridge?channel=${each.key}"
  }
}

# Alert Policy for Cloud Run 5xx Errors
resource "google_monitoring_alert_policy" "cloud_run_5xx_errors" {
  display_name          = "Cloud Run High 5xx Errors"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.discord["errors"].id]

  conditions {
    display_name = "5xx Error Rate > 1%"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0.01
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }
}

# Alert Policy for Cloud Run Latency
resource "google_monitoring_alert_policy" "cloud_run_latency" {
  display_name          = "Cloud Run High Latency"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.discord["alerts"].id]

  conditions {
    display_name = "p95 Latency > 2s"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_latencies\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 2000
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_PERCENTILE_95"
      }
    }
  }
}

# Alert Policy for Cloud Run Memory Usage
resource "google_monitoring_alert_policy" "cloud_run_high_memory" {
  display_name          = "Cloud Run High Memory Usage"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.discord["alerts"].id]

  conditions {
    display_name = "Memory utilization > 85%"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/container/memory/utilizations\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0.85
      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_PERCENTILE_99"
      }
    }
  }
}

# Alert Policy for Cloud Run Container Restarts
# (Commented out because the metric doesn't exist until the first restart occurs)
/*
resource "google_monitoring_alert_policy" "cloud_run_crashes" {
  display_name          = "Cloud Run Container Restarts"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.discord["errors"].id]

  conditions {
    display_name = "Container restarts"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/container/restart_count\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_DELTA"
      }
    }
  }
}
*/

# Alert Policy for Cloud Run CPU Saturation
resource "google_monitoring_alert_policy" "cloud_run_cpu_saturation" {
  display_name          = "Cloud Run CPU Saturation"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.discord["alerts"].id]

  conditions {
    display_name = "CPU utilization > 80%"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/container/cpu/utilizations\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0.8
      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_PERCENTILE_99"
      }
    }
  }
}

# Uptime Check Resource
resource "google_monitoring_uptime_check_config" "https" {
  display_name = "dress-shop-uptime-check"
  timeout      = "10s"
  period       = "60s"
  http_check {
    path         = "/api/health"
    port         = "443"
    use_ssl      = true
    validate_ssl = true
  }
  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.PROJECT_ID
      host       = var.DOMAIN
    }
  }
}

# Alert Policy for Uptime
resource "google_monitoring_alert_policy" "uptime_fail" {
  display_name          = "Site Down Alert"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.discord["uptime"].id]

  conditions {
    display_name = "Uptime Check Failure"
    condition_threshold {
      filter          = "resource.type = \"uptime_url\" AND metric.type = \"monitoring.googleapis.com/uptime_check/check_passed\""
      duration        = "60s"
      comparison      = "COMPARISON_LT"
      threshold_value = 1
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_FRACTION_TRUE"
      }
    }
  }
}

# Note: The Cloud Function deployment is managed by the CI/CD pipeline (.github/workflows/cd.yaml).
