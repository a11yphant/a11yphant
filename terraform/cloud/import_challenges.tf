data "archive_file" "challenges" {
    type        = "zip"
    source_dir  = "${path.module}/../../challenges"
    output_path = "${path.module}/../../challenges.zip"
}


data "external" "import_challenges_code_zip" {
  program = [ "${path.module}/../../services/import-challenges/package.sh" ]
}

resource "aws_s3_bucket_object" "challenges" {
    bucket = aws_s3_bucket.resources.id
    key    = "challenges/challenges.zip"
    source = "${path.module}/../../challenges.zip"
    etag   = data.archive_file.challenges.output_md5

    depends_on = [ 
        data.archive_file.challenges,
        aws_s3_bucket.resources,
        aws_lambda_function.import_challenges,
        aws_s3_bucket_notification.challenges_changed_notification
     ]
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

   handler = "dist/main.handle"
   runtime = "nodejs14.x"
   timeout = 60

   role = aws_iam_role.import_challenges_role.arn

   environment {
    variables = {
      NODE_ENV = "production"
      NO_COLOR = 1
      DB_URL = "postgresql://${var.postgres_cluster_root_user}:${var.postgres_cluster_root_password}@${aws_rds_cluster.postgres.endpoint}:${aws_rds_cluster.postgres.port}/${var.postgres_cluster_database_name}?pool_timeout=30"
      IMPORT_CHALLENGES_CHALLENGES_LOCATION = "/tmp/challenges"
      IMPORT_CHALLENGES_IS_LAMBDA = 1
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

resource "aws_lambda_permission" "allow_resources_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.import_challenges.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.resources.arn
}

resource "aws_s3_bucket_notification" "challenges_changed_notification" {
  bucket = aws_s3_bucket.resources.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.import_challenges.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".zip"
    filter_prefix       = "challenges/"
  }

  depends_on = [aws_lambda_permission.allow_resources_bucket]
}

resource "aws_iam_policy" "read_resources_bucket_object" {
  name        = "${terraform.workspace}-read-resources-bucket-object"
  path        = "/"
  description = "IAM policy for reading from the resources bucket"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "${aws_s3_bucket.resources.arn}/*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "import_challenges_read_resources_bucket_object" {
  role       = aws_iam_role.import_challenges_role.name
  policy_arn = aws_iam_policy.read_resources_bucket_object.arn
}