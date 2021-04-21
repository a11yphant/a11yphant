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
  }
}

provider "aws" {
   region = "eu-central-1"
}

provider "aws" {
  alias = "us_east_1"
  region = "us-east-1"
}

module "messaging" {
  source = "../modules/messaging"
}
