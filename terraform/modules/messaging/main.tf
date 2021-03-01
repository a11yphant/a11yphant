resource "aws_sns_topic" "sumbissions" {
  name = "${terraform.workspace}-submissions-topic"
}