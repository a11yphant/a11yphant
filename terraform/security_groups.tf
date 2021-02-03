resource "aws_security_group" "allow_all_egress" {
    name = "allow_all_egress"
    vpc_id = aws_vpc.main_network.id

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_security_group" "allow_postgres_ingress" {
    name = "allow_postgres_ingress"
    vpc_id = aws_vpc.main_network.id

    ingress {
        from_port   = 0
        to_port     = 5432
        protocol    = "6" # TCP
        cidr_blocks = ["0.0.0.0/0"]
    }
}