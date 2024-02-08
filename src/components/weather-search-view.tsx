"use client";

import { format } from "date-fns";
import { SearchIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { getWeatherData } from "../services/open-weather-api";

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setStatus("loading");
      event.preventDefault();
      const city = (document.getElementById("input-city") as HTMLInputElement)
        .value;
      const country = (
        document.getElementById("input-country") as HTMLInputElement
      ).value;
      if (!city || !country) {
        return;
      }

      const newData = await getWeatherData(city, country);
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

  const onClear = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const form = document.getElementById(
      "weather-search-form"
    ) as HTMLFormElement;
    form.reset();
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
    <div>
      <form
        id="weather-search-form"
        className="flex flex-row gap-2 flex-wrap"
        onSubmit={onSubmit}
      >
        <label htmlFor="input-city">
          City:
          <input
            id="input-city"
            name="input-city"
            type="text"
            className=" border rounded-md"
            required
          />
        </label>
        <label htmlFor="input-country">
          Country:
          <input
            id="input-country"
            name="input-country"
            type="text"
            className=" border rounded-md"
            required
          />
        </label>
        <button className="border px-2" type="submit">
          Search
        </button>
        <button className="border px-2" onClick={onClear}>
          Clear
        </button>
      </form>
      {error && <p className="text-red-500">{error.message}</p>}
      {data && (
        <div className="px-8 py-4">
          <h2>
            {data.location.city}, {data.location.countryCode}
          </h2>
          <h3 className="text-6xl font-bold">{data.weather.main}</h3>
          <ul>
            <li>Description: {data.weather.description}</li>
            <li>Temperature: {data.weather.temperature}</li>
            <li>Humidity: {data.weather.humidity}</li>
            <li>Time: {format(data.searchedDt, "yyyy-mm-dd hh:mm a")}</li>
          </ul>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold">Search History</h2>
        <hr className="h-0.5 bg-black/50" />
        <ol className="flex flex-col gap-2 mt-2">
          {histories
            .sort((a, b) => {
              return b.searchedDt.getTime() - a.searchedDt.getTime();
            })
            .map((history, index) => (
              <li className="flex flex-row" key={history.searchedDt.getTime()}>
                <p className="flex-1">
                  {history.location.city}, {history.location.countryCode}
                </p>
                <div className="flex flex-row gap-2">
                  <p>{format(history.searchedDt, "yyyy-mm-dd hh:mm a")}</p>
                  <button onClick={onSearch(index)}>
                    <SearchIcon />
                  </button>
                  <button onClick={onRemoveHistory(index)}>
                    <Trash2Icon />
                  </button>
                </div>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}

export { WeatherSearchView };
