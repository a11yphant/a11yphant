resource "heroku_app" "api" {
  name    = "${terraform.workspace}-a11yphant-api"
  region  = "eu"
  stack   = "container"

  organization {
    name = var.heroku_team_id
  }
}

resource "heroku_addon" "api_database" {
  app  = heroku_app.api.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_formation" "api" {
    app = heroku_app.api.name
    type = "web"
    quantity = 0
    size = "hobby"

    depends_on = [
      docker_registry_image.api_heroku_image
    ]
}

data "docker_registry_image" "api" {
  name = "gitlab.mediacube.at:5050/a11y-challenges/a11y-challenges/api:${terraform.workspace}"
}

resource "docker_image" "api_heroku_image" {
  name = "registry.heroku.com/${terraform.workspace}-a11yphant-api/web"
  pull_triggers = [data.docker_registry_image.api.sha256_digest]
}

resource "docker_registry_image" "api_heroku_image" {
  name = docker_image.api_heroku_image.name
}