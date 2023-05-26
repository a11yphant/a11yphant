import { ElementContainsText } from "@/checks/element-contains-text.check";
import { ElementNotContainsText } from "@/checks/element-not-contains-text.check";

import { AXE_CHECKS_TO_CHECK_NAMES_MAP } from "./checks/axe-checks";
import { DocumentLanguageIsSpecified } from "./checks/document-language-is-specified.check";
import { DocumentStartsWithHtml5Doctype } from "./checks/document-starts-with-html5-doctype.check";
import { ElementExists } from "./checks/element-exists.check";
import { ElementNotExists } from "./checks/element-not-exists.check";
import { HtmlIsValidCheck } from "./checks/html-is-valid.check";

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
