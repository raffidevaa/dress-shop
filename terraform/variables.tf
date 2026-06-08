variable "PROJECT_ID" {
  description = "The ID of the project to deploy to"
  type        = string
}

variable "REGION" {
  description = "The region to deploy to"
  type        = string
  default     = "asia-southeast1"
}

variable "PROJECT_NUMBER" {
  description = "The project number for IAM member assignments"
  type        = string
}

variable "DOMAIN" {
  description = "Domain name for SSL"
  type        = string
}

variable "STRIPE_SECRET_API_KEY" {
  description = "Stripe secret API key (server runtime)"
  type        = string
  sensitive   = true
}

variable "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" {
  description = "Stripe publishable key (client build-time)"
  type        = string
}

variable "DISCORD_WEBHOOK_ALERTS" {
  description = "Discord webhook URL for alerts (discord-bridge function)"
  type        = string
  sensitive   = true
}

variable "DISCORD_WEBHOOK_ERRORS" {
  description = "Discord webhook URL for errors (discord-bridge function)"
  type        = string
  sensitive   = true
}

variable "DISCORD_WEBHOOK_UPTIME" {
  description = "Discord webhook URL for uptime (discord-bridge function)"
  type        = string
  sensitive   = true
}

