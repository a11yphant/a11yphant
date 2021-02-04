resource "aws_s3_bucket" "code" {
  bucket = "${terraform.workspace}-a11y-challenges-code-bucket"
  acl    = "private"
}