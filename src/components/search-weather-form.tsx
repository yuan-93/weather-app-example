"use client";

import { useState, type FormEvent, useEffect } from "react";
import {
  InputCountry,
  InputCountryProps,
} from "./input-country-code/input-country";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { Text } from "./text";

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
    <form
      id="weather-search-form"
      onSubmit={handleOnSubmit}
      className=" w-full relative"
    >
      <div className="flex flex-row w-full gap-1">
        <div className="flex flex-row rounded-2xl h-10 sm:h-[60px] px-2.5 sm:px-4 gap-2.5 sm:gap-4 flex-1 bg-white/20 dark:bg-[#1A1A1A]/50">
          <div className="relative flex items-center">
            <Text
              as="label"
              size={"caption"}
              htmlFor="input-country"
              className="absolute top-1 text-black/40 dark:text-white/40"
            >
              Country
            </Text>
            <InputCountry
              name="input-country"
              required
              onChange={onChange}
              value={countryCode}
            />
          </div>
          <div className="border-l my-2 border-black dark:border-white" />
          <div className="relative flex items- w-full">
            <Text
              as="label"
              size="caption"
              htmlFor="input-city"
              className="absolute top-1 text-black/40 dark:text-white/40"
            >
              City
            </Text>
            <input
              id="input-city"
              name="input-city"
              type="text"
              className="bg-transparent h-auto sm:text-base text-xs focus:outline-none dark:text-white"
              required
            />
          </div>
        </div>
        <button
          className="px-3 sm:px-4 rounded-2xl bg-[#6C40B5] text-white dark:bg-[#28124D]"
          type="submit"
        >
          {status === "loading" ? (
            <Loader2Icon className="sm:w-6 sm:h-6 h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="sm:w-6 sm:h-6 h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="absolute text-red-500 px-2.5 sm:px-4">{error.message}</p>
      )}
    </form>
  );
}

export { SearchWeatherForm };
