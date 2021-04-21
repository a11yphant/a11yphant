resource "aws_s3_bucket" "resources" {
  bucket = "${terraform.workspace}-a11yphant-resources-bucket"
  acl    = "private"
}