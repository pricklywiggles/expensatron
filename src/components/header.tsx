import * as React from 'react';
import {SettingsIcon} from './icons';
import {useSettings} from './settings-context';

const Header = (): JSX.Element => {
  const [, , , toggle] = useSettings();

  return (
    <>
      <header className="max-w-5xl mx-auto my-6 flex justify-between px-4 sm:px-6 ">
        <div className="font-thin font-bold text-3xl text-gray-900">
          Bitcoin Expense Calculator
        </div>
        <button
          className="inline-flex justify-center items-center h-12 rounded-full border border-transparent px-0 py-0 text-base font-medium text-white   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100 sm:text-sm"
          onClick={() => toggle()}
        >
          <SettingsIcon className="h-8 w-8  text-gray-500 hover:text-indigo-700" />
        </button>
      </header>
    </>
  );
};

export {Header};
