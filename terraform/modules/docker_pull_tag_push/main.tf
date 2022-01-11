terraform {
  required_providers {
    docker = {
      source                = "kreuzwerker/docker"
      configuration_aliases = [docker.source, docker.target]
    }
  }
}

data "docker_registry_image" "source_image" {
  provider = docker.source
  name     = var.source_image
}

resource "docker_image" "source_image" {
  provider      = docker.source
  name          = var.source_image
  keep_locally  = true
  pull_triggers = [data.docker_registry_image.source_image.sha256_digest]
}

resource "null_resource" "tag_image" {
  provisioner "local-exec" {
    command = "docker image tag ${var.source_image} ${var.target_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    docker_image.source_image
  ]
}

resource "null_resource" "push_target_image" {
  provisioner "local-exec" {
    command = "docker push ${var.target_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    null_resource.tag_image,
  ]
}