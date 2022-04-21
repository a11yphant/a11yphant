import Footer from "app/components/Footer";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const PrivacyPolicy: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Details about the privacy policy of a11yphant." />
        <meta property="og:title" content="Privacy Policy" />
        <meta property="og:description" content="Details about the privacy policy of a11yphant." />
        <meta property="og:image" content="/images/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        <meta property="og:locale" content="en" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://a11yphant.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/images/mockups-social-media.jpg" />
        <meta name="twitter:title" content="Privacy Policy" />
        <meta
          name="twitter:description"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
        <div className={clsx(" mx-8 py-8 h-main max-w-screen-3xl mt-12", "sm:mx-12 sm:mt-24", "lg:mx-24")}>
          <h1 className={clsx("mb-8", "h2", "md:h1")}>Privacy Policy</h1>
          <p className={clsx("italic mb-8")}>Last updated at January 01, 2022</p>

          <section role="contentinfo" aria-label="Purpose of the Privacy Policy">
            <p>
              Thank you for choosing to be part of our community at a11yphant be the University of Applied Sciences Salzburg ("Company," "we," "us,"
              or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns
              about this privacy notice or our practices with regard to your personal information, please contact us at{" "}
              <Link href={"mailto:info@a11yphant.com"}>
                <a
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  info@a11yphant.com
                </a>
              </Link>
              .
            </p>

            <p className={clsx("mt-10")}>This privacy notice describes how we might use your information if you:</p>
            <ul className={clsx("list-disc ml-6 mb-8")}>
              <li className={clsx("m-0 my-4")}>
                Visit our website at{" "}
                <Link href={"https://a11yphant.com"}>
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    a11yphant.com
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>Engage with us in other related ways ― including any sales, marketing, or events</li>
            </ul>

            <p className={clsx("mt-10")}>In this privacy notice, if we refer to:</p>
            <ul className={clsx("list-disc ml-6 mb-8")}>
              <li className={clsx("m-0 my-4")}>
                <strong>"Website"</strong>," we are referring to any website of ours that references or links to this policy
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>"Services"</strong>, we are referring to our Website, and other related services, including any sales, marketing, or events
              </li>
            </ul>

            <p className={clsx("mt-10")}>
              The purpose of this privacy notice is to explain to you in the clearest way possible what information we collect, how we use it, and
              what rights you have in relation to it. If there are any terms in this privacy notice that you do not agree with, please discontinue use
              of our Services immediately.
            </p>

            <p>
              <strong>
                Please read this privacy notice carefully, as it will help you understand what we do with the information that we collect.
              </strong>
            </p>
          </section>

          <section role="contentinfo" aria-label="Table of contents" className={clsx("my-16")}>
            <h2 className={clsx("mb-8", "h4", "md:h3")}>Table of contents</h2>
            <ul className={clsx("list-decimal ml-8 mb-8")}>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter1">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    What information do we collect?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter2">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    How do we use your information?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter3">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    Will your information be shared with anyone?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter4">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    Do we use cookies and other tracking technologies?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter5">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    How do we handle your social logins?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter6">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    How long do we keep your information?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter7">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    How do we keep your information safe?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter8">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    What are your privacy rights?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter9">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    Controls for do not track features
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter10">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    Do we make updates to this notice?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter11">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    How can you contact us about this notice?
                  </a>
                </Link>
              </li>
              <li className={clsx("m-0 my-4")}>
                <Link href="#chapter12">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    How can you review, update or delete the data we collect from you?
                  </a>
                </Link>
              </li>
            </ul>
          </section>

          <section role="contentinfo" aria-label="What information do we collect?" className={clsx("my-16")}>
            <h2 id="chapter1" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>1.</span> What information do we collect?
            </h2>
            <p>
              <strong>Personal information you disclose to us.</strong>
            </p>
            <p>
              <i>In short: We collect personal information that you provide to us.</i>
            </p>

            <p className={clsx("mt-10")}>
              We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining
              information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
            </p>
            <p>
              The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and
              the products and features you use. The personal information we collect may include the following:
            </p>
            <ul className={clsx("list-disc ml-6 mb-8")}>
              <li className={clsx("m-0 my-4")}>
                <strong>Personal Information Provided by you.</strong> We collect names; email addresses; usernames; passwords; and other similar
                information.
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media
                account details, like your Twitter and GitHub account. If you choose to register in this way, we will collect the information
                described in the section called{" "}
                <Link href="#chapter5">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    "how do we handle your social logins"
                  </a>
                </Link>{" "}
                below.
              </li>
            </ul>

            <p className={clsx("mt-10")}>
              All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such
              personal information.
            </p>
          </section>

          <section role="contentinfo" aria-label="How do we use your information?" className={clsx("my-16")}>
            <h2 id="chapter2" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>2.</span> How do we use your information?
            </h2>
            <p>
              <i>
                In short: We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you,
                compliance with our legal obligations, and/or your consent..
              </i>
            </p>

            <p className={clsx("mt-10")}>
              We use personal information collected via our Website for a variety of business purposes described below. We process your personal
              information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you,
              with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each
              purpose listed below.
            </p>
            <p>We use the information we collect or receive:</p>
            <ul className={clsx("list-disc ml-6 mb-8")}>
              <li className={clsx("m-0 my-4")}>
                <strong>To facilitate account creation and login process.</strong> If you choose to link your account with us to a third-party account
                (such as your Twitter or Github account), we use the information you allowed us to collect from those third parties to facilitate
                account creation and login process for the performance of the contract. See the section below headed{" "}
                <Link href="#chapter5">
                  <a
                    className={clsx(
                      "text-light font-sans font-normal border-light",
                      "transition-colors duration-300",
                      "hover:text-primary-light hover:border-transparent",
                      "focus-rounded-instead-of-underline",
                    )}
                  >
                    "how do we handle your social logins"
                  </a>
                </Link>{" "}
                for further information.
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>Request feedback.</strong> We may use your information to request feedback and to contact you about your use of our Website.
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>To manage user accounts.</strong> We may use your information for the purposes of managing our account and keeping it in
                working order.
              </li>
            </ul>
          </section>

          <section role="contentinfo" aria-label="Will your information be shared with anyone?" className={clsx("my-12")}>
            <h2 id="chapter3" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>3.</span> Will your information be shared with anyone?
            </h2>
            <p>
              <i>
                In short: We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or
                to fulfill business obligations.
              </i>
            </p>

            <p className={clsx("mt-10")}>We may process or share your data that we hold based on the following legal basis:</p>
            <ul className={clsx("list-disc ml-6 mb-8")}>
              <li className={clsx("m-0 my-4")}>
                <strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a
                specific purpose.
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>Legitimate Interests:</strong> We may process your data when it is reasonably 􏰀 necessary to achieve our legitimate business
                interests.
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information
                to fulfill the terms of our contract.
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with
                applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a
                subpoena (including in response to public authorities to meet national security or law enforcement requirements).
              </li>
              <li className={clsx("m-0 my-4")}>
                <strong>Vital Interests:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take
                action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any
                person and illegal activities, or as evidence in litigation in which we are involved.
              </li>
            </ul>

            <p className={clsx("mt-10")}>
              More specifically, we may need to process your data or share your personal information in the following situations:
            </p>
            <ul className={clsx("list-disc ml-6 mb-8")}>
              <li className={clsx("m-0 my-4")}>
                <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any
                merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
              </li>
            </ul>
          </section>

          <section role="contentinfo" aria-label="Do we use cookies and other tracking technologies?" className={clsx("my-16")}>
            <h2 id="chapter4" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>4.</span> Do we use cookies and other tracking technologies?
            </h2>
            <p>
              <i>
                In short: We do not use third-party cookies and other tracking technologies to collect and store your information. But we do use a
                session cookie.
              </i>
            </p>

            <h3 className={clsx("mt-10 mb-4", "h5", "md:h4")}>Third-party cookies</h3>
            <p>
              We do not use cookies or similar tracking technologies (like web beacons and pixels) to access or store information. We integrated the
              tool{" "}
              <Link href={"https://splitbee.io/"}>
                <a
                  target={"_blank"}
                  rel="noopener noreferrer nofollow"
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  splitbee
                </a>
              </Link>{" "}
              into our website. However, we enabled the cookie-less mode and do not forward any personal information tho this service.
            </p>

            <h3 className={clsx("mt-10 mb-4", "h5", "md:h4")}>Functional cookies</h3>
            <p>We use a functional session cookie called "a11yphant-session" to handle the login process and assigning submissions to a user.</p>
          </section>

          <section role="contentinfo" aria-label="How do we handle your social logins?" className={clsx("my-16")}>
            <h2 id="chapter5" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>5.</span> How do we handle your social logins?
            </h2>
            <p>
              <i>
                In short: If you choose to register or log in to our services using a social media account, we may have access to certain information
                about you.
              </i>
            </p>

            <p className={clsx("mt-10")}>
              Our Website offers you the ability to register and login using your third-party social media account details (like your GitHub or
              Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The
              profile information we receive may vary depending on the social media provider concerned, but will often include your name, username,
              profile picture as well as other information you choose to make public on such social media platform.
            </p>
            <p>
              We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear
              to you on the relevant Website. Please note that we do not control, and are not responsible for, other uses of your personal information
              by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use and
              share your personal information, and how you can set your privacy preferences on their sites and apps.
            </p>
          </section>

          <section role="contentinfo" aria-label="How long do we keep your information?" className={clsx("my-16")}>
            <h2 id="chapter6" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>6.</span> How long do we keep your information?
            </h2>
            <p>
              <i>
                In short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise
                required by law.
              </i>
            </p>

            <p className={clsx("mt-10")}>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a
              longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this notice
              will require us keeping your personal information for longer than the period of time in which users have an account with us.
            </p>
            <p>
              When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such
              information, or, if this is 􏰀 not possible (for example, because your personal information has been stored in backup archives), then we
              will securely store your personal information and isolate it from any further processing until deletion is possible.
            </p>
          </section>

          <section role="contentinfo" aria-label="How do we keep your information safe?" className={clsx("my-16")}>
            <h2 id="chapter7" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>7.</span> How do we keep your information safe?
            </h2>
            <p>
              <i>In short: We aim to protect your personal information through a system of organizational and technical security measures.</i>
            </p>

            <p className={clsx("mt-10")}>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal
              information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the
              Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers,
              cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or
              modify your information. Although we will do our best to protect your personal information, transmission of personal information to and
              from our Website is at your own risk. You should only access the Website within a secure environment.
            </p>
          </section>

          <section role="contentinfo" aria-label="What are your privacy rights?" className={clsx("my-16")}>
            <h2 id="chapter8" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>8.</span> What are your privacy rights?
            </h2>
            <p>
              <i>
                In short: In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater
                access to and control over your personal information. You may review, change, or terminate your account at any time.
              </i>
            </p>

            <p className={clsx("mt-10")}>
              In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to
              request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the
              processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the
              right to object to the processing of your personal information. To make such a request, please use the contact details provided below.
              We will consider and act upon any request in accordance with applicable data protection laws.
            </p>
            <p>
              If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please
              note however that this will not affect the lawfulness of the processing before its withdrawal, nor will it affect the processing of your
              personal information conducted in reliance on lawful processing grounds other than consent.
            </p>
            <p>
              If you are a resident in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right
              to{" "}
              <Link href={"https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"}>
                <a
                  target={"_blank"}
                  rel="noopener noreferrer nofollow"
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  complain to your local data protection supervisory authority
                </a>
              </Link>
              .
            </p>
            <p>
              If you are a resident in Switzerland,{" "}
              <Link href={"https://www.edoeb.admin.ch/edoeb/en/home.html"}>
                <a
                  target={"_blank"}
                  rel="noopener noreferrer nofollow"
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  contact this data protection supervisory authority
                </a>
              </Link>
              .
            </p>
            <p>
              If you have questions or comments about your privacy rights, you may email us at{" "}
              <Link href={"mailto:info@a11yphant.com"}>
                <a
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  info@a11yphant.com
                </a>
              </Link>
              .
            </p>

            <h3 className={clsx("mt-10 mb-4", "h5", "md:h4")}>Account Information</h3>
            <p>
              If you would at any time like to review or change the information in your account or terminate your account, you can{" "}
              <Link href={"mailto:info@a11yphant.com"}>
                <a
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  contact us
                </a>
              </Link>
              .
            </p>
            <p>
              Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases.
              However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce
              our Terms of Use and/or comply with applicable legal requirements.
            </p>

            <h3 className={clsx("mt-10 mb-4", "h5", "md:h4")}>Cookies and similar technologies</h3>
            <p>
              Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and
              to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Website.
            </p>
          </section>

          <section role="contentinfo" aria-label="Controls for do not track features" className={clsx("my-16")}>
            <h2 id="chapter9" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>9.</span> Controls for do not track features
            </h2>
            <p>
              Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can
              activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage
              no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to
              DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for
              online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this
              privacy notice.
            </p>
          </section>

          <section role="contentinfo" aria-label="Do we make updates to this notice" className={clsx("my-16")}>
            <h2 id="chapter10" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>10.</span> Do we make updates to this notice?
            </h2>
            <p>
              <i>In short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</i>
            </p>

            <p className={clsx("mt-10")}>
              We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated
              version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by
              prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice
              frequently to be informed of how we are protecting your information.
            </p>
          </section>

          <section role="contentinfo" aria-label="How can you contact us about this notice?" className={clsx("my-16")}>
            <h2 id="chapter11" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>11.</span> How can you contact us about this notice?
            </h2>
            <p>
              If you have questions or comments about this notice, you may email us at{" "}
              <Link href={"mailto:info@a11yphant.com"}>
                <a
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  info@a11yphant.com
                </a>
              </Link>{" "}
              or by post to:
            </p>
            <address className={clsx("not-italic")}>
              <strong>University of Applied Sciences Salzburg</strong> <br />
              Urstein Süd 1 <br />
              5412 Puch bei Hallein <br />
              Austria
            </address>
          </section>

          <section role="contentinfo" aria-label="How can you review, update or delete the data we collect from you?" className={clsx("my-16")}>
            <h2 id="chapter12" className={clsx("mb-8", "h4", "md:h3")}>
              <span className={clsx("not-sr-only", "h4", "md:h3")}>12.</span> How can you review, update or delete the data we collect from you?
            </h2>
            <p>
              Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you,
              change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please{" "}
              <Link href={"mailto:info@a11yphant.com"}>
                <a
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  send us an email
                </a>
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
