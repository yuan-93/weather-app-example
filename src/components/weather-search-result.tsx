import { kelvinToCelsius } from "@/libs/utils";
import { format } from "date-fns";
import { WeatherData } from "./types";

export interface WeatherSearchResultProps {
  data: WeatherData;
}

export function WeatherSearchResult({ data }: WeatherSearchResultProps) {
  return (
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
  );
}
