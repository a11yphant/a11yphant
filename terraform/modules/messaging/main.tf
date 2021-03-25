resource "aws_sns_topic" "submission" {
  name = "${terraform.workspace}-submission-topic"
}

resource "aws_sqs_queue" "submission_checker_queue" {
  name                      = "${terraform.workspace}-submission-checker-queue"
  receive_wait_time_seconds = 10
  /*
    if the timeout is set to zero, deleting the message from the queue fails because the event is handled to fast
    (at least locally)
  */
  visibility_timeout_seconds = 1
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
  receive_wait_time_seconds = 10
  /*
    if the timeout is set to zero, deleting the message from the queue fails because the event is handled to fast
    (at least locally)
  */
  visibility_timeout_seconds = 1
}

resource "aws_sns_topic_subscription" "submission_subscription_for_api_queue" {
  topic_arn = aws_sns_topic.submission.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.api_queue.arn

  filter_policy = jsonencode({
    type = ["submission.check-completed"]
  })
}

