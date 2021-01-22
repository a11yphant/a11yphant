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

output "base_url" {
  value = aws_api_gateway_deployment.api_gateway_deployment.invoke_url
}