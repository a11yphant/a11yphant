resource "aws_vpc" "main_network" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_route_table" "main_network_route_table" {
  vpc_id = aws_vpc.main_network.id
}

resource "aws_main_route_table_association" "main_network_route_table_association" {
  vpc_id         = aws_vpc.main_network.id
  route_table_id = aws_route_table.main_network_route_table.id
}

resource "aws_vpc_endpoint_route_table_association" "main_network_s3" {
  route_table_id  = aws_route_table.main_network_route_table.id
  vpc_endpoint_id = aws_vpc_endpoint.s3.id
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main_network.id
  service_name = "com.amazonaws.eu-central-1.s3"
}

resource "aws_vpc_endpoint" "sns" {
  vpc_id            = aws_vpc.main_network.id
  service_name      = "com.amazonaws.eu-central-1.sns"
  vpc_endpoint_type = "Interface"

  security_group_ids = [
    aws_security_group.allow_https_ingress.id
  ]
}

resource "aws_vpc_endpoint" "sqs" {
  vpc_id            = aws_vpc.main_network.id
  service_name      = "com.amazonaws.eu-central-1.sqs"
  vpc_endpoint_type = "Interface"

  security_group_ids = [
    aws_security_group.allow_https_ingress.id
  ]
}