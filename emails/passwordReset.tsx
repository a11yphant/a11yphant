import { Container, Font, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind } from "@react-email/components";
import * as React from "react";

const PasswordReset: React.FunctionComponent<{ passwordResetLink: string; displayName: string }> = (props) => {
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
            <title>a11yphant password reset</title>
          </Head>
          <Preview>
            Hey there, a password reset has been requested for your account. Please follow the link within this email to select a new password.
          </Preview>
          <Container className="px-2">
            {/* TODO: find out why URL is not working */}
            <Img src="https://a11yphant.com/images/logo/a11yphant_Logo_combination-mark_light.png" alt="Logo a11yphant" width="auto" height="70" />
            <Hr />
            <Heading as="h1" className="mt-8 leading-tight">
              In need of a new password?
            </Heading>
            <p className="mt-8">Hey {props.displayName},</p>
            <p>A password reset has been requested for your account.</p>
            <p className="mt-6 mb-10">
              If this was not you, don't do anything (especially not activating the link in this email). Otherwise, please follow the link below:
              <br />
              <br />
              <Link
                href={props.passwordResetLink}
                className="font-bold border-2 border-solid border-primary-light rounded-lg bg-primary-light text-dark px-2 py-2"
              >
                Reset password
              </Link>
            </p>
            <p>This link is valid for 24 hours.</p>
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

export default PasswordReset;
