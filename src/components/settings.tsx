import {Component} from 'types/common';
import * as React from 'react';
import {Dialog, Listbox, Switch, Transition} from '@headlessui/react';
import {CalculationModes, RefreshModes, useSettings} from './settings-context';
import {useState} from 'react';
import {RadioGroup} from '@headlessui/react';
import {LightningBoltIcon} from './icons';
import {
  CheckIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  LibraryIcon
} from '@heroicons/react/outline';
import {classNames} from 'lib/util';

const Settings: Component = () => {
  const [settings, setSettings, isOpen, toggle] = useSettings();
  const [selected, setSelected] = useState(settings.mode);
  const [pollInterval, setPollInterval] = useState(
    settings.pollIntervalSeconds
  );
  const [enabled, setEnabled] = useState(
    settings.refresh === RefreshModes.AUTO
  );

  const onSave = () => {
    const settings = {
      mode: selected,
      refresh: enabled ? RefreshModes.AUTO : RefreshModes.MANUAL,
      pollIntervalSeconds: pollInterval
    };
    setSettings(settings);
    toggle();
  };

  const isSubmenuDisabled = selected === 0 || !enabled;

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={isOpen}
        onClose={toggle}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <RadioGroup value={selected} onChange={setSelected}>
                <RadioGroup.Label className="sr-only">
                  Refetch mode
                </RadioGroup.Label>
                <div className="space-y-4">
                  <RadioGroupOption
                    value={CalculationModes.PURCHASE}
                    Icon={DocumentTextIcon}
                    name="Receipt Date"
                    description="Use BTC price at date of purchase"
                  />
                  <RadioGroupOption
                    value={CalculationModes.MARKET}
                    Icon={LibraryIcon}
                    name="Market Rate"
                    description="Use current BTC price"
                  />
                </div>
              </RadioGroup>
              <div
                className={classNames(
                  'border mt-4 rounded-lg p-4 mb-16',
                  selected === 0 ? 'opacity-60' : ''
                )}
              >
                <div className="flex justify-between">
                  <Switch.Group as="div" className="flex items-center ">
                    <Switch
                      checked={enabled}
                      onChange={setEnabled}
                      disabled={selected === 0}
                      className={classNames(
                        enabled && !isSubmenuDisabled
                          ? 'bg-indigo-600'
                          : 'bg-gray-200',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          enabled ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                        )}
                      />
                    </Switch>
                    <Switch.Label as="span" className="ml-2">
                      <LightningBoltIcon
                        className={classNames(
                          'h-8 w-8',
                          enabled ? 'text-red-500' : 'text-gray-500'
                        )}
                        filled={enabled}
                      />
                    </Switch.Label>
                  </Switch.Group>
                  <Listbox
                    value={pollInterval}
                    onChange={setPollInterval}
                    disabled={isSubmenuDisabled}
                  >
                    {({open}) => (
                      <>
                        <Listbox.Label className="sr-only">
                          Change polling interval
                        </Listbox.Label>
                        <div
                          className={classNames(
                            'relative',
                            enabled ? '' : 'opacity-60'
                          )}
                        >
                          <div
                            className={classNames(
                              'inline-flex shadow-sm rounded-md divide-x',
                              isSubmenuDisabled
                                ? 'divide-white'
                                : 'divide-indigo-600'
                            )}
                          >
                            <div
                              className={classNames(
                                'relative z-0 inline-flex shadow-sm rounded-md divide-x',
                                isSubmenuDisabled
                                  ? 'divide-white'
                                  : 'divide-indigo-600'
                              )}
                            >
                              <div className="relative inline-flex items-center  py-2 pl-3 pr-4 border border-indigo-200 rounded-l-md shadow-sm text-white">
                                <p
                                  className={classNames(
                                    'ml-2.5 text-sm font-medium',
                                    isSubmenuDisabled
                                      ? 'text-gray-500'
                                      : 'text-indigo-600'
                                  )}
                                >
                                  {pollInterval} seconds.
                                </p>
                              </div>
                              <Listbox.Button className="relative inline-flex items-center disabled:bg-gray-400 bg-indigo-500 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                                <span className="sr-only">
                                  Change polling interval
                                </span>
                                <ChevronDownIcon
                                  className="h-5 w-5 text-white"
                                  aria-hidden="true"
                                />
                              </Listbox.Button>
                            </div>
                          </div>
                          <Transition
                            show={open}
                            as={React.Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              static
                              className="origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <ListBoxOption label="10 sec" value={10} />
                              <ListBoxOption label="30 sec" value={30} />
                              <ListBoxOption label="60 sec" value={60} />
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                <div
                  className={classNames(
                    'text-gray-500 mt-4',
                    selected === 0 ? 'text-white' : ''
                  )}
                >
                  {enabled
                    ? `Refetching BTC Price every ${pollInterval} seconds`
                    : 'Refetching BTC Price Manually'}
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center items-center w-full h-12 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={onSave}
                >
                  Save
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

type RadioGroupOptionProps = {
  Icon: Component;
  name: string;
  description: string;
  value: number;
};
const RadioGroupOption = ({
  Icon,
  name,
  description,
  value
}: RadioGroupOptionProps) => (
  <RadioGroup.Option
    value={value}
    className={({active}) =>
      classNames(
        active
          ? 'ring-1 ring-offset-2 ring-indigo-500 bg-indigo-100'
          : 'bg-white',
        'relative block rounded-lg border border-gray-300  shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 sm:flex sm:justify-between focus:outline-none'
      )
    }
  >
    {({checked}) => (
      <>
        <div className="flex flex-row gap-3 items-center w-full ">
          <Icon
            className={classNames(
              'h-8 w-8',
              checked ? 'text-indigo-600' : 'text-gray-700'
            )}
          />
          <div className="text-sm ">
            <RadioGroup.Label as="p" className="font-medium text-gray-900">
              {name}
            </RadioGroup.Label>
            <RadioGroup.Description as="div" className="text-gray-500">
              <p className="sm:inline">{description}</p>
            </RadioGroup.Description>
          </div>
        </div>
        <div
          className={classNames(
            checked ? 'border-indigo-500' : 'border-transparent',
            'absolute -inset-px rounded-lg border-2 pointer-events-none'
          )}
          aria-hidden="true"
        />
      </>
    )}
  </RadioGroup.Option>
);

type ListBoxOptionProps = {
  label: string;
  value: number;
};
const ListBoxOption = ({label, value}: ListBoxOptionProps) => (
  <Listbox.Option
    className={({active}) =>
      classNames(
        active ? 'text-white bg-indigo-500' : 'text-gray-900',
        'cursor-default select-none relative p-4 text-sm'
      )
    }
    value={value}
  >
    {({selected, active}) => (
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className={selected ? 'font-semibold' : 'font-normal'}>{label}</p>
          {selected ? (
            <span className={active ? 'text-white' : 'text-indigo-500'}>
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
        </div>
      </div>
    )}
  </Listbox.Option>
);

export {Settings};
