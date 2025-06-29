// types.ts

import { OptionalId } from "mongodb";

export type RestauranteModel = OptionalId<{
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  latitude: string;
  longitude: string;
  capital: string;
}>;

export type CountryAPI = Array<{ name: string }>;

export type WeatherAPI = { //clima
  temp: number;
};
export type WorldTimeAPI = { //hora
  hour: number;
  minute: number;
};

export type CityAPI = Array<{ 
  latitude: string;
  longitude: string;
  country: string;
  name: string;
}>;

export type PhoneData = {
  is_valid: boolean;
  country: string;
};

export type EmailData = {
  is_valid: boolean;
};