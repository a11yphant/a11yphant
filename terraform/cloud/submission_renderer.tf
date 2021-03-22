data "external" "submission_renderer_code_zip" {
  program = [ "${path.module}/../../services/submission-renderer/package.sh" ]
}

resource "aws_s3_bucket_object" "submission_renderer_code_zip" {
  bucket = aws_s3_bucket.resources.id
  key    = "code/lambdas/submission-renderer.zip"
  source = "${path.module}/../../services/submission-renderer/lambda.zip"
  etag = data.external.submission_renderer_code_zip.result.hash

  depends_on = [
    data.external.submission_renderer_code_zip,
    aws_s3_bucket.resources
  ]
}

resource "aws_lambda_function" "submission_renderer" {
   function_name = "${terraform.workspace}-submission-renderer"

   s3_bucket = aws_s3_bucket.resources.id
   s3_key    = aws_s3_bucket_object.submission_renderer_code_zip.id
   source_code_hash = data.external.submission_renderer_code_zip.result.hash

   handler = "dist/main.handler"
   runtime = "nodejs12.x"
   timeout = 10

   role = aws_iam_role.submission_renderer_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      NO_COLOR = 1
      SUBMISSION_RENDERER_LAMBDA = 1
    }
  }

  depends_on = [
    aws_s3_bucket_object.submission_renderer_code_zip,
    aws_iam_role_policy_attachment.submission_renderer_lambda_logs,
  ]
}

resource "aws_iam_role" "submission_renderer_role" {
   name = "${terraform.workspace}-submission-renderer-role"
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

resource "aws_iam_role_policy_attachment" "submission_renderer_lambda_logs" {
  role       = aws_iam_role.submission_renderer_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_permission" "api_gateway_submission_renderer" {
   statement_id  = "${terraform.workspace}-allow-api-gateway-invoke-submission-renderer"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.submission_renderer.function_name
   principal     = "apigateway.amazonaws.com"

   source_arn = "${aws_apigatewayv2_api.submission_renderer_http_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_api" "submission_renderer_http_api" {
  name          = "${terraform.workspace}-submission-renderer-http-api"
  protocol_type = "HTTP"
  target        = aws_lambda_function.submission_renderer.invoke_arn
}

