data "external" "submission_checker_code_zip" {
  program = [ "${path.module}/../../services/submission-checker/package.sh" ]
}

resource "aws_s3_bucket_object" "submission_checker_code_zip" {
  bucket = aws_s3_bucket.resources.id
  key    = "code/lambdas/submission-checker.zip"
  source = "${path.module}/../../services/submission-checker/lambda.zip"
  etag = data.external.submission_checker_code_zip.result.hash

  depends_on = [
    data.external.submission_checker_code_zip,
    aws_s3_bucket.resources
  ]
}

resource "aws_lambda_function" "submission_checker" {
   function_name = "${terraform.workspace}-submission-checker"

   s3_bucket = aws_s3_bucket.resources.id
   s3_key    = aws_s3_bucket_object.submission_checker_code_zip.id
   source_code_hash = data.external.submission_checker_code_zip.result.hash

   handler = "dist/src/main.handle"
   runtime = "nodejs14.x"
   timeout = 30

   role = aws_iam_role.submission_checker_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      NO_COLOR = 1
      SUBMISSION_CHECKER_RENDERER_BASE_URL = "${aws_apigatewayv2_api.submission_renderer_http_api.api_endpoint}/render/"
      SUBMISSION_CHECKER_MESSAGING_DELETE_HANDLED_MESSAGES = 0
      SUBMISSION_CHECKER_MESSAGING_REGION = "eu-central-1"
      SUBMISSION_CHECKER_MESSAGING_TOPICS = "submission=${module.messaging.submission_topic_arn}"
      SUBMISSION_CHECKER_WEBDRIVER_DRIVER = "aws-device-farm"
      SUBMISSION_CHECKER_AWS_DEVICE_FARM_PROJECT = aws_devicefarm_project.submission_checks.arn
    }
  }

  depends_on = [
    aws_s3_bucket_object.submission_checker_code_zip,
    aws_iam_role_policy_attachment.submission_checker_lambda_logs,
  ]
}

resource "aws_lambda_event_source_mapping" "trigger_submission_checker_from_queue" {
  event_source_arn = module.messaging.submission_checker_queue_arn
  function_name    = aws_lambda_function.submission_checker.arn
}

resource "aws_iam_role" "submission_checker_role" {
   name = "${terraform.workspace}-submission-checker-role"
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

resource "aws_devicefarm_project" "submission_checks" {
  provider = aws.us_west_2

  name = "${terraform.workspace}-submission-checks"
}

resource "aws_iam_policy" "execute_checks_on_aws_device_farm" {
  name        = "${terraform.workspace}-execute-checks-on-aws-device-farm"
  path        = "/"
  description = "IAM policy for allowing the lambda to execute the checks using Device Farm"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "devicefarm:CreateTestGridUrl",
      ],
      "Resource": "${aws_devicefarm_project.submission_checks}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "submission_checker_checks_on_device_farm" {
  role       = aws_iam_role.submission_checker_role.name
  policy_arn = aws_iam_policy.execute_checks_on_aws_device_farm.arn
}