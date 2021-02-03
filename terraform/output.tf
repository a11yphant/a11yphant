output "base_url" {
  value = aws_api_gateway_deployment.api_gateway_deployment.invoke_url
}

output "site_base_url" {
  value = aws_apigatewayv2_api.site_http_api.api_endpoint
}