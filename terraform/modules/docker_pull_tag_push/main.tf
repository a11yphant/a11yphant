terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

data "docker_registry_image" "source_image" {
  provider = var.source_provider
  name     = var.source_image
}

resource "docker_image" "source_image" {
  provider      = var.source_provider
  name          = var.source_image
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