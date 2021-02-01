variable "current_version" {
  type = string
}

variable "postgres_cluster_root_user" {
  type = string
}

variable "postgres_cluster_root_password" {
  type = string
}

variable "postgres_cluster_database_name" {
  type    = string
  default = "a11y-challenges"
}