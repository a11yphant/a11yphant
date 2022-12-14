#-----------------------------------
# Lambda
#-----------------------------------
resource "aws_iam_policy" "lambda_logging" {
  name        = "${terraform.workspace}-lambda-logging"
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

resource "aws_iam_policy" "submission_topic_publishing" {
  name        = "${terraform.workspace}-submission-topic-publishing"
  path        = "/"
  description = "IAM policy for allowing the lambda to gaining access to a vpc by creating network interfaces"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sns:Publish",
      "Resource": "${module.messaging.submission_topic_arn}"
    }
  ]
}
EOF
}