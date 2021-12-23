import Footer from "app/components/Footer";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import Head from "next/head";
import React from "react";

const Settings: React.FunctionComponent = () => {
  // TODO: check if a user is logged in via Twitter or Github
  const userGitHub = true;
  const userTwitter = false;

  return (
    <>
      <Head>
        <title>Settings | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Change your email or password for your user account on a11yphant." />
        <meta property="og:title" content="Settings" />
        <meta property="og:description" content="Change your email or password for your user account on a11yphant." />
        <meta property="og:image" content="/images/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        <meta property="og:locale" content="en" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.a11yphant.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
        <div className={clsx(" mx-8 py-8 h-main max-w-screen-3xl mt-12", "sm:mx-12 sm:mt-24", "lg:mx-24")}>
          <div className={clsx("flex flex-col justify-between content-start pb-6 mb-20 border-grey-light border-b", "md:flex-row md:content-end")}>
            <div className={clsx("md:self-end")}>
              <h1 className={clsx("pb-2.5 pr-4 text-grey", "h3", "sm:h2")}>Settings</h1>
              <p className={clsx("text-grey-middle")}>Change your user preferences</p>
            </div>
          </div>

          <h2 className={clsx("mb-6", "h4", "sm:h3")}>Account</h2>

          <section className={clsx("mb-16")}>
            <h3 className={clsx("mb-2.5", "h5", "sm:h4")}>Email</h3>
            {userGitHub && <p>To change your email address, please do so in your GitHub profile.</p>}
            {userTwitter && <p>To change your email address, please do so in your Twitter profile.</p>}
            {/* TODO: add form to change email */}
          </section>

          <section className={clsx("mb-16")}>
            <h3 className={clsx("mb-2.5", "h5", "sm:h4")}>Password</h3>
            {userGitHub && <p>To change your passwort for this account, please do so in your GitHub profile.</p>}
            {userTwitter && <p>To change your passwort for this account, please do so in your Twitter profile.</p>}
            {/* TODO: add form to change Password */}
          </section>

          {/* TODO: add functionality to delete the account or remove this comment*/}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Settings;
