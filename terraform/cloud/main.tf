terraform {
  backend "s3" {
    bucket = "a11y-challenges-terraform-state"
    key    = "terraform/state"
    region = "eu-central-1"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }

    heroku = {
      source = "heroku/heroku"
    }

    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

provider "aws" {
   region = "eu-central-1"
}

provider "heroku" {}

provider "docker" {
  host = "unix:///var/run/docker.sock"

  registry_auth {
    address  = "gitlab.mediacube.at:5050"
    username = var.gitlab_ci_registery_user
    password = var.gitlab_ci_registry_password
  }

  registry_auth {
    address  = "registry.heroku.com"
    username = var.heroku_registry_user
    password = var.heroku_registry_password
  }
}

module "messaging" {
  source = "../modules/messaging"
}
