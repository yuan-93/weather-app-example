import { format } from "date-fns";
import { SearchIcon, TrashIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { Text } from "./text";
import type { SearchedHistory } from "./types";

export interface WeatherSearchHistoryProps {
  histories: SearchedHistory[];
  onSearch: (index: number) => (evt: MouseEvent<HTMLButtonElement>) => void;
  onRemoveHistory: (
    index: number
  ) => (evt: MouseEvent<HTMLButtonElement>) => void;
}

export function WeatherSearchHistory({
  histories,
  onSearch,
  onRemoveHistory,
}: WeatherSearchHistoryProps) {
  return (
    <div className="mt-4 px-4 py-4 rounded-2xl bg-white/20 dark:bg-[#1A1A1A4D]/30">
      <h3 className="text-sm sm:text-base dark:text-white">Search History</h3>
      <ul className="flex flex-col gap-4 mt-4">
        {histories
          .sort((a, b) => {
            return b.searchedDt.getTime() - a.searchedDt.getTime();
          })
          .map((history, index) => (
            <li
              className="flex flex-row bg-white/40 px-2 sm:px-4 py-3 sm:py-4 rounded-2xl shadow-sm items-center dark:bg-[#1A1A1A4D]/50"
              key={history.searchedDt.getTime()}
            >
              <div className="flex flex-col sm:flex-row w-full">
                <Text as="p" size="body" className="sm:flex-1 dark:text-white">
                  {history.location.city}, {history.location.countryCode}
                </Text>
                <Text
                  as="p"
                  size={"label"}
                  className="sm:mr-2 dark:text-white/50"
                >
                  {format(history.searchedDt, "dd-mm-yyyy hh:mmaaa")}
                </Text>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <button
                  onClick={onSearch(index)}
                  className="bg-white rounded-full p-2 shadow-md dark:bg-transparent dark:border-white/40 dark:border"
                >
                  <SearchIcon size={16} className="text-gray-500" />
                </button>
                <button
                  onClick={onRemoveHistory(index)}
                  className="bg-white rounded-full p-2 shadow-md dark:bg-transparent dark:border-white/40 dark:border"
                >
                  <TrashIcon size={16} className="text-gray-500" />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
