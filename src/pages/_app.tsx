import React from 'react';
import {AppProps} from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';
import {Header} from 'components/header';
import {SettingsProvider} from 'components/settings-context';

const MyApp = ({Component, pageProps}: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>Expensatron</title>
        <meta name="description" content="Bitcoin Expense Calculator"></meta>
        {/* TODO: add favicons */}
        <meta name="theme-color" content="#ffffff"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <SettingsProvider>
        <div className="w-full">
          <Header />
          <Component {...pageProps} />
        </div>
      </SettingsProvider>
    </>
  );
};

export default MyApp;
