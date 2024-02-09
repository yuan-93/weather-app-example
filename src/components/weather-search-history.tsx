import { format } from "date-fns";
import type { SearchedHistory } from "./types";
import type { MouseEvent } from "react";
import { SearchIcon, TrashIcon } from "lucide-react";

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
  );
}
