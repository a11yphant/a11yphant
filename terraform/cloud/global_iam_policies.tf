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

resource "aws_iam_policy" "vpc_access" {
  name        = "${terraform.workspace}-vpc-access"
  path        = "/"
  description = "IAM policy for allowing the lambda to gaining access to a vpc by creating network interfaces"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface"
      ],
      "Resource": "*"
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
    "Action" : [
        "sns:Publish",
    ],
    "Effect" : "Allow",
    "Resource" : [
        { "Ref" : "${module.messaging.submission_topic_arn}" }
    ]
}
EOF
}