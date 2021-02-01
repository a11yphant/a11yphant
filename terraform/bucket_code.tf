resource "aws_s3_bucket" "code" {
  bucket = "a11y-challenges-code-bucket"
  acl    = "private"
}