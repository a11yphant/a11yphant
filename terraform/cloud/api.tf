locals {
  gitlab_ci_image = "gitlab.mediacube.at:5050/a11y-challenges/a11y-challenges/api:${terraform.workspace}"
  heroku_image = "registry.heroku.com/${terraform.workspace}-a11yphant-api/web:latest"
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
      null_resource.push_api_image_to_heroku
    ]
}

data "docker_registry_image" "gitlab_ci_api_image" {
  name = local.gitlab_ci_image
}

resource "docker_image" "gitlab_ci_api_image" {
  name  = local.gitlab_ci_image
  pull_triggers = [data.docker_registry_image.gitlab_ci_api_image.sha256_digest]
}

resource "null_resource" "tag_api_image_for_heroku" {
  provisioner "local-exec" {
    command = "docker image tag ${local.gitlab_ci_image} ${local.heroku_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    docker_image.gitlab_ci_api_image
  ]
}
resource "null_resource" "push_api_image_to_heroku" {
  provisioner "local-exec" {
    command = "docker push ${local.heroku_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    null_resource.tag_api_image_for_heroku
  ]
}