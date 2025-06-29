//utils.ts
import {
  CityAPI,
  PhoneData,
  WeatherAPI,
  WorldTimeAPI,
  EmailData,
} from "./types.ts";

//Le paso latitud y longitud y me devuelve la tempertaura
export const getTemperature = async (
  lat: string,
  lon: string
): Promise<number> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data: WeatherAPI = await response.json();
  return data.temp;
};

// Le paso el código de país (por ejemplo "ES") y devuelve el nombre completo ("Spain")
const getCountryName = async (code: string): Promise<string> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/country?name=${code}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch country data");
  }

  const data = await response.json();
  return data.at(0).name;
};

// Le paso el nombre de una ciudad y me devuelve un array con su latitud, longitud y país
export const getCityData = async (
  city: string
): Promise<Array<{ latitude: string; longitude: string; country: string; name: string }>> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/city?name=${city}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch geo data");
  }

  const data: CityAPI = await response.json();

  const result = await Promise.all(
    data.map(async (city) => {
      const country = await getCountryName(city.country);
      return { latitude: city.latitude, longitude: city.longitude, country, name: city.name };
    })
  );

  return result;
};

// Le paso latitud y longitud y me devuelve la hora local como string (ej: "14:25")
export const getWorldTime = async (
  latitude: string,
  longitude: string
): Promise<string> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/worldtime?lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch world time data");
  }

  const data: WorldTimeAPI = await response.json();
  return `${data.hour}:${data.minute}`;
};

// Le paso un número de teléfono y me dice si es válido y de qué país es
export const getPhoneData = async (phone: string): Promise<PhoneData> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch phone data");
  }

  return await response.json();
};

// Le paso un email y me devuelve si es válido o no
export const getEmailData = async (email: string): Promise<EmailData> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/validateemail?email=${email}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch email data");
  }

  return await response.json();
};
