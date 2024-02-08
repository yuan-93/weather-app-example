"use client";

import { format } from "date-fns";
import { SearchIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { getWeatherData } from "../services/open-weather-api";
import { InputCountry } from "./input-country-code/input-country";
import {
  SearchWeatherForm,
  SearchWeatherFormProps,
} from "./search-weather-form";
import Image from "next/image";

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
        <div className="relative border border-white mt-40 rounded-xl  bg-white/20">
          <Image
            className="absolute max-w-full h-auto right-0 -top-32"
            alt="sun"
            width={300}
            height={300}
            src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
          />
          <div className="px-8 py-4">
            <h1 className="text-lg">Today&apos;s Weather</h1>
            <p className="text-7xl text-[#6C40B5] font-bold">
              {kelvinToCelsius(data.weather.temperature).toFixed(0)}°
            </p>
            <p>
              H:{kelvinToCelsius(data.weather.maxTemperature).toFixed(0)}° L:
              {kelvinToCelsius(data.weather.minTemperature).toFixed(0)}°
            </p>
            <ul className="flex flex-row justify-between">
              <li>
                {data.location.city}, {data.location.countryCode}
              </li>
              <li>{format(data.searchedDt, "dd-mm-yyyy hh:mm a")}</li>{" "}
              <li>Humidity: {data.weather.humidity}%</li>
              <li>{data.weather.description}</li>
            </ul>
          </div>
          <div className="px-4 mx-8 py-4 rounded-xl bg-white/20">
            <h2 className="text-lg">Search History</h2>
            <ul className="flex flex-col gap-2 mt-2">
              {histories
                .sort((a, b) => {
                  return b.searchedDt.getTime() - a.searchedDt.getTime();
                })
                .map((history, index) => (
                  <li
                    className="flex flex-row bg-white/40 px-4 py-3 rounded-xl shadow-sm items-center"
                    key={history.searchedDt.getTime()}
                  >
                    <p className="flex-1">
                      {history.location.city}, {history.location.countryCode}
                    </p>
                    <div className="flex flex-row gap-2 items-center">
                      <p>{format(history.searchedDt, "dd-mm-yyyy hh:mm a")}</p>
                      <button
                        onClick={onSearch(index)}
                        className="bg-white rounded-full p-1"
                      >
                        <SearchIcon />
                      </button>
                      <button
                        onClick={onRemoveHistory(index)}
                        className="bg-white rounded-full p-1"
                      >
                        <Trash2Icon />
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
