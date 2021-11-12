
resource "aws_ses_domain_identity" "a11yphant" {
  domain = var.domain
}

resource "aws_ses_domain_dkim" "a11yphant" {
  domain = var.domain
}

resource "aws_route53_record" "a11yphant_ses_verification_record" {
  zone_id = var.route53_zone_id
  name    = "_amazonses.${var.domain}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.a11yphant.verification_token]
}

resource "aws_route53_record" "a11yphant_ses_dkim_record" {
  zone_id = var.route53_zone_id
  name    = "${element(aws_ses_domain_dkim.a11yphant.dkim_tokens, count.index)}._domainkey"
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.a11yphant.dkim_tokens, count.index)}.dkim.amazonses.com"]
}
