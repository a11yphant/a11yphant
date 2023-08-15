import { AXE_CHECKS_TO_CHECK_NAMES_MAP } from "./axe-checks";
import {
  ColorContrastGreaterThanOrEqual,
  DocumentLanguageIsSpecified,
  DocumentStartsWithHtml5Doctype,
  ElementContainsText,
  ElementExists,
  ElementHasCssPropertyValue,
  ElementHasCssPropertyValueGreaterThan,
  ElementNotContainsText,
  ElementNotExists,
  HtmlIsValid,
} from "./base-checks";

export const checkToClassMap = {
  "html-is-valid": HtmlIsValid,
  "element-exists": ElementExists,
  "element-has-css-property-value": ElementHasCssPropertyValue,
  "element-has-css-property-value-greater-than": ElementHasCssPropertyValueGreaterThan,
  "element-not-exists": ElementNotExists,
  "element-contains-text": ElementContainsText,
  "element-not-contains-text": ElementNotContainsText,
  "document-language-is-specified": DocumentLanguageIsSpecified,
  "document-starts-with-html5-doctype": DocumentStartsWithHtml5Doctype,
  "color-contrast-greater-than-or-equal": ColorContrastGreaterThanOrEqual,
  ...AXE_CHECKS_TO_CHECK_NAMES_MAP,
};

export const CHECK_TO_CLASS_MAP = "CHECK_TO_CLASS_MAP";
