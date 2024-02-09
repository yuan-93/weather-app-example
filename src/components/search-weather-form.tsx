"use client";

import { useState, type FormEvent, useEffect } from "react";
import {
  InputCountry,
  InputCountryProps,
} from "./input-country-code/input-country";
import { SearchIcon } from "lucide-react";

export interface SearchWeatherFormProps {
  onSubmit: (formData: { city: string; countryCode: string }) => Promise<void>;
}

function SearchWeatherForm({ onSubmit }: SearchWeatherFormProps) {
  const [status, setStatus] = useState<"loading" | "idle">("idle");
  const [error, setError] = useState<Error | undefined>();
  const [countryCode, setCountryCode] = useState<string | undefined>();

  useEffect(() => {
    if (status === "loading") {
      setError(undefined);
    }
  }, [status]);

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
      await onSubmit({ city, countryCode });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      }
      console.error(error);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <>
      <form
        id="weather-search-form"
        onSubmit={handleOnSubmit}
        className=" max-w-full"
      >
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-row rounded-2xl h-10 sm:h-[60px] px-2.5 sm:px-4 gap-2.5 sm:gap-4 flex-1 bg-white/20">
            <div className="relative flex items-center">
              <label
                htmlFor="input-country"
                className="sm:text-[0.625rem] text-[0.5rem] absolute top-1 text-black/40"
              >
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
            <div className="relative flex items- w-full">
              <label
                htmlFor="input-city"
                className="sm:text-[0.625rem] text-[0.5rem] absolute top-1 text-black/40"
              >
                City
              </label>
              <input
                id="input-city"
                name="input-city"
                type="text"
                className="bg-transparent h-auto sm:text-base text-xs focus:outline-none"
                required
              />
            </div>
          </div>
          <button
            className="px-4 rounded-2xl bg-[#6C40B5] text-white"
            type="submit"
          >
            <SearchIcon />
          </button>
        </div>
        {error && (
          <p className="text-red-500 px-2.5 sm:px-4">{error.message}</p>
        )}
      </form>
    </>
  );
}

export { SearchWeatherForm };
