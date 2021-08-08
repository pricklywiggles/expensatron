import {ExpenseList} from 'components/expense-list';
import {Settings} from 'components/settings';
import * as React from 'react';

const Home = (): JSX.Element => {
  return (
    <>
      <div className="max-w-5xl px-2 mx-auto mt-5 sm:mt-8">
        <div className="mx-auto py-3 sm:py-10">
          <ExpenseList />
        </div>
      </div>
      <Settings />
    </>
  );
};

export default Home;
