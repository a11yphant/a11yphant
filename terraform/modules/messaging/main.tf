resource "aws_sns_topic" "sumbissions" {
  name = "${terraform.workspace}-submissions-topic"
}

resource "aws_sqs_queue" "submission_checker_queue" {
  name                      = "${terraform.workspace}-submission-checker-queue"
  receive_wait_time_seconds = 10
}