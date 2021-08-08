import React from 'react';
import {AppProps} from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';
import {Header} from 'components/header';
import {SettingsProvider} from 'components/settings-context';
import {ExpenseProvider} from 'components/expenses-context';
import {BitcoinPriceProvider} from 'components/bitcoin-price-manager';
import {WavyDivider} from 'components/svg-patterns';

const MyApp = ({Component, pageProps}: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>Expensatron</title>
        <meta name="description" content="Bitcoin Expense Calculator"></meta>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <meta name="theme-color" content="#ffffff"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <SettingsProvider>
        <BitcoinPriceProvider>
          <ExpenseProvider>
            <div className="w-full">
              <WavyDivider />
              <Header />
              <Component {...pageProps} />
            </div>
          </ExpenseProvider>
        </BitcoinPriceProvider>
      </SettingsProvider>
    </>
  );
};

export default MyApp;
