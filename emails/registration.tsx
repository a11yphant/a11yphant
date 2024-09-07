import { Container, Font, Head, Heading, Hr, Html, Img, Link, Preview } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

const Registration: React.FunctionComponent<{ confirmationLink: string; displayName: string }> = (props) => {
  return (
    <>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                light: "#FFFFFF",
                dark: "#121212",
                primary: {
                  DEFAULT: "#7331FF",
                  light: "#B795FF",
                  dark: "#5719D9",
                  text: "#7b78f9",
                },
                background: {
                  DEFAULT: "#121212",
                  light: "#202226",
                },
                grey: {
                  DEFAULT: "#EDEDED",
                  light: "#EFEFEF",
                  middle: "#B4B8B8",
                  dark: "#4F4F4F",
                },
              },
              fontFamily: {
                sans: ['"IBM Plex Sans"', "sans-serif"],
                mono: ['"IBM Plex Mono"', "monospace"],
              },
            },
          },
        }}
      >
        <Html className="font-sans tracking-wide break-words bg-background text-grey text-lg leading-relaxed">
          <Head>
            <Font
              fontFamily="IBM Plex Sans"
              fallbackFontFamily="sans-serif"
              webFont={{
                url: "https://a11yphant.com/fonts/ibm-plex-sans/ibm-plex-sans-regular.woff2",
                format: "woff2",
              }}
              fontWeight={400}
              fontStyle="normal"
            />
            <title>a11yphant registration</title>
          </Head>
          <Preview>
            Welcome to a11yphant! Confirm your registration by activating the link within this email. Start your accessibility journey today!
          </Preview>
          <Container className="px-2">
            {/* TODO: change image URL */}
            {/* https://a11yphant.com/images/logo/a11yphant_Logo_combination-mark_light.png */}
            <Img src="https://a11yphant.com/images/logo/a11yphant_Logo_combination-mark_light.png" alt="Logo a11yphant" width="auto" height="70" />
            <Hr />
            <Heading as="h1" className="mt-8 leading-tight">
              Welcome to the community!
            </Heading>
            <p className="mt-8">Hey {props.displayName},</p>
            <p>You're almost ready to start your accessibility journey on a11yphant. 🐘✨</p>
            <p>
              We're thrilled you're joining over 2000 other registered users to start making the web a more accessible place for everyone. You're now
              part of a community that's all about learning, growing and making a real difference in digital accessibility.
            </p>
            <p className="mt-8 mb-10">
              Before you can dive in, we just need one more thing:
              <br />
              <br />
              <Link
                href={props.confirmationLink}
                className="font-bold border-2 border-solid border-primary-light rounded-lg bg-primary-light text-dark px-2 py-2"
              >
                Confirm your e-mail address
              </Link>
            </p>
            <p>
              This link is valid for 24 hours. Once you've confirmed your registration, you'll be ready to save your progress, track your stats and
              start improving your accessibility skills - completely free of charge.
            </p>
            <p>
              If you have any questions or problems, don't hesitate to drop us a line at{" "}
              <Link
                href="mailto:info@a11yphant.com"
                className="border-t-0 border-x-0 border-b-2 border-solid border-primary-light text-primary-light"
              >
                info@a11yphant.com
              </Link>
              , or contact us on{" "}
              <Link
                href="https://www.linkedin.com/company/a11yphant"
                className="border-t-0 border-x-0 border-b-2 border-solid border-primary-light text-primary-light"
              >
                LinkedIn
              </Link>{" "}
              or{" "}
              <Link href="https://x.com/a11yphant" className="border-t-0 border-x-0 border-b-2 border-solid border-primary-light  text-primary-light">
                X/Twitter
              </Link>
              . We're always happy to help.
            </p>
            <p className="mt-6 mb-8">Cheers!</p>

            <p className="leading-relaxed">
              <strong className="text-md">a11yphant</strong>
              <br />
              <span className="text-sm ">Learning web accessibility made easy</span>
            </p>
            <p className="text-sm leading-loose mb-6">
              <Link href="https://a11yphant.com" className="border-t-0 border-x-0 border-b-2 border-solid border-primary-light  text-primary-light">
                a11yphant.com
              </Link>
              <br />
              <Link
                href="mailto:info@a11yphant.com"
                className="border-t-0 border-x-0 border-b-2 border-solid border-primary-light  text-primary-light"
              >
                info@a11yphant.com
              </Link>
            </p>
            <Hr className="mb-20" />
          </Container>
        </Html>
      </Tailwind>
    </>
  );
};

export default Registration;
