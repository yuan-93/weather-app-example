"use client";

import { useState, type FormEvent } from "react";
import {
  InputCountry,
  InputCountryProps,
} from "./input-country-code/input-country";
import { SearchIcon } from "lucide-react";

export interface SearchWeatherFormProps {
  onSubmit: (formData: { city: string; countryCode: string }) => void;
}

function SearchWeatherForm({ onSubmit }: SearchWeatherFormProps) {
  const [status, setStatus] = useState<"loading" | "idle">("idle");
  const [error, setError] = useState<Error | undefined>();
  const [countryCode, setCountryCode] = useState<string | undefined>();

  const onChange: InputCountryProps["onChange"] = (val) => {
    setCountryCode(val);
  };

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setStatus("loading");
      event.preventDefault();
      const city = (document.getElementById("input-city") as HTMLInputElement)
        .value;

      if (!city || !countryCode) {
        throw new Error("Please fill out the field");
      }
      onSubmit({ city, countryCode });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      }
      console.error(error);
    }
  };

  return (
    <form id="weather-search-form" onSubmit={handleOnSubmit} className="w-full">
      <div className="flex flex-row w-full gap-2">
        <div className="border flex flex-row rounded-xl px-2 flex-1 bg-white/20">
          <div className="flex flex-col min-w-40 pl-4">
            <label htmlFor="input-country" className="text-[10px]">
              Country
            </label>
            <InputCountry
              name="input-country"
              required
              onChange={onChange}
              value={countryCode}
            />
          </div>
          <div className="border-l my-2 border-black" />
          <div className="flex flex-col w-full pl-4">
            <label htmlFor="input-city" className="text-[10px]">
              City
            </label>
            <input
              id="input-city"
              name="input-city"
              type="text"
              className="bg-transparent h-auto"
              required
            />
          </div>
        </div>
        <button
          className="px-4 rounded-xl bg-[#6C40B5] text-white"
          type="submit"
        >
          <SearchIcon />
        </button>
      </div>
      {error && <p className="text-red-400">{error.message}</p>}
    </form>
  );
}

export { SearchWeatherForm };
