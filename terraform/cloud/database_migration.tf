data "archive_file" "prisma_migrations" {
    type        = "zip"
    source_dir  = "${path.module}/../../packages/prisma/prisma"
    output_path = "${path.module}/../../packages/prisma/prisma.zip"
}

data "external" "database_migration_code_zip" {
  program = [ "${path.module}/../../services/database-migration/package.sh" ]
}

resource "aws_s3_bucket_object" "prisma_migrations" {
    bucket = aws_s3_bucket.prisma.id
    key    = "${var.current_version}.zip"
    source = "${path.module}/../../packages/prisma/prisma.zip"
    etag   = data.archive_file.prisma_migrations.output_md5

    depends_on = [ 
        data.archive_file.prisma_migrations,
        aws_s3_bucket.prisma,
        aws_lambda_function.database_migration,
        aws_s3_bucket_notification.prisma_changed_notification
     ]
}

resource "aws_s3_bucket_object" "database_migration_code_zip" {
  bucket = aws_s3_bucket.code.id
  key    = "database_migration/${var.current_version}.zip"
  source = "${path.module}/../../services/database-migration/lambda.zip"
  etag = data.external.database_migration_code_zip.result.hash

  depends_on = [
    data.external.database_migration_code_zip,
    aws_s3_bucket.code
  ]
}

resource "aws_lambda_function" "database_migration" {
   function_name = "${terraform.workspace}-database-migration"

   s3_bucket = aws_s3_bucket.code.id
   s3_key    = aws_s3_bucket_object.database_migration_code_zip.id
   source_code_hash = data.external.database_migration_code_zip.result.hash

   handler = "entrypoint.handler"
   runtime = "nodejs14.x"
   timeout = 60

   role = aws_iam_role.database_migration_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      DB_URL = "postgresql://${var.postgres_cluster_root_user}:${var.postgres_cluster_root_password}@${aws_rds_cluster.postgres.endpoint}:${aws_rds_cluster.postgres.port}/${var.postgres_cluster_database_name}?connect_timeout=30&pool_timeout=30"
    }
  }

  vpc_config {
    subnet_ids         = [ 
        aws_subnet.postgres_cluster_network_zone_a.id,
        aws_subnet.postgres_cluster_network_zone_b.id,
        aws_subnet.postgres_cluster_network_zone_c.id
    ]
    security_group_ids = [ aws_security_group.allow_all_egress.id ]
  }

  depends_on = [
    aws_s3_bucket_object.database_migration_code_zip,
    aws_iam_role_policy_attachment.database_migration_lambda_logs,
    aws_subnet.postgres_cluster_network_zone_a,
    aws_subnet.postgres_cluster_network_zone_b,
    aws_subnet.postgres_cluster_network_zone_c,
    aws_security_group.allow_all_egress
  ]
}

resource "aws_iam_role" "database_migration_role" {
   name = "${terraform.workspace}-database-migration-role"
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

resource "aws_iam_role_policy_attachment" "database_migration_vpc_access" {
  role       = aws_iam_role.database_migration_role.name
  policy_arn = aws_iam_policy.vpc_access.arn
}

resource "aws_lambda_permission" "allow_prisma_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.database_migration.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.prisma.arn
}

resource "aws_s3_bucket_notification" "prisma_changed_notification" {
  bucket = aws_s3_bucket.prisma.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.database_migration.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".zip"
  }

  depends_on = [aws_lambda_permission.allow_prisma_bucket]
}

resource "aws_iam_policy" "read_prisma_bucket_object" {
  name        = "${terraform.workspace}-read-prisma-bucket-object"
  path        = "/"
  description = "IAM policy for reading from the prisma bucket"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "${aws_s3_bucket.prisma.arn}/*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "database_migration_read_prisma_bucket_object" {
  role       = aws_iam_role.database_migration_role.name
  policy_arn = aws_iam_policy.read_prisma_bucket_object.arn
}