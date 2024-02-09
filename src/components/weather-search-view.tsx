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
import type { WeatherData, SearchedHistory } from "./types";
import { WeatherSearchHistory } from "./weather-search-history";

function WeatherSearchView() {
  const [data, setData] = useState<WeatherData | undefined>();
  const [histories, setHistories] = useState<SearchedHistory[]>([]);
  const [status, setStatus] = useState<"loading" | "idle">("idle");

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

  const onSubmit: SearchWeatherFormProps["onSubmit"] = async ({
    city,
    countryCode,
  }) => {
    const newData = await getWeatherData(city, countryCode);
    setData(newData);
    addHistory({
      location: newData.location,
      searchedDt: newData.searchedDt,
    });
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
            src={`https://openweathermap.org/img/wn/${data.weather.icon}@4x.png`}
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
          <WeatherSearchHistory
            histories={histories}
            onSearch={onSearch}
            onRemoveHistory={onRemoveHistory}
          />
        </div>
      )}
    </div>
  );
}

export { WeatherSearchView };

function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}
