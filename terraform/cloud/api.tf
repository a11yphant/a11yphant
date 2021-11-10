locals {
  gitlab_ci_app_image     = "gitlab.mediacube.at:5050/a11yphant/a11yphant/api:${var.docker_tag}"
  heroku_app_image        = "registry.heroku.com/${terraform.workspace}-a11yphant-api/web:latest"
  gitlab_ci_release_image = "gitlab.mediacube.at:5050/a11yphant/a11yphant/api-release:${var.docker_tag}"
  heroku_release_image    = "registry.heroku.com/${terraform.workspace}-a11yphant-api/release:latest"
}

resource "random_password" "api_secret_key" {
  length  = 32
  special = false
}

resource "heroku_app" "api" {
  name   = "${terraform.workspace}-a11yphant-api"
  region = "eu"
  stack  = "container"

  config_vars = {
    NODE_ENV                         = "production"
    NO_COLOR                         = 1
    AWS_ACCESS_KEY_ID                = aws_iam_access_key.api_user_access_key.id
    AWS_SECRET_ACCESS_KEY            = aws_iam_access_key.api_user_access_key.secret
    API_KEY                          = random_password.api_secret_key.result
    API_GRAPHQL_DEBUG                = 1
    API_GRAPHQL_PLAYGROUND           = 1
    API_GRAPHQL_SCHEMA_INTROSPECTION = 1
    API_MESSAGING_TOPICS             = "submission=${module.messaging.submission_topic_arn}"
    API_MESSAGING_REGION             = "eu-central-1"
    API_MESSAGING_QUEUE_URL          = module.messaging.api_queue_url
    GITHUB_CLIENT_ID                 = var.github_client_id
    GITHUB_CLIENT_SECRET             = var.github_client_secret
    GITHUB_CALLBACK_URL              = var.github_callback_url
    TWITTER_CONSUMER_KEY             = var.twitter_consumer_key
    TWITTER_CONSUMER_SECRET          = var.twitter_consumer_secret
    TWITTER_CALLBACK_URL             = var.twitter_callback_url
    API_SENTRY_DSN                   = var.api_sentry_dsn
    API_SENTRY_ENVIRONMENT           = terraform.workspace
  }
}

resource "heroku_addon" "api_database" {
  app  = heroku_app.api.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_addon" "scheduler" {
  app  = heroku_app.api.name
  plan = "scheduler:standard"
}

resource "herokux_scheduler_job" "delete_stale_users" {
  app_id    = heroku_app.api.uuid
  command   = "npm run delete:staleusers"
  dyno_size = "Standard-1X"
  frequency = "every_day_at_0:00"
}

resource "heroku_collaborator" "api_collaborators" {
  count = length(var.heroku_collaborators)
  app   = heroku_app.api.name
  email = var.heroku_collaborators[count.index]
}

resource "heroku_formation" "api" {
  app      = heroku_app.api.name
  type     = "web"
  quantity = 1
  size     = var.api_dyno_size

  depends_on = [
    herokux_app_container_release.api_app_container_release,
    herokux_app_container_release.api_release_container_release,
  ]
}

module "publish_api_app_image_to_heroku" {
  source       = "../modules/docker_pull_tag_push"
  source_image = local.gitlab_ci_app_image
  target_image = local.heroku_app_image

  depends_on = [
    heroku_app.api
  ]

  providers = {
    docker        = docker
    docker.source = docker.gitlab
    docker.target = docker.heroku
  }
}

module "publish_api_release_image_to_heroku" {
  source       = "../modules/docker_pull_tag_push"
  source_image = local.gitlab_ci_release_image
  target_image = local.heroku_release_image

  depends_on = [
    heroku_app.api
  ]

  providers = {
    docker        = docker
    docker.source = docker.gitlab
    docker.target = docker.heroku
  }
}

data "herokux_registry_image" "api_app" {
  app_id       = heroku_app.api.uuid
  process_type = "web"
  docker_tag   = "latest"

  depends_on = [
    module.publish_api_app_image_to_heroku
  ]
}

resource "herokux_app_container_release" "api_app_container_release" {
  app_id       = heroku_app.api.uuid
  image_id     = data.herokux_registry_image.api_app.digest
  process_type = "web"

  depends_on = [
    herokux_app_container_release.api_release_container_release,
  ]
}

data "herokux_registry_image" "api_release" {
  app_id       = heroku_app.api.uuid
  process_type = "release"
  docker_tag   = "latest"

  depends_on = [
    module.publish_api_release_image_to_heroku
  ]
}

resource "herokux_app_container_release" "api_release_container_release" {
  app_id       = heroku_app.api.uuid
  image_id     = data.herokux_registry_image.api_release.digest
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
  user = aws_iam_user.api_user.name
}
