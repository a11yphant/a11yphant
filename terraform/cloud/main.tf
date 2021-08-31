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

    herokux = {
      source = "davidji99/herokux"
    }

    docker = {
      source = "kreuzwerker/docker"
      # lock version until this bug is resolved: https://github.com/kreuzwerker/terraform-provider-docker/issues/239
      version = "2.11.0"
    }

    random = {
      source = "hashicorp/random"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

provider "archive" {}

provider "heroku" {}

provider "herokux" {}

data "aws_caller_identity" "this" {}
data "aws_region" "current" {}
data "aws_ecr_authorization_token" "token" {}

locals {
  ecr_address = format("%v.dkr.ecr.%v.amazonaws.com", data.aws_caller_identity.this.account_id, data.aws_region.current.name)
}

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

  registry_auth {
    address  = local.ecr_address
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

provider "aws" {
  alias  = "us_west_2"
  region = "us-west-2"
}

provider "external" {
}

module "messaging" {
  source = "../modules/messaging"
}
