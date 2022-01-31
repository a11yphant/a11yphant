variable "postgres_cluster_database_name" {
  type    = string
  default = "a11ychallenges"
}

variable "gitlab_ci_registery_user" {
  type = string
}

variable "gitlab_ci_registry_password" {
  type = string
}

variable "heroku_registry_user" {
  type    = string
  default = "_"
}

variable "heroku_registry_password" {
  type = string
}

variable "docker_tag" {
  type = string
}

variable "route53_zone_id" {
  type = string
}

variable "domain" {
  type    = string
  default = ""
}

variable "use_custom_domain" {
  default = true
}

variable "api_dyno_size" {
  type    = string
  default = "free"
}

variable "heroku_collaborators" {
  type = list(string)
  default = [
    "brandstaetter.michael@hotmail.com",
  ]
}

variable "github_client_id" {
  type    = string
  default = ""
}

variable "github_client_secret" {
  type    = string
  default = ""
}

variable "github_callback_url" {
  type    = string
  default = ""
}

variable "twitter_consumer_key" {
  type    = string
  default = ""
}

variable "twitter_consumer_secret" {
  type    = string
  default = ""
}

variable "twitter_callback_url" {
  type    = string
  default = ""
}

variable "api_sentry_dsn" {
  type    = string
  default = ""
}

variable "app_version" {
  type    = string
  default = ""
}

variable "site_sentry_dsn" {
  type    = string
  default = ""
}

variable "site_splitbee_token" {
  type    = string
  default = ""
}

variable "api_hobby_basic_db" {
  type    = bool
  default = false
}

variable "api_graphql_debug" {
  type    = bool
  default = false
}

variable "api_graphql_playground" {
  type    = bool
  default = false
}

variable "api_graphql_schema_introspection" {
  type    = bool
  default = false
}
