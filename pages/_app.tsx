import React from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import { StyleProvider } from "../src/styles/StyleProvider";
import "modern-normalize";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  const { theme } = router.query;
  const v3SelectedPalettes = theme === "light" ? "light" : "dark";

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <title>Ledger Gun</title>
      </Head>
      <StyleProvider selectedPalette={v3SelectedPalettes}>
        <Component {...pageProps} />
      </StyleProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
