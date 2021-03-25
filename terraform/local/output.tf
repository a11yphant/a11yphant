output "submission_checker_queue_url" {
    value = module.messaging.submission_checker_queue_url
}

output "api_queue_url" {
  value = module.messaging.api_queue_url
}
output "submission_topic_arn" {
    value = module.messaging.submission_topic_arn
}