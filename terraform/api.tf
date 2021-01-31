data "external" "api_code_zip" {
  program = [ "${path.module}/../services/api/package.sh" ]
}

resource "aws_s3_bucket_object" "api_code_zip" {
  bucket = aws_s3_bucket.code.id
  key    = "api/${var.current_version}.zip"
  source = "${path.module}/../services/api/lambda.zip"
  etag = data.external.api_code_zip.result.hash

  depends_on = [
    data.external.api_code_zip,
    aws_s3_bucket.code
  ]
}

resource "aws_lambda_function" "api" {
   function_name = "api"

   s3_bucket = aws_s3_bucket.code.id
   s3_key    = aws_s3_bucket_object.api_code_zip.id
   source_code_hash = data.external.api_code_zip.result.hash

   handler = "entrypoint.handle"
   runtime = "nodejs12.x"
   timeout = 10

   role = aws_iam_role.api_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      API_LAMBDA = 1
      API_GRAPHQL_DEBUG = 1
      API_GRAPHQL_PLAYGROUND = 1
      API_GRAPHQL_SCHEMA_INTROSPECTION = 1
    }
  }

  depends_on = [
    aws_s3_bucket_object.api_code_zip,
    aws_iam_role_policy_attachment.lambda_logs,
  ]
}

resource "aws_iam_role" "api_role" {
   name = "api_role"
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

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.api_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}


resource "aws_lambda_permission" "api_gateway" {
   statement_id  = "AllowAPIGatewayInvoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.api.function_name
   principal     = "apigateway.amazonaws.com"

   # The "/*/*" portion grants access from any method on any resource within the API Gateway REST API.
   source_arn = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*"
}
