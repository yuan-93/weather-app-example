"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getWeatherData } from "../services/open-weather-api";
import {
  SearchWeatherForm,
  SearchWeatherFormProps,
} from "./search-weather-form";
import { Skeleton } from "./skeleton";
import type { SearchedHistory, WeatherData } from "./types";
import { WeatherSearchHistory } from "./weather-search-history";
import { WeatherSearchResult } from "./weather-search-result";
import { ThemeSwitcher } from "./theme-switcher";

function WeatherSearchView() {
  const [data, setData] = useState<WeatherData | undefined>();
  const [histories, setHistories] = useState<SearchedHistory[]>([]);
  const [status, setStatus] = useState<"loading" | "idle">("loading");

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
      } finally {
        setStatus("idle");
      }
    }
    load();
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
    <>
      <div className="flex flex-row gap-2">
        <SearchWeatherForm onSubmit={onSubmit} />
        <ThemeSwitcher />
      </div>
      {status === "loading" ? (
        <Skeleton className="w-full h-64 rounded-2xl mt-28 " />
      ) : data ? (
        <div className="relative border border-white dark:border-none mt-28 rounded-2xl bg-white/20 pt-4 sm:pt-16 pb-4 px-4 sm:px-8 dark:bg-[#1A1A1A]/30">
          <Image
            className="absolute max-w-full h-auto right-[23px] sm:right-[40px] -top-[68px] sm:-top-[95px] w-[150px] sm:w-80"
            alt="sun"
            width={300}
            height={300}
            // src="/sun.png"
            src={`https://openweathermap.org/img/wn/${data.weather.icon}@4x.png`}
          />
          <WeatherSearchResult data={data} />
          <WeatherSearchHistory
            histories={histories}
            onSearch={onSearch}
            onRemoveHistory={onRemoveHistory}
          />
        </div>
      ) : null}
    </>
  );
}

export { WeatherSearchView };
