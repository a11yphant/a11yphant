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
}

module "messaging" {
  source = "../modules/messaging"
}
