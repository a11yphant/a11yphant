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
            { id: "036b54a7-62c3-4c3c-ab84-dcdc80888add", title: "The link can be activated using the mouse." },
            { id: "4573b54f-cb36-46ee-9e23-34de0fa301a4", title: "The link can be focused using the keyboard." },
            { id: "4199dc41-c225-473d-aff0-45c6ada992a6", title: "The link can be activated using the keyboard." },
            { id: "1f14ad50-3ce5-4c1a-8cad-9ca339bf70ca", title: "The link can be detected as a link by screen readers." },
          ],
          hints: [
            {
              id: "344c6772-2948-4a2d-838e-1b4e79f6fee9",
              content: "The browser has a native way of handling hyperlinks. You don’t need any JavaScript for that.",
            },
            { id: "08ee3773-d9ba-4c5e-ba8c-2c653d3199de", content: "The span element is certainly not the right choice here." },
            { id: "9e8249de-fce9-4e9d-96b1-77a5667daec9", content: "You should try using the anchor element (<a>) for solving this task." },
          ],
          resources: [
            {
              id: "c584b8a5-1d62-45bc-a442-9aa662b7aa02",
              title: "Creating valid and accessible links",
              link: "https://www.a11yproject.com/posts/2019-02-15-creating-valid-and-accessible-links/",
            },
            {
              id: "bb1968e4-ece5-4708-8aab-6325da81f46e",
              title: "Setting up a screen reader in Google Chrome",
              link: "https://chrome.google.com/webstore/detail/screen-reader/kgejglhpjiefppelpmljglcjbhoiplfn",
            },
          ],
          code: {
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
            { id: "37ecfa42-2365-4447-84be-050a966cd1e2", title: "The links have to be in the same order as in the instructions." },
            { id: "d7847b28-acde-49aa-b569-5aac195b9719", title: "All three links can be activated using the mouse and keyboard." },
            { id: "b7685cf5-5ff2-492d-99dc-ad4806d69036", title: "A screenreader can determine how many items are in the additional resources." },
          ],
          hints: [
            { id: "7cd5af2b-3fb8-4fac-912f-39951b19c868", content: "Use what you have learned in level 1." },
            { id: "1b74d751-625f-4911-b3d8-f8778be33b38", content: "The links should be grouped by a certain element." },
            { id: "032a911c-0723-4ad5-9d9c-b167bcc2ec64", content: "The additional resources are a list of links." },
          ],
          resources: [
            { id: "05ee510a-d716-4b54-9324-04fc251ecd78", title: "", link: "https://webaim.org/techniques/hypertext/" },
            {
              id: "d74ca26c-bb0b-49de-968d-60a3fad85836",
              title: "",
              link: "https://www.dummies.com/web-design-development/html5-and-css3/how-to-make-lists-of-links-for-html5-and-css3-programming/",
            },
            { id: "98d54060-bedd-409e-9096-fc6830978ac6", title: "", link: "https://www.w3.org/TR/wai-aria-1.1/#list" },
          ],
        },
      ],
    };
  }
}
