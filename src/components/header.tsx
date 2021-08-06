import * as React from 'react';
import {SettingsIcon} from './icons';

const Header = (): JSX.Element => {
  return (
    <header className="max-w-5xl mx-auto flex justify-between px-6 bg-gray-50">
      <div className="text-3xl">Bitcoin Expense Calculator</div>
      <SettingsIcon className="h-8 w-8 self-end" />
    </header>
  );
};

export {Header};
