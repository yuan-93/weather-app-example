import { kelvinToCelsius } from "@/libs/utils";
import { format } from "date-fns";
import { Text } from "./text";
import { WeatherData } from "./types";

export interface WeatherSearchResultProps {
  data: WeatherData;
}

export function WeatherSearchResult({ data }: WeatherSearchResultProps) {
  return (
    <div className="grid grid-cols-12">
      <div className=" col-span-6 sm:colspan-12">
        <Text as="h1" size="body">
          Today&apos;s Weather
        </Text>
        <Text as="p" size="headline" className="text-[#6C40B5] font-bold">
          {kelvinToCelsius(data.weather.temperature).toFixed(0)}°
        </Text>
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
        <li>{format(data.searchedDt, "dd-mm-yyyy hh:mmaaa")}</li>{" "}
        <li>Humidity: {data.weather.humidity}%</li>
        <li>{data.weather.description}</li>
      </ul>
    </div>
  );
}
