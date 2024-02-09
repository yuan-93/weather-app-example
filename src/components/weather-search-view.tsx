"use client";

import { format } from "date-fns";
import { SearchIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getWeatherData } from "../services/open-weather-api";
import {
  SearchWeatherForm,
  SearchWeatherFormProps,
} from "./search-weather-form";

type WeatherData = {
  location: {
    city: string;
    countryCode: string;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
    temperature: number;
    minTemperature: number;
    maxTemperature: number;
    humidity: number;
  };
  searchedDt: Date;
};

type SearchedHistory = Pick<WeatherData, "location" | "searchedDt">;

function WeatherSearchView() {
  const [data, setData] = useState<WeatherData | undefined>();
  const [histories, setHistories] = useState<SearchedHistory[]>([]);
  const [status, setStatus] = useState<"loading" | "idle">("idle");
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    async function load() {
      try {
        const prevHistories = sessionStorage.getItem("histories");
        if (prevHistories) {
          const parsedHistories = (
            (JSON.parse(prevHistories) || []) as SearchedHistory[]
          ).map((e) => ({ ...e, searchedDt: new Date(e.searchedDt) }));
          if (parsedHistories.length > 0) {
            setHistories(parsedHistories);
            const prevData = await getWeatherData(
              parsedHistories[parsedHistories.length - 1].location.city,
              parsedHistories[parsedHistories.length - 1].location.countryCode
            );
            setData(prevData);
          }
        }
      } catch (error) {
        console.error(error);
        sessionStorage.removeItem("histories");
      }
    }
    setStatus("loading");
    load();
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (status === "loading") {
      setError(undefined);
    }
  }, [status]);

  const onSubmit: SearchWeatherFormProps["onSubmit"] = async ({
    city,
    countryCode,
  }) => {
    try {
      const newData = await getWeatherData(city, countryCode);
      setData(newData);
      addHistory({
        location: newData.location,
        searchedDt: newData.searchedDt,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      }
      console.error(error);
    }
  };

  const onSearch = (index: number) => {
    return async () => {
      const history = histories[index];
      const newData = await getWeatherData(
        history.location.city,
        history.location.countryCode
      );
      setData(newData);
      addHistory({
        location: newData.location,
        searchedDt: newData.searchedDt,
      });
    };
  };

  const addHistory = (newHistory: SearchedHistory) => {
    const newHistories = [...histories, newHistory];
    setHistories(newHistories);
    sessionStorage.setItem("histories", JSON.stringify(newHistories));
  };

  const onRemoveHistory = (index: number) => {
    return () => {
      const newHistories = histories.filter((_, i) => i !== index);
      setHistories(newHistories);
      sessionStorage.setItem("histories", JSON.stringify(newHistories));
    };
  };

  return (
    <div className="w-full">
      <SearchWeatherForm onSubmit={onSubmit} />
      {data && (
        <div className="relative border border-white mt-28 rounded-2xl bg-white/20 pt-4 sm:pt-16 pb-4 px-4 sm:px-8">
          <Image
            className="absolute max-w-full h-auto right-[23px] sm:right-[40px] -top-[68px] sm:-top-[95px] w-[150px] sm:w-80"
            alt="sun"
            width={300}
            height={300}
            // src="/sun.png"
            src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
          />
          <div className="grid grid-cols-12">
            <div className=" col-span-6 sm:colspan-12">
              <h1 className="text-sm sm:text-base">Today&apos;s Weather</h1>
              <p className="sm:text-8xl text-6xl text-[#6C40B5] font-bold">
                {kelvinToCelsius(data.weather.temperature).toFixed(0)}°
              </p>
              <p>
                H: {kelvinToCelsius(data.weather.maxTemperature).toFixed(0)}° L:{" "}
                {kelvinToCelsius(data.weather.minTemperature).toFixed(0)}°
              </p>
              <p className="font-bold text-gray-500 sm:hidden">
                {data.location.city}, {data.location.countryCode}
              </p>
            </div>
            <ul className="col-span-6 sm:col-span-12 gap-1 sm:gap-0 flex sm:flex-row flex-col-reverse items-end justify-start sm:justify-between text-gray-500 text-sm sm:text-base">
              <li className="font-bold text-gray-500 hidden sm:block">
                {data.location.city}, {data.location.countryCode}
              </li>
              <li>{format(data.searchedDt, "dd-mm-yyyy hh:mm aaa")}</li>{" "}
              <li>Humidity: {data.weather.humidity}%</li>
              <li>{data.weather.description}</li>
            </ul>
          </div>
          <div className="mt-4 px-4 py-4 rounded-2xl bg-white/20">
            <h3 className="text-sm sm:text-base">Search History</h3>
            <ul className="flex flex-col gap-4 mt-4">
              {histories
                .sort((a, b) => {
                  return b.searchedDt.getTime() - a.searchedDt.getTime();
                })
                .map((history, index) => (
                  <li
                    className="flex flex-row bg-white/40 px-2 sm:px-4 py-4 rounded-2xl shadow-sm items-center"
                    key={history.searchedDt.getTime()}
                  >
                    <div className="flex flex-col sm:flex-row w-full">
                      <p className="sm:flex-1 text-sm sm:text-base">
                        {history.location.city}, {history.location.countryCode}
                      </p>
                      <p className="text-xs sm:text-sm sm:mr-2">
                        {format(history.searchedDt, "dd-mm-yyyy hh:mm aaa")}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <button
                        onClick={onSearch(index)}
                        className="bg-white rounded-full p-2 shadow-md"
                      >
                        <SearchIcon size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={onRemoveHistory(index)}
                        className="bg-white rounded-full p-2 shadow-md"
                      >
                        <TrashIcon size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export { WeatherSearchView };

function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}
