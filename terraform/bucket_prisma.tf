resource "aws_s3_bucket" "prisma" {
  bucket = "a11y-challenges-prisma-bucket"
  acl    = "private"
}