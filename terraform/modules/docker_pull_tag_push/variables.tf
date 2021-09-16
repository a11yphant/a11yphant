variable "source_image" {
  type = string
}

variable "source_provider" {
  type     = string
  required = false
  default  = "docker"
}

variable "target_image" {
  type = string
}

variable "target_provider" {
  type     = string
  required = false
  default  = "docker"
}