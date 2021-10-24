import { AxeLinkNameCheck } from "./checks/axe-link-name.check";
import { DocumentStartsWithHtml5Doctype } from "./checks/document-starts-with-html5-doctype.check";
import { ElementExists } from "./checks/element-exists.check";
import { ElementNotExists } from "./checks/element-not-exists.check";
import { HtmlIsValidCheck } from "./checks/html-is-valid.check";

export const checkToClassMap = {
  "axe-link-name": AxeLinkNameCheck,
  "html-is-valid": HtmlIsValidCheck,
  "element-exists": ElementExists,
  "element-not-exists": ElementNotExists,
  "document-starts-with-html5-doctype": DocumentStartsWithHtml5Doctype,
};

export const CHECK_TO_CLASS_MAP = "CHECK_TO_CLASS_MAP";
