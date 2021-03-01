provider "aws" {
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    s3_force_path_style         = true
    skip_requesting_account_id  = true
    access_key                  = "mock_access_key"
    secret_key                  = "mock_secret_key"
    region                      = "us-east-1"

    endpoints {
        sns     = "http://localstack:4566"
        sqs     = "http://localstack:4566"
    }
}

module "messaging" {
  source = "../modules/messaging"
}