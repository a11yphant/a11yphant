locals {
  origin_id_site_http_api = "${terraform.workspace}-site-http-api-origin"
  origin_id_api_http_api  = "${terraform.workspace}-api-http-api"
}

resource "aws_cloudfront_distribution" "site" {
  comment = "${terraform.workspace}-site-distribution"

  aliases = var.use_custom_domain ? [var.domain] : []

  origin {
    domain_name = replace(aws_apigatewayv2_api.site_http_api.api_endpoint, "/^https?://([^/]*).*/", "$1")
    origin_id   = local.origin_id_site_http_api

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  origin {
    domain_name = replace(heroku_app.api.web_url, "/^https?://([^/]*).*/", "$1")
    origin_id   = local.origin_id_api_http_api

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # s3
  dynamic "ordered_cache_behavior" {
    for_each = ["/fonts/*", "/_next/static/*", "favicon.ico", "images/*", "/_next/image*"]

    content {
      path_pattern     = ordered_cache_behavior.value
      allowed_methods  = ["GET", "HEAD", "OPTIONS"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = local.origin_id_site_http_api

      forwarded_values {
        query_string = false

        cookies {
          forward = "none"
        }
      }

      min_ttl                = 86400
      default_ttl            = 86400
      max_ttl                = 31536000
      compress               = true
      viewer_protocol_policy = "redirect-to-https"
    }
  }

  # forward auth to api gateway
  ordered_cache_behavior {
    path_pattern     = "/auth*"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id_api_http_api

    forwarded_values {
      query_string = true
      headers      = ["Accept", "Referer", "Authorization", "Content-Type"]
      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # forward graphql to api api gateway
  ordered_cache_behavior {
    path_pattern     = "/graphql*"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id_api_http_api

    forwarded_values {
      query_string = true
      headers      = ["Accept", "Referer", "Authorization", "Content-Type"]

      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # forward render to api api gateway
  ordered_cache_behavior {
    path_pattern     = "/render*"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id_api_http_api

    forwarded_values {
      query_string = true
      headers      = ["Accept", "Referer", "Authorization", "Content-Type"]

      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # fallback to api gateway for site
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id_site_http_api

    forwarded_values {
      query_string = true
      headers      = ["Accept", "Referer", "Authorization", "Content-Type"]

      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 60
    max_ttl                = 900
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate {
    cloudfront_default_certificate = var.use_custom_domain ? false : true
    acm_certificate_arn            = var.use_custom_domain ? aws_acm_certificate.certificate[0].arn : null
    ssl_support_method             = "sni-only"
  }
}

resource "aws_cloudfront_origin_access_identity" "site_access_identity" {
  comment = "${terraform.workspace} cloudfront site_access_identity"
}

resource "aws_acm_certificate" "certificate" {
  count = var.use_custom_domain ? 1 : 0

  provider = aws.us_east_1

  domain_name       = var.domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cdn_domain" {
  count = var.use_custom_domain ? 1 : 0

  zone_id = var.route53_zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "validation_records" {
  for_each = {
    for dvo in var.use_custom_domain ? aws_acm_certificate.certificate[0].domain_validation_options : [] : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.route53_zone_id
}

resource "aws_acm_certificate_validation" "domain" {
  count = var.use_custom_domain ? 1 : 0

  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.certificate[0].arn
  validation_record_fqdns = [for record in aws_route53_record.validation_records : record.fqdn]
}
