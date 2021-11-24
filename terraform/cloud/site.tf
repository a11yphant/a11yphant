locals {
  ecr_site_image        = format("%v/%v", local.ecr_address, aws_ecr_repository.repository_site.id)
  ecr_site_image_latest = format("%v:%v", local.ecr_site_image, "latest")
  gitlab_ci_site_image  = "gitlab.mediacube.at:5050/a11yphant/a11yphant/site:${var.docker_tag}"
}


resource "aws_lambda_function" "site" {
  function_name = "${terraform.workspace}-site"

  package_type = "Image"
  image_uri    = "${local.ecr_site_image}@${data.aws_ecr_image.site_image.id}"
  timeout      = 30
  memory_size  = 256

  role = aws_iam_role.site_role.arn

  environment {
    variables = {
      NODE_ENV                     = "production"
      NO_COLOR                     = 1
      SITE_GRAPHQL_ENDPOINT_SERVER = "${heroku_app.api.web_url}graphql"
      SITE_GRAPHQL_ENDPOINT_CLIENT = "https://${var.domain}/graphql"
      SITE_ASSET_BASE_URL          = "https://${var.domain}"
      SITE_VERSION                 = var.app_version
      SITE_SENTRY_DSN              = var.site_sentry_dsn
      SITE_ENVIRONMENT             = terraform.workspace
      SITE_SPLITBEE_TOKEN          = var.site_splitbee_token
    }
  }

  depends_on = [
    module.publish_site_image_to_aws_ecr,
    aws_iam_role_policy_attachment.site_lambda_logs,
  ]
}

resource "aws_iam_role" "site_role" {
  name        = "${terraform.workspace}-site-role"
  description = "IAM Role for executing a Lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "site_lambda_logs" {
  role       = aws_iam_role.site_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_permission" "api_gateway_site" {
  statement_id  = "${terraform.workspace}-allow-api-gateway-invoke-site"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.site.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.site_http_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_api" "site_http_api" {
  name          = "${terraform.workspace}-site-http-api"
  protocol_type = "HTTP"
  target        = aws_lambda_function.site.invoke_arn
}

resource "aws_ecr_repository" "repository_site" {
  name                 = "${terraform.workspace}-site"
  image_tag_mutability = "MUTABLE"
}

module "publish_site_image_to_aws_ecr" {
  source       = "../modules/docker_pull_tag_push"
  source_image = local.gitlab_ci_site_image
  target_image = local.ecr_site_image_latest

  providers = {
    docker        = docker
    docker.source = docker.gitlab
    docker.target = docker.ecr
  }
}

data "aws_ecr_image" "site_image" {
  repository_name = aws_ecr_repository.repository_site.id
  image_tag       = "latest"

  depends_on = [
    module.publish_site_image_to_aws_ecr
  ]
}