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
  placeholder,
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
            "relative text-base w-full",
            state.isFocused && "outline-none ring-2 ring-offset-2",
            state.isDisabled && "opacity-50"
          ),
        valueContainer: () => "cursor-text gap-2",
        placeholder: () => "opacity-80",
        menu: (state) =>
          clsx("bg-white relative my-2.5 shadow-md rounded-md border"),
        menuList: () => clsx("m-1 rounded-md"),
        option: (state) =>
          clsx(
            "px-4 py-1.5",
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
