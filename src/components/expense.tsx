import * as React from 'react';
import {Expense as TExpense} from './expenses-context';

const Expense = ({
  id,
  merchant,
  date,
  usdPrice,
  btcPrice
}: TExpense): JSX.Element => {
  return (
    <>
      <div>id: {id}</div>
      <div>merchant: {merchant}</div>
      <div>date: {date}</div>
      <div>usdPrice: {usdPrice}</div>
      <div>btcPrice: {btcPrice}</div>
    </>
  );
};

export {Expense};
