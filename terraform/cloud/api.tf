locals {
  gitlab_ci_app_image = "gitlab.mediacube.at:5050/a11yphant/a11yphant/api:${var.docker_tag}"
  heroku_app_image = "registry.heroku.com/${terraform.workspace}-a11yphant-api/web:latest"
  gitlab_ci_release_image = "gitlab.mediacube.at:5050/a11yphant/a11yphant/api-release:${var.docker_tag}"
  heroku_release_image = "registry.heroku.com/${terraform.workspace}-a11yphant-api/release:latest"
}

resource "heroku_app" "api" {
  name    = "${terraform.workspace}-a11yphant-api"
  region  = "eu"
  stack   = "container"

  config_vars = {
    NODE_ENV = "production"
    NO_COLOR = 1
    AWS_ACCESS_KEY_ID = aws_iam_access_key.api_user_access_key.id
    AWS_SECRET_ACCESS_KEY = aws_iam_access_key.api_user_access_key.secret
    API_GRAPHQL_DEBUG = 1
    API_GRAPHQL_PLAYGROUND = 1
    API_GRAPHQL_SCHEMA_INTROSPECTION = 1
    API_MESSAGING_TOPICS = "submission=${module.messaging.submission_topic_arn}"
    API_MESSAGING_REGION = "eu-central-1"
    API_MESSAGING_POLL_QUEUE = 1
    API_MESSAGING_QUEUE_URL = module.messaging.api_queue_url
  }
}

resource "heroku_addon" "api_database" {
  app  = heroku_app.api.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_collaborator" "api_collaborators" {
    count = length(var.heroku_collaborators)
    app   = heroku_app.api.name
    email = var.heroku_collaborators[count.index]
}

resource "heroku_formation" "api" {
    app = heroku_app.api.name
    type = "web"
    quantity = 1
    size = var.api_dyno_size

    depends_on = [
      herokux_app_container_release.api_app_container_release,
      herokux_app_container_release.api_release_container_release,
    ]
}

data "docker_registry_image" "gitlab_ci_api_app_image" {
  name = local.gitlab_ci_app_image
}

resource "docker_image" "gitlab_ci_api_app_image" {
  name  = local.gitlab_ci_app_image
  pull_triggers = [data.docker_registry_image.gitlab_ci_api_app_image.sha256_digest]
}

resource "null_resource" "tag_api_app_image_for_heroku" {
  provisioner "local-exec" {
    command = "docker image tag ${local.gitlab_ci_app_image} ${local.heroku_app_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    docker_image.gitlab_ci_api_app_image
  ]
}

resource "null_resource" "push_api_app_image_to_heroku" {
  provisioner "local-exec" {
    command = "docker push ${local.heroku_app_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    null_resource.tag_api_app_image_for_heroku
  ]
}

data "docker_registry_image" "gitlab_ci_api_release_image" {
  name = local.gitlab_ci_release_image
}

resource "docker_image" "gitlab_ci_api_release_image" {
  name  = local.gitlab_ci_release_image
  pull_triggers = [data.docker_registry_image.gitlab_ci_api_release_image.sha256_digest]
}

resource "null_resource" "tag_api_release_image_for_heroku" {
  provisioner "local-exec" {
    command = "docker image tag ${local.gitlab_ci_release_image} ${local.heroku_release_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    docker_image.gitlab_ci_api_release_image
  ]
}

resource "null_resource" "push_api_release_image_to_heroku" {
  provisioner "local-exec" {
    command = "docker push ${local.heroku_release_image}"
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    null_resource.tag_api_release_image_for_heroku
  ]
}

data "herokux_registry_image" "api_app" {
  app_id = heroku_app.api.uuid
  process_type = "web"
  docker_tag = "latest"

  depends_on = [
    null_resource.push_api_app_image_to_heroku
  ]
}

resource "herokux_app_container_release" "api_app_container_release" {
  app_id = heroku_app.api.uuid
  image_id = data.herokux_registry_image.api_app.digest
  process_type = "web"

  depends_on = [
    herokux_app_container_release.api_release_container_release,
  ]
}

data "herokux_registry_image" "api_release" {
  app_id = heroku_app.api.uuid
  process_type = "release"
  docker_tag = "latest"

  depends_on = [
    null_resource.push_api_release_image_to_heroku
  ]
}

resource "herokux_app_container_release" "api_release_container_release" {
  app_id = heroku_app.api.uuid
  image_id = data.herokux_registry_image.api_release.digest
  process_type = "release"
}

resource "aws_iam_user" "api_user" {
  name = "${terraform.workspace}-api-user"
}

resource "aws_iam_user_policy_attachment" "api_submission_topic_publishing" {
  user       = aws_iam_user.api_user.name
  policy_arn = aws_iam_policy.submission_topic_publishing.arn
}

resource "aws_iam_policy" "access_api_queue" {
  name        = "${terraform.workspace}-access-api-queue"
  path        = "/"
  description = "IAM policy for allowing the lambda to work on jobs from the api queue"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "${module.messaging.api_queue_arn}"
    }
  ]
}
EOF
}

resource "aws_iam_user_policy_attachment" "api_api_queue_access" {
  user       = aws_iam_user.api_user.name
  policy_arn = aws_iam_policy.access_api_queue.arn
}

resource "aws_iam_access_key" "api_user_access_key" {
  user    = aws_iam_user.api_user.name
}