# Notification Channels
resource "google_monitoring_notification_channel" "discord" {
  for_each     = toset(["alerts", "errors", "uptime"])
  display_name = "Discord ${title(each.key)}"
  type         = "webhook_tokenauth"
  labels = {
    url = "https://${var.REGION}-${var.PROJECT_ID}.cloudfunctions.net/discord-bridge?channel=${each.key}"
  }
}

