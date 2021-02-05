output "api_gateway_url" {
  value = aws_apigatewayv2_api.api_http_api.api_endpoint
}

output "site_gateway_url" {
  value = aws_apigatewayv2_api.site_http_api.api_endpoint
}

output "url" {
  value = "https://${aws_cloudfront_distribution.site.domain_name}"
}