data "external" "submission_checker_code_zip" {
  program = ["${path.module}/../../services/submission-checker/package.sh"]
}

resource "aws_s3_bucket_object" "submission_checker_code_zip" {
  bucket = aws_s3_bucket.resources.id
  key    = "code/lambdas/submission-checker.zip"
  source = "${path.module}/../../services/submission-checker/lambda.zip"
  etag   = data.external.submission_checker_code_zip.result.hash

  depends_on = [
    data.external.submission_checker_code_zip,
    aws_s3_bucket.resources
  ]
}

resource "aws_lambda_function" "submission_checker" {
  function_name = "${terraform.workspace}-submission-checker"

  s3_bucket        = aws_s3_bucket.resources.id
  s3_key           = aws_s3_bucket_object.submission_checker_code_zip.id
  source_code_hash = data.external.submission_checker_code_zip.result.hash

  handler = "dist/src/main.handle"
  runtime = "nodejs14.x"
  timeout = 10

  role = aws_iam_role.submission_checker_role.arn

  environment {
    variables = {
      NODE_ENV                             = "production"
      NO_COLOR                             = 1
      SUBMISSION_CHECKER_RENDERER_BASE_URL = "${aws_apigatewayv2_api.submission_renderer_http_api.api_endpoint}/render/"
    }
  }

  depends_on = [
    aws_s3_bucket_object.submission_checker_code_zip,
    aws_iam_role_policy_attachment.submission_checker_lambda_logs,
  ]
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
