resource "aws_s3_bucket" "resources" {
  bucket = "${terraform.workspace}-a11y-challenges-resources-bucket"
  acl    = "private"
}