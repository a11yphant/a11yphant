resource "aws_rds_cluster" "postgres" {
  cluster_identifier      = "postgres-cluster"
  engine                  = "aurora-postgresql"
  availability_zones      = ["eu-central-1a"]
  database_name           = var.postgres_cluster_database_name
  master_username         = var.postgres_cluster_root_user
  master_password         = var.postgres_cluster_root_password
  engine_mode             = "serverless"

  scaling_configuration {
    auto_pause               = true
    max_capacity             = 2
    min_capacity             = 2
  }
}