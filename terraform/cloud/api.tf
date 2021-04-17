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

resource "docker_registry_image" "api_heroku_image" {
  name          = "registry.heroku.com/${terraform.workspace}-a11yphant-api/web"
  keep_remotely = true
}