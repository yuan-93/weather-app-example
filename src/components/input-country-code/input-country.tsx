import clsx from "clsx";
import Select from "react-select";
import countries from "./countries.json";

type CountryOption = {
  label: string;
  value: string;
};

export interface InputCountryProps {
  name: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
}

const options = countries.map((e) => ({
  label: e.name,
  value: e.code,
}));

function InputCountry({
  name,
  required,
  placeholder = "",
  value,
  onChange,
}: InputCountryProps) {
  return (
    <Select<CountryOption>
      instanceId={"input-country"}
      name={name}
      required={required}
      placeholder={placeholder}
      classNamePrefix="react-select"
      unstyled
      components={{ IndicatorsContainer: () => null }}
      classNames={{
        container: (state) =>
          clsx(
            "relative sm:text-base text-xs w-full min-w-20 sm:min-w-32 max-w-20 sm:max-w-32",
            state.isFocused && "",
            state.isDisabled && "opacity-50"
          ),
        valueContainer: () => "cursor-text dark:text-white",
        placeholder: () => "opacity-80",
        menu: (state) =>
          clsx(
            "bg-white dark:bg-[#1A1A1A] relative my-2.5 shadow-md rounded-md border"
          ),
        menuList: () => clsx("m-1 rounded-md"),
        option: (state) =>
          clsx(
            "px-0.5 py-0.5",
            state.isFocused &&
              !state.isSelected &&
              "text-neutral-200 bg-neutral-400 rounded-md",
            state.isSelected && "bg-neutral-200 text-white rounded-md",
            state.isDisabled && "opacity-50"
          ),
        noOptionsMessage: () => "py-2",
      }}
      isClearable
      isSearchable
      options={options}
      value={options.find((option) => {
        return option.value === value;
      })}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      onChange={(option, actionType) => {
        let newVal;
        if (actionType.action !== "clear") {
          newVal = option?.value;
        }
        onChange?.(newVal);
      }}
    />
  );
}

export { InputCountry };
