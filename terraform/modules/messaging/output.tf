output "submission_checker_queue_url" {
  value = aws_sqs_queue.submission_checker_queue.id
}