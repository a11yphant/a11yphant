data "external" "site_code_zip" {
  program = [ "${path.module}/../../services/site/package.sh" ]
}

resource "aws_s3_bucket_object" "site_code_zip" {
  bucket = aws_s3_bucket.code.id
  key    = "site/${var.current_version}.zip"
  source = "${path.module}/../../services/site/lambda.zip"
  etag = data.external.site_code_zip.result.hash

  depends_on = [
    data.external.site_code_zip,
    aws_s3_bucket.code
  ]
}

resource "aws_lambda_function" "site" {
   function_name = "${terraform.workspace}-site"

   s3_bucket = aws_s3_bucket.code.id
   s3_key    = aws_s3_bucket_object.site_code_zip.id
   source_code_hash = data.external.site_code_zip.result.hash

   handler = "entrypoint.handler"
   runtime = "nodejs12.x"
   timeout = 10

   role = aws_iam_role.site_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      NO_COLOR = 1
      SITE_GRAPHQL_ENDPOINT = "${aws_apigatewayv2_api.api_http_api.api_endpoint}/graphql"
    }
  }

  depends_on = [
    aws_s3_bucket_object.site_code_zip,
    aws_iam_role_policy_attachment.site_lambda_logs,
  ]
}

resource "aws_iam_role" "site_role" {
   name = "${terraform.workspace}-site-role"
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
