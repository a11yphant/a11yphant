import { AXE_CHECKS_TO_CHECK_NAMES_MAP } from "./checks/axe-checks";
import { DocumentStartsWithHtml5Doctype } from "./checks/document-starts-with-html5-doctype.check";
import { ElementExists } from "./checks/element-exists.check";
import { ElementNotExists } from "./checks/element-not-exists.check";
import { HtmlIsValidCheck } from "./checks/html-is-valid.check";

export const checkToClassMap = {
  "html-is-valid": HtmlIsValidCheck,
  "element-exists": ElementExists,
  "element-not-exists": ElementNotExists,
  "document-starts-with-html5-doctype": DocumentStartsWithHtml5Doctype,
  ...AXE_CHECKS_TO_CHECK_NAMES_MAP,
};

export const CHECK_TO_CLASS_MAP = "CHECK_TO_CLASS_MAP";
