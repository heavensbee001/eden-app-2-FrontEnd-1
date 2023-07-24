import { TalentListType } from "@eden/package-graphql/generated";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useMemo, useState } from "react";

export interface ISelectListProps {
  items: TalentListType[];
  btnBGcolor?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (items?: any) => void;
  // eslint-disable-next-line no-unused-vars
  newValue?: TalentListType;
  isDisabled?: boolean;
}

export const SelectList = ({
  items,
  onChange,
  newValue,
  isDisabled = false,
}: ISelectListProps) => {
  const [selected, setSelected] = useState<TalentListType | undefined>(
    items[0]
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
          <Listbox.Button className="text-edenGreen-600 relative flex w-full cursor-pointer items-center justify-between text-center text-xl focus:outline-none">
            <span className="font-Moret mr-2 block truncate font-bold">
              {selected?.name}
            </span>{" "}
            <span className="font-Unica text-edenGreen-500 mr-2 inline-block text-xs font-normal">{`(${selected?.talent?.length})`}</span>
            <ChevronDownIcon width={18} />
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
