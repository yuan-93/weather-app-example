import { kelvinToCelsius } from "@/libs/utils";
import { format } from "date-fns";
import { Text } from "./text";
import { WeatherData } from "./types";

export interface WeatherSearchResultProps {
  data: WeatherData;
}

export function WeatherSearchResult({ data }: WeatherSearchResultProps) {
  const mappedData = {
    ...data,
    weather: {
      ...data.weather,
      temperature: kelvinToCelsius(data.weather.temperature).toFixed(0),
      maxTemperature: kelvinToCelsius(data.weather.maxTemperature).toFixed(0),
      minTemperature: kelvinToCelsius(data.weather.minTemperature).toFixed(0),
    },
  };
  return (
    <div className="grid grid-cols-12">
      <div className=" col-span-6 sm:colspan-12">
        <Text as="h1" size="body" className="dark:text-white">
          Today&apos;s Weather
        </Text>
        <Text
          as="p"
          size="headline"
          className="text-[#6C40B5] font-bold dark:text-white"
        >
          {mappedData.weather.temperature}°
        </Text>
        <p className="dark:text-white">
          H: {mappedData.weather.maxTemperature}° L:{" "}
          {mappedData.weather.minTemperature}°
        </p>
        <p className="font-bold text-gray-500 sm:hidden dark:text-white">
          {mappedData.location.city}, {mappedData.location.countryCode}
        </p>
      </div>
      <ul className="col-span-6 sm:col-span-12 gap-1 sm:gap-0 flex sm:flex-row flex-col-reverse text-end items-end justify-start sm:justify-between text-gray-500 text-sm sm:text-base">
        <li className="font-bold text-gray-500 hidden sm:block dark:text-white">
          {mappedData.location.city}, {mappedData.location.countryCode}
        </li>
        <li className="dark:text-white">
          {format(mappedData.searchedDt, "dd-mm-yyyy hh:mmaaa")}
        </li>
        <li className="dark:text-white">
          Humidity: {mappedData.weather.humidity}%
        </li>
        <li className="dark:text-white">{mappedData.weather.description}</li>
      </ul>
    </div>
  );
}
