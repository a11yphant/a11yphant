data "external" "import_challenges_code_zip" {
  program = [ "${path.module}/../../services/import-challenges/package.sh" ]
}

resource "aws_s3_bucket_object" "import_challenges_code_zip" {
  bucket = aws_s3_bucket.code.id
  key    = "import_challenges/${var.current_version}.zip"
  source = "${path.module}/../../services/import-challenges/lambda.zip"
  etag = data.external.import_challenges_code_zip.result.hash

  depends_on = [
    data.external.import_challenges_code_zip,
    aws_s3_bucket.code
  ]
}

resource "aws_lambda_function" "import_challenges" {
   function_name = "${terraform.workspace}-import-challenges"

   s3_bucket = aws_s3_bucket.code.id
   s3_key    = aws_s3_bucket_object.import_challenges_code_zip.id
   source_code_hash = data.external.import_challenges_code_zip.result.hash

   handler = "entrypoint.handler"
   runtime = "nodejs12.x"
   timeout = 60

   role = aws_iam_role.import_challenges_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      DB_URL = "postgresql://${var.postgres_cluster_root_user}:${var.postgres_cluster_root_password}@${aws_rds_cluster.postgres.endpoint}:${aws_rds_cluster.postgres.port}/${var.postgres_cluster_database_name}"
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
}

resource "aws_iam_role" "import_challenges_role" {
   name = "${terraform.workspace}-import-challenges-role"
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

resource "aws_iam_role_policy_attachment" "import_challenges_lambda_logs" {
  role       = aws_iam_role.import_challenges_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "import_challenges_vpc_access" {
  role       = aws_iam_role.import_challenges_role.name
  policy_arn = aws_iam_policy.vpc_access.arn
}
