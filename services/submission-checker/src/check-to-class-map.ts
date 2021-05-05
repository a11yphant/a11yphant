import { AxeLinkNameCheck } from "./checks/axe-link-name.check";
import { HtmlIsValidCheck } from "./checks/html-is-valid.check";

export const checkToClassMap = {
  "axe-link-name": AxeLinkNameCheck,
  "html-is-valid": HtmlIsValidCheck,
};

export const CHECK_TO_CLASS_MAP = "CHECK_TO_CLASS_MAP";
