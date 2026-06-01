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

