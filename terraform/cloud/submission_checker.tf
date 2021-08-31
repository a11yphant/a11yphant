locals {
  ecr_submission_checker_image        = format("%v/%v", local.ecr_address, aws_ecr_repository.repository_submission_checker.id)
  ecr_submission_checker_image_latest = format("%v:%v", local.ecr_submission_checker_image, "latest")
  gitlab_ci_submission_checker_image  = "gitlab.mediacube.at:5050/a11yphant/a11yphant/submission-checker:${var.docker_tag}"
}

resource "aws_lambda_function" "submission_checker" {
  function_name = "${terraform.workspace}-submission-checker"

  package_type = "Image"
  image_uri    = "${local.ecr_submission_checker_image}@${data.aws_ecr_image.submission_checker_image.id}"
  timeout      = 30
  memory_size  = 512

  role = aws_iam_role.submission_checker_role.arn

  environment {
    variables = {
      NODE_ENV                                             = "production"
      NO_COLOR                                             = 1
      SUBMISSION_CHECKER_RENDERER_BASE_URL                 = "${heroku_app.api.web_url}render/"
      SUBMISSION_CHECKER_MESSAGING_DELETE_HANDLED_MESSAGES = 0
      SUBMISSION_CHECKER_MESSAGING_REGION                  = "eu-central-1"
      SUBMISSION_CHECKER_MESSAGING_TOPICS                  = "submission=${module.messaging.submission_topic_arn}"
      SUBMISSION_CHECKER_WEBDRIVER_DRIVER                  = "remote"
      SUBMISSION_CHECKER_WEBDRIVER_ENDPOINT                = "https://selenium.mibra.io/wd/hub"
    }
  }

  depends_on = [
    module.publish_submission_checker_image_to_aws_ecr,
    aws_iam_role_policy_attachment.submission_checker_lambda_logs,
  ]
}

resource "aws_lambda_event_source_mapping" "trigger_submission_checker_from_queue" {
  event_source_arn = module.messaging.submission_checker_queue_arn
  function_name    = aws_lambda_function.submission_checker.arn
}

resource "aws_iam_role" "submission_checker_role" {
  name        = "${terraform.workspace}-submission-checker-role"
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

resource "aws_iam_role_policy_attachment" "submission_checker_lambda_logs" {
  role       = aws_iam_role.submission_checker_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_policy" "access_submission_checker_queue" {
  name        = "${terraform.workspace}-access-submission-checker-queue"
  path        = "/"
  description = "IAM policy for allowing the lambda to work on jobs from the submission checker queue"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "${module.messaging.submission_checker_queue_arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "submission_checker_submission_checker_queue_access" {
  role       = aws_iam_role.submission_checker_role.name
  policy_arn = aws_iam_policy.access_submission_checker_queue.arn
}

resource "aws_iam_role_policy_attachment" "submission_checker_submission_topic_publishing" {
  role       = aws_iam_role.submission_checker_role.name
  policy_arn = aws_iam_policy.submission_topic_publishing.arn
}

resource "aws_ecr_repository" "repository_submission_checker" {
  name                 = "${terraform.workspace}-submission-checker"
  image_tag_mutability = "MUTABLE"
}

module "publish_submission_checker_image_to_aws_ecr" {
  source       = "../modules/docker_pull_tag_push"
  source_image = local.gitlab_ci_submission_checker_image
  target_image = local.ecr_submission_checker_image_latest
}

data "aws_ecr_image" "submission_checker_image" {
  repository_name = aws_ecr_repository.repository_submission_checker.id
  image_tag       = "latest"

  depends_on = [
    module.publish_submission_checker_image_to_aws_ecr
  ]
}