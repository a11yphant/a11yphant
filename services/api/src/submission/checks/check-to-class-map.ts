import { AXE_CHECKS_TO_CHECK_NAMES_MAP } from "./axe-checks";
import {
  DocumentLanguageIsSpecified,
  DocumentStartsWithHtml5Doctype,
  ElementContainsText,
  ElementExists,
  ElementNotContainsText,
  ElementNotExists,
  HtmlIsValidCheck,
} from "./base-checks";

export const checkToClassMap = {
  "html-is-valid": HtmlIsValidCheck,
  "element-exists": ElementExists,
  "element-not-exists": ElementNotExists,
  "element-contains-text": ElementContainsText,
  "element-not-contains-text": ElementNotContainsText,
  "document-language-is-specified": DocumentLanguageIsSpecified,
  "document-starts-with-html5-doctype": DocumentStartsWithHtml5Doctype,
  ...AXE_CHECKS_TO_CHECK_NAMES_MAP,
};

export const CHECK_TO_CLASS_MAP = "CHECK_TO_CLASS_MAP";
