export type WeatherData = {
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

export type SearchedHistory = Pick<WeatherData, "location" | "searchedDt">;
