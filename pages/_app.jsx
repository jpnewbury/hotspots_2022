import React from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import "../Styles/main.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Hot Spots for Trout</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
