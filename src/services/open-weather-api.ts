const openWeatherApiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;
if (!openWeatherApiKey) {
  throw new Error("NEXT_PUBLIC_OPEN_WEATHER_API_KEY is not set");
}

const openWeatherEndPoint = "https://api.openweathermap.org";
export const buildOpenWeatherUrl = (lat: number, lon: number) => {
  return `${openWeatherEndPoint}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`;
};

export const buildOpenWeatherGeocodingUrl = (
  city: string,
  countryCode: string
) => {
  return encodeURI(
    `${openWeatherEndPoint}/geo/1.0/direct?q=${city},${countryCode}&limit=1&appid=${openWeatherApiKey}`
  );
};

export const getWeatherData = async (city: string, country: string) => {
  const geoCodeResponse = await fetch(
    buildOpenWeatherGeocodingUrl(city, country)
  );
  if (!geoCodeResponse.ok) {
    throw new Error("Unable to find the location");
  }
  const geoCode: OpenWeatherGeocodingData[] = await geoCodeResponse.json();
  if (geoCode.length === 0) {
    throw new Error("No City Found");
  }
  if (country.toLowerCase() !== geoCode[0].country.toLowerCase()) {
    throw new Error("Unable to find the location");
  }
  const weatherDataResponse = await fetch(
    buildOpenWeatherUrl(geoCode[0].lat, geoCode[0].lon)
  );
  if (!weatherDataResponse.ok) {
    throw new Error("Unable to find location's weather data");
  }
  const weatherData: OpenWeatherData = await weatherDataResponse.json();

  return {
    location: {
      city: geoCode[0].name,
      countryCode: geoCode[0].country,
    },
    weather: {
      main: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      temperature: weatherData.main.temp,
      minTemperature: weatherData.main.temp_min,
      maxTemperature: weatherData.main.temp_max,
      humidity: weatherData.main.humidity,
    },
    searchedDt: new Date(),
  };
};

// get weather condition icon
// https://openweathermap.org/weather-conditions

/**
 * This WeatherData type is generated from the OpenWeather API
 * https://openweathermap.org/current
 */
export type OpenWeatherData = {
  coord: {
    /* Longitude of the location */
    lon: number;
    /* Latitude of the location */
    lat: number;
  };
  weather: {
    /* Weather condition id */
    id: number;
    /* Group of weather parameters (Rain, Snow, Clouds etc.) */
    main: string;
    /* Weather condition within the group */
    description: string;
    /* Weather icon id */
    icon: string;
  }[];
  /* Internal parameter */
  base: string;
  main: {
    /* Temperature */
    temp: number;
    /* Temperature accounting for human perception */
    feels_like: number;
    /* Minimum temperature at the moment */
    temp_min: number;
    /* Maximum temperature at the moment */
    temp_max: number;
    /* Atmospheric pressure on the sea level */
    pressure: number;
    /* Humidity */
    humidity: number;
    /* Atmospheric pressure on the sea level */
    sea_level: number;
    /* Atmospheric pressure on the ground level */
    grnd_level: number;
  };
  /* Visibility in meters */
  visibility: number;
  wind: {
    /* Wind speed */
    speed: number;
    /* Wind direction in degrees */
    deg: number;
    /* Wind gust */
    gust: number;
  };
  rain: {
    /* Rain volume for the last 1 hour (mm) */
    "1h": number;
  };
  clouds: {
    /* Cloudiness (%) */
    all: number;
  };
  /* Time of data calculation (unix, UTC) */
  dt: number;
  sys: {
    /* Internal parameter */
    type: number;
    /* Internal parameter */
    id: number;
    /* Country code */
    country: string;
    /* Sunrise time (unix, UTC) */
    sunrise: number;
    /* Sunset time (unix, UTC) */
    sunset: number;
  };
  /* Shift in seconds from UTC */
  timezone: number;
  /* City ID */
  id: number;
  /* City name */
  name: string;
  /* Internal parameter */
  cod: number;
};

/**
 * This GeocodingData type is generated from the OpenWeather API
 * https://openweathermap.org/api/geocoding-api
 */
export type OpenWeatherGeocodingData = {
  name: string;
  /* Name of the found location in different languages. The list of names can be different for different locations */
  local_names: {
    [languageCode: string]: string;
    /* Internal field */
    ascii: string;
    /* Internal field */
    feature_name: string;
  };
  /* Geographical coordinates of the found location (latitude) */
  lat: number;
  /* Geographical coordinates of the found location (longitude) */
  lon: number;
  /* Country of the found location (country code) */
  country: string;
  /* (where available) State of the found location */
  state?: string;
};
