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
  type    = string
}

variable "docker_tag" {
  type    = string
}

variable "route53_zone_id" {
  type    = string
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
  type    = list(string)
  default = [
    "brandstaetter.michael@hotmail.com",
  ]
}

# copied from: https://github.com/hashicorp/terraform-template-dir/blob/556bd64989e7099fabb90c6b883b5d4d92da3ae8/variables.tf
variable "file_types" {
  type = map(string)
  default = {
    "txt"    = "text/plain"
    "html"   = "text/html"
    "htm"    = "text/html"
    "xhtml"  = "application/xhtml+xml"
    "css"    = "text/css"
    "js"     = "application/javascript"
    "xml"    = "application/xml"
    "json"   = "application/json"
    "jsonld" = "application/ld+json"
    "gif"    = "image/gif"
    "jpeg"   = "image/jpeg"
    "jpg"    = "image/jpeg"
    "png"    = "image/png"
    "svg"    = "image/svg+xml"
    "webp"   = "image/webp"
    "weba"   = "audio/webm"
    "webm"   = "video/webm"
    "3gp"    = "video/3gpp"
    "3g2"    = "video/3gpp2"
    "pdf"    = "application/pdf"
    "swf"    = "application/x-shockwave-flash"
    "atom"   = "application/atom+xml"
    "rss"    = "application/rss+xml"
    "ico"    = "image/vnd.microsoft.icon"
    "jar"    = "application/java-archive"
    "ttf"    = "font/ttf"
    "otf"    = "font/otf"
    "eot"    = "application/vnd.ms-fontobject"
    "woff"   = "font/woff"
    "woff2"  = "font/woff2"
  }
  description = "Map from file suffixes, which must contain no periods, to the corresponding Content-Type values."
}