resource "aws_subnet" "postgres_cluster_network_zone_a" {
  vpc_id     = aws_vpc.main_network.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-central-1a"

  depends_on = [ 
    aws_vpc.main_network
  ]
}

resource "aws_subnet" "postgres_cluster_network_zone_b" {
  vpc_id     = aws_vpc.main_network.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-central-1b"

  depends_on = [ 
    aws_vpc.main_network
  ]
}

resource "aws_subnet" "postgres_cluster_network_zone_c" {
  vpc_id     = aws_vpc.main_network.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "eu-central-1c"

  depends_on = [ 
    aws_vpc.main_network
  ]
}



resource "aws_db_subnet_group" "postgres_cluster_subnet_group" {
  name       = "${terraform.workspace}-postgres-cluster_subnet-group"
  subnet_ids = [ 
      aws_subnet.postgres_cluster_network_zone_a.id,
      aws_subnet.postgres_cluster_network_zone_b.id,
      aws_subnet.postgres_cluster_network_zone_c.id
  ]
}

resource "aws_rds_cluster" "postgres" {
  cluster_identifier      = "${terraform.workspace}-postgres-cluster"
  engine                  = "aurora-postgresql"
  availability_zones      = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
  database_name           = var.postgres_cluster_database_name
  master_username         = var.postgres_cluster_root_user
  master_password         = var.postgres_cluster_root_password
  engine_mode             = "serverless"
  vpc_security_group_ids  = [ aws_security_group.allow_postgres_ingress.id ]
  db_subnet_group_name    = aws_db_subnet_group.postgres_cluster_subnet_group.name
  skip_final_snapshot     = true

  scaling_configuration {
    auto_pause               = true
    max_capacity             = 2
    min_capacity             = 2
  }

  depends_on = [ 
    aws_subnet.postgres_cluster_network_zone_a,
    aws_subnet.postgres_cluster_network_zone_b,
    aws_subnet.postgres_cluster_network_zone_c
  ]
}