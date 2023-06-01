import { Maybe } from "@eden/package-graphql/generated";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { Fragment, useEffect, useMemo, useState } from "react";

interface IItems {
  _id?: Maybe<string> | undefined;
  name?: Maybe<string> | undefined;
  [key: string]: any;
}

export interface ISelectListProps {
  items: IItems[];
  btnBGcolor?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (items?: any) => void;
  // eslint-disable-next-line no-unused-vars
  newValue?: IItems;
  isDisabled?: boolean;
}

export const SelectList = ({
  items,
  onChange,
  btnBGcolor = "bg-gray-200",
  newValue,
  isDisabled = false,
}: ISelectListProps) => {
  const [selected, setSelected] = useState<IItems | undefined>(items[0]);

  const btnClasses = clsx(
    "relative flex justify-between items-center w-full border border-gray-300 text-center cursor-pointer rounded-2xl py-1 px-3 shadow-xl hover:border-gray-500 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm",
    btnBGcolor,
    {
      "border-green-500": !isEmpty(selected),
    }
  );

  useMemo(() => {
    if (newValue && selected?._id !== newValue._id) {
      setSelected(newValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newValue]);

  useEffect(() => {
    onChange && onChange(selected);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div>
      <Listbox
        value={selected}
        multiple={false}
        onChange={setSelected}
        disabled={isDisabled}
      >
        <div className="relative">
          <Listbox.Button className={btnClasses}>
            <span className="mr-2 block truncate">{selected?.name}</span>
            <ChevronDownIcon width={12} />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="fixed z-50 mt-1 max-h-60 min-w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map((item, index) => (
                <Listbox.Option
                  key={`${item.name}-${index}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-4 pr-4 ${
                      active ? "bg-green-100 text-green-900" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
