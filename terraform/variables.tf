variable "project_id" {
  description = "The ID of the project to deploy to"
  type        = string
}

variable "region" {
  description = "The region to deploy to"
  type        = string
  default     = "asia-southeast2"
}

variable "project_number" {
  description = "The project number for IAM member assignments"
  type        = string
}
