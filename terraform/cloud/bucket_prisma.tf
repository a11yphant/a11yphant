resource "aws_s3_bucket" "prisma" {
  bucket = "${terraform.workspace}-a11y-challenges-prisma-bucket"
  acl    = "private"
}