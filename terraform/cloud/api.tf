locals {
  heroku_api_image = "registry.heroku.com/${terraform.workspace}-a11yphant-api/web"
}

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

resource "docker_image" "api_image" {
  name          = data.docker_registry_image.api.name
  pull_triggers = [data.docker_registry_image.api.sha256_digest]
}

resource "null_resource" "tag_image_for_heroku" {
  triggers = {
    "digest" = "${data.docker_registry_image.api.sha256_digest}"
  }
  provisioner "local-exec" {
    command = "echo -e \"POST /v1.24/images/${docker_image.api_image.latest}/tag?repo=${local.heroku_api_image}&tag=latest HTTP/1.0\r\n\" | socat unix-connect:/var/run/docker.sock STDIO"
  }

  depends_on = [
    docker_image.api_image
  ]
}

resource "docker_registry_image" "api_heroku_image" {
  name = local.heroku_api_image

  depends_on = [null_resource.tag_image_for_heroku]
}