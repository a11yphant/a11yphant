output "submission_checker_queue_url" {
  value = aws_sqs_queue.submission_checker_queue.id
}

output "submission_checker_queue_arn" {
  value = aws_sqs_queue.submission_checker_queue.arn
}

output "api_queue_url" {
  value = aws_sqs_queue.api_queue.id
}

output "submission_topic_arn" {
  value = aws_sns_topic.submission.arn
}