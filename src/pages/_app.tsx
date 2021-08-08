import React from 'react';
import {AppProps} from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';
import {Header} from 'components/header';
import {SettingsProvider} from 'components/settings-context';
import {ExpenseProvider} from 'components/expenses-context';
import {BitcoinPriceProvider} from 'components/bitcoin-price-manager';

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
        <BitcoinPriceProvider>
          <ExpenseProvider>
            <div className="w-full ">
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
