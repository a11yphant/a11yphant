locals {
  gitlab_ci_app_image = "gitlab.mediacube.at:5050/a11yphant/a11yphant/api:${terraform.workspace}"
  heroku_app_image = "registry.heroku.com/${terraform.workspace}-a11yphant-api/web:latest"
  gitlab_ci_release_image = "gitlab.mediacube.at:5050/a11yphant/a11yphant/api-release:${terraform.workspace}"
  heroku_release_image = "registry.heroku.com/${terraform.workspace}-a11yphant-api/release:latest"
}

resource "heroku_app" "api" {
  name    = "${terraform.workspace}-a11yphant-api"
  region  = "eu"
  stack   = "container"

  config_vars = {
    NODE_ENV = "production"
    NO_COLOR = 1
    API_GRAPHQL_DEBUG = 1
    API_GRAPHQL_PLAYGROUND = 1
    API_GRAPHQL_SCHEMA_INTROSPECTION = 1
  }
}

resource "heroku_addon" "api_database" {
  app  = heroku_app.api.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_formation" "api" {
    app = heroku_app.api.name
    type = "web"
    quantity = 1
    size = var.api_dyno_size

    depends_on = [
      herokux_app_container_release.api_app_container_release,
      herokux_app_container_release.api_release_container_release,
    ]
}

data "docker_registry_image" "gitlab_ci_api_app_image" {
  name = local.gitlab_ci_app_image
}

resource "docker_image" "gitlab_ci_api_app_image" {
  name  = local.gitlab_ci_app_image
  pull_triggers = [data.docker_registry_image.gitlab_ci_api_app_image.sha256_digest]
}

resource "null_resource" "tag_api_app_image_for_heroku" {
  provisioner "local-exec" {
    command = "docker image tag ${local.gitlab_ci_app_image} ${local.heroku_app_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    docker_image.gitlab_ci_api_app_image
  ]
}

resource "null_resource" "push_api_app_image_to_heroku" {
  provisioner "local-exec" {
    command = "docker push ${local.heroku_app_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    null_resource.tag_api_app_image_for_heroku
  ]
}

data "docker_registry_image" "gitlab_ci_api_release_image" {
  name = local.gitlab_ci_release_image
}

resource "docker_image" "gitlab_ci_api_release_image" {
  name  = local.gitlab_ci_release_image
  pull_triggers = [data.docker_registry_image.gitlab_ci_api_release_image.sha256_digest]
}

resource "null_resource" "tag_api_release_image_for_heroku" {
  provisioner "local-exec" {
    command = "docker image tag ${local.gitlab_ci_release_image} ${local.heroku_release_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    docker_image.gitlab_ci_api_release_image
  ]
}

resource "null_resource" "push_api_release_image_to_heroku" {
  provisioner "local-exec" {
    command = "docker push ${local.heroku_release_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    null_resource.tag_api_release_image_for_heroku
  ]
}

data "herokux_registry_image" "api_app" {
  app_id = heroku_app.api.uuid
  process_type = "web"
  docker_tag = "latest"

  depends_on = [
    null_resource.push_api_app_image_to_heroku
  ]
}

resource "herokux_app_container_release" "api_app_container_release" {
  app_id = heroku_app.api.uuid
  image_id = data.herokux_registry_image.api_app.digest
  process_type = "web"
}

data "herokux_registry_image" "api_release" {
  app_id = heroku_app.api.uuid
  process_type = "release"
  docker_tag = "latest"

  depends_on = [
    null_resource.push_api_release_image_to_heroku
  ]
}

resource "herokux_app_container_release" "api_release_container_release" {
  app_id = heroku_app.api.uuid
  image_id = data.herokux_registry_image.api_release.digest
  process_type = "release"
}