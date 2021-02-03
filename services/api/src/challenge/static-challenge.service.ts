import { Injectable } from "@nestjs/common";

import { Challenge } from "./models/challenge.model";

@Injectable()
export class ChallengeService {
  async find(): Promise<Challenge> {
    return {
      id: "5557e647-7a14-47b7-b51c-142f25cc998c",
      name: "Accessible Links",
      levels: [
        {
          id: "5557e647-7a14-47b7-b51c-142f25cc998c",
          instructions: `Your friend Charles spent the last few weeks building a new website for his tech blog. But since he launched it, he keeps getting emails from frustrated readers reporting that they can’t access any links using their keyboard or screen readers.
Charles hasn’t been able to figure out the problem himself. Therefore, he asked you for help in this matter. He sent you a code snippet from his website, that you can find in the editor to the right.
TL; DR: Refactor the given code so that the link is navigable using input devices other than a mouse (e.g. keyboard or screen reader)`,
          requirements: [
            "The link can be activated using the mouse.",
            "The link can be focused using the keyboard.",
            "The link can be activated using the keyboard.",
            "The link can be detected as a link by screen readers.",
          ],
          hints: [
            "The browser has a native way of handling hyperlinks. You don’t need any JavaScript for that.",
            "The span element is certainly not the right choice here.",
            "You should try using the anchor element (<a>) for solving this task.",
          ],
          resources: [
            "Creating valid and accessible links: https://www.a11yproject.com/posts/2019-02-15-creating-valid-and-accessible-links/",
            "Setting up a screen reader in Google Chrome: https://chrome.google.com/webstore/detail/screen-reader/kgejglhpjiefppelpmljglcjbhoiplfn",
          ],
          startingCode: {
            html: `<h1>The Device Vibration API </h1>
<p> Today I learned about the device vibration API. This API allows you to control the vibration hardware of a phone from a website. There are some really good <span onlick="window.location = https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API" class="link">vibration API examples in the MDN docs</span>.</p>`,
            css: `html, body {
  font-family: Arial, sans-serif;
  font-size: 1rem;
  max-width: 80ch;
}

.link {
  color: black;
  text-decoration: none;
  border-bottom: 2px solid blue;
}

.link:hover, .link:active, .link:focus {
  color: darkblue;
  border-color: darkblue;
}`,
          },
        },
        {
          id: "0682b540-67cb-45b6-bdf3-692fb78e871d",
          instructions: `Your friend Charles has reached out for your help again. He wants to link to additional resources in his blog post, but he is not sure how to structure the additional resources section. Can you write the markup for him (you don't have to style it for now)?

Charles wants to add links to the following pages:
  - Introduction to web APIs https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction
  - Vibrationssss https://www.amorelie.at/sexspielzeug/vibratoren/mit-fernbedienung/
  - Can I use https://caniuse.com/vibration`,
          requirements: [
            "The links have to be in the same order as in the instructions.",
            "All three links can be activated using the mouse and keyboard.",
            "A screenreader can determine how many items are in the additional resources.",
          ],
          hints: [
            "Use what you have learned in level 1.",
            "The links should be grouped by a certain element.",
            "The additional resources are a list of links.",
          ],
          resources: [
            "https://webaim.org/techniques/hypertext/",
            "https://www.dummies.com/web-design-development/html5-and-css3/how-to-make-lists-of-links-for-html5-and-css3-programming/",
            "https://www.w3.org/TR/wai-aria-1.1/#list",
          ],
        },
      ],
    };
  }
}
