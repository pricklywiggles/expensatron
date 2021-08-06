import React from 'react';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Expensatron</title>
        <meta
          name="description"
          content="Jeff's Bitcoin Expense Calculator"
        ></meta>
        {/* TODO: add favicons */}
        <meta name="theme-color" content="#ffffff"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
