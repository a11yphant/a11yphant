// most default CSS is handled by JSDOM in https://github.com/jsdom/jsdom/blob/main/lib/jsdom/browser/default-stylesheet.js
// but some styles are missing for an unknown reason

// styling for links based on https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3
export const defaultLinkStylingCss = `
    :link { color: #0000EE; }
    :visited { color: #551A8B; }
    :link:active, :visited:active { color: #FF0000; }
    :link, :visited { text-decoration: underline; cursor: pointer; }
`;
