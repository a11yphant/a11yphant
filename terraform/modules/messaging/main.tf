resource "aws_sns_topic" "submission" {
  name = "${terraform.workspace}-submission-topic"
}

resource "aws_sqs_queue" "submission_checker_queue" {
  name                      = "${terraform.workspace}-submission-checker-queue"
  receive_wait_time_seconds = 20
  visibility_timeout_seconds = 10
}

resource "aws_sns_topic_subscription" "submission_subscription_for_submission_checker_queue" {
  topic_arn = aws_sns_topic.submission.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.submission_checker_queue.arn

  filter_policy = jsonencode({
    type = ["submission.created"]
  })
}

resource "aws_sqs_queue" "api_queue" {
  name                      = "${terraform.workspace}-api-queue"
  receive_wait_time_seconds = 20
  visibility_timeout_seconds = 5
}

resource "aws_sns_topic_subscription" "submission_subscription_for_api_queue" {
  topic_arn = aws_sns_topic.submission.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.api_queue.arn

  filter_policy = jsonencode({
    type = ["submission.check-completed"]
  })
}

resource "aws_sqs_queue_policy" "submission_topic_send_to_submission_queue" {
  queue_url = aws_sqs_queue.submission_checker_queue.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Id": "allow_sns_publish_to_submission_checker_queue_from_submission_topic",
  "Statement": [{
    "Sid": "1",
    "Effect":"Allow",
    "Principal": {
      "Service": "sns.amazonaws.com"
    },
    "Action":"sqs:SendMessage",
    "Resource":"${aws_sqs_queue.submission_checker_queue.arn}",
    "Condition":{
      "ArnEquals":{
        "aws:SourceArn":"${aws_sns_topic.submission.arn}"
      }
    }
  }]
}
EOF
}

resource "aws_sqs_queue_policy" "submission_topic_send_to_api_queue" {
  queue_url = aws_sqs_queue.api_queue.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Id": "allow_sns_publish_to_api_queue_from_submission_topic",
  "Statement": [{
    "Sid": "1",
    "Effect":"Allow",
    "Principal": {
      "Service": "sns.amazonaws.com"
    },
    "Action":"sqs:SendMessage",
    "Resource":"${aws_sqs_queue.api_queue.arn}",
    "Condition":{
      "ArnEquals":{
        "aws:SourceArn":"${aws_sns_topic.submission.arn}"
      }
    }
  }]
}
EOF
}


