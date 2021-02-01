data "external" "database_migration_code_zip" {
  program = [ "${path.module}/../services/database-migration/package.sh" ]
}

resource "aws_s3_bucket_object" "database_migration_code_zip" {
  bucket = aws_s3_bucket.code.id
  key    = "database_migration/${var.current_version}.zip"
  source = "${path.module}/../services/database-migration/lambda.zip"
  etag = data.external.database_migration_code_zip.result.hash

  depends_on = [
    data.external.database_migration_code_zip,
    aws_s3_bucket.code
  ]
}

resource "aws_lambda_function" "database_migration" {
   function_name = "database_migration"

   s3_bucket = aws_s3_bucket.code.id
   s3_key    = aws_s3_bucket_object.database_migration_code_zip.id
   source_code_hash = data.external.database_migration_code_zip.result.hash

   handler = "entrypoint.handle"
   runtime = "nodejs12.x"
   timeout = 60

   role = aws_iam_role.api_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
    }
  }

  depends_on = [
    aws_s3_bucket_object.database_migration_code_zip,
    aws_iam_role_policy_attachment.database_migration_lambda_logs,
  ]
}

resource "aws_iam_role" "database_migration_role" {
   name = "database_migration_role"
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

resource "aws_iam_role_policy_attachment" "database_migration_lambda_logs" {
  role       = aws_iam_role.database_migration_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}