resource "aws_api_gateway_rest_api" "api_gateway" {
  name        = "${terraform.workspace}-api-gateway"
  description = "A11y challenges API gateway"
}

resource "aws_api_gateway_resource" "graphql" {
   rest_api_id = aws_api_gateway_rest_api.api_gateway.id
   parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
   path_part   = "graphql"
}

resource "aws_api_gateway_method" "graphql_post" {
   rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
   resource_id   = aws_api_gateway_resource.graphql.id
   http_method   = "POST"
   authorization = "NONE"
}

resource "aws_api_gateway_method" "graphql_get" {
   rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
   resource_id   = aws_api_gateway_resource.graphql.id
   http_method   = "GET"
   authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_graphql_post" {
   rest_api_id = aws_api_gateway_rest_api.api_gateway.id
   resource_id = aws_api_gateway_method.graphql_post.resource_id
   http_method = aws_api_gateway_method.graphql_post.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.api.invoke_arn
}

resource "aws_api_gateway_integration" "lambda_graphql_get" {
   rest_api_id = aws_api_gateway_rest_api.api_gateway.id
   resource_id = aws_api_gateway_method.graphql_get.resource_id
   http_method = aws_api_gateway_method.graphql_get.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.api.invoke_arn
}

resource "aws_api_gateway_deployment" "api_gateway_deployment" {
   depends_on = [
     aws_api_gateway_integration.lambda_graphql_post,
     aws_api_gateway_integration.lambda_graphql_get
   ]

   rest_api_id = aws_api_gateway_rest_api.api_gateway.id
   stage_name  = "prod"
}
