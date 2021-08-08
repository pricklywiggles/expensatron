import {Fragment} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {DotsIcon, EditIcon} from './icons';
import {classNames} from 'lib/util';
import {TrashIcon} from '@heroicons/react/outline';

type OptionsPopoverProps = {
  onDelete: () => void;
  onEdit: () => void;
};

const OptionsPopover = ({
  onDelete,
  onEdit
}: OptionsPopoverProps): JSX.Element => {
  return (
    <div className="absolute">
      <Popover className="z-0 relative right-6 -top-5">
        {({open, close}) => (
          <>
            <div className="relative z-10">
              <Popover.Button
                className={classNames(
                  open ? 'text-gray-900' : 'text-gray-500',
                  'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                )}
              >
                <h2 className="sr-only">Solutions</h2>
                {/* <DotsIcon className="h-7 w-7 text-indigo-400" aria-hidden="true" /> */}
                <DotsIcon
                  className={classNames(
                    open ? 'text-gray-600' : 'text-gray-400',
                    'h-8 w-8 group-hover:text-gray-500'
                  )}
                  aria-hidden="true"
                />
              </Popover.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <Popover.Panel
                static
                className="absolute z-20 transform  text-gray-700 -left-32 -top-5 "
              >
                <div className="flex flex-col relative bg-gray-100 w-28 border rounded-xl shadow-xl">
                  <div className=" hover:bg-indigo-300 rounded-t-xl pt-2">
                    <button
                      onClick={() => {
                        close();
                        onEdit();
                      }}
                      className="inline-flex justify-between w-full items-center px-3"
                    >
                      <EditIcon className="-ml-1 mr-3 h-6 w-6" />
                      edit
                    </button>
                  </div>
                  <div className="hover:bg-indigo-300 rounded-b-xl pt-2">
                    <button
                      onClick={() => {
                        close();
                        onDelete();
                      }}
                      className="inline-flex justify-between w-full items-center px-3"
                    >
                      <TrashIcon className="-ml-1 mr-3 h-6 w-6" />
                      delete
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export {OptionsPopover};
