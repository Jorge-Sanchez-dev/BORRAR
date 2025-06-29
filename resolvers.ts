//resolvers.ts
//resolvers.ts
import { Collection, ObjectId } from "mongodb";
import { GraphQLError } from "graphql";
import { RestauranteModel } from "./types.ts";
import {
  getWorldTime,
  getCityData,
  getPhoneData,
  getTemperature,
  getEmailData,
} from "./utils.ts";

type Context = {
  ResturantsCollection: Collection<RestauranteModel>;
};

type AddRestaurantMutationArgs = {
  name: string;
  address: string;
  phone: string;
  email: string;
  city: string;
};

export const resolvers = {
  Restaurante: {
    id: (parent: RestauranteModel) => parent._id!.toString(),
    address: (parent: RestauranteModel) =>
      `{${parent.address}, ${parent.city}, ${parent.country}}`,
    localtime: async (parent: RestauranteModel, _: unknown, ctx: Context) => {
      const { latitude, longitude } = parent;
      return await getWorldTime(latitude, longitude);
    },
    temperature: async (parent: RestauranteModel) => {
      const { latitude, longitude } = parent;
      return await getTemperature(latitude, longitude);
    },
    time: async (parent: RestauranteModel): Promise<string> => {
      try {
        const capitalInfo = await getWorldTime(
          parent.latitude,
          parent.longitude
        );
        return capitalInfo;
      } catch (_e) {
        throw new GraphQLError("Hora no conocida");
      }
    },
  },
  Query: {
    getRestaurants: async (
      _: unknown,
      { city }: { city: string },
      ctx: Context
    ): Promise<RestauranteModel[]> => {
      return await ctx.ResturantsCollection.find({ city }).toArray();
    },
    getRestaurant: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context
    ): Promise<RestauranteModel | null> => {
      return await ctx.ResturantsCollection.findOne({ _id: new ObjectId(id) });
    },
  },

  Mutation: {
    deleteRestaurant: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context
    ): Promise<boolean> => {
      const result = await ctx.ResturantsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      return result.deletedCount === 1; //1 con exito, 0 error
    },
    addRestaurant: async (
      _: unknown,
      args: AddRestaurantMutationArgs,
      ctx: Context
    ): Promise<RestauranteModel> => {
      const { name, address, phone, city, email } = args;
      // check if phone is already present in the DDBB
      const phoneExists = await ctx.ResturantsCollection.findOne({
        phone,
      });

      if (phoneExists) {
        throw new GraphQLError("Phone number already in use");
      }

      // check if phone is valid using API NINJAS
      const phoneData = await getPhoneData(phone);

      if (!phoneData.is_valid) {
        throw new GraphQLError("Invalid phone number");
      }

      // check if email is valid using API NINJAS
      const emailData = await getEmailData(email);

      if (!emailData.is_valid) {
        throw new GraphQLError("Invalid email");
      }

      // get city data from API NINJAS
      const cityData = await getCityData(city);

      // verificar si hay alguna ciudad en el país de datos del teléfono
      const cityExists = cityData.find(
        (city) => city.country === phoneData.country
      );

      if (!cityExists) {
        throw new GraphQLError("City not found in phone country");
      }

      // obtener la latitud y longitud de la ciudad correcta
      const latitude = cityExists.latitude;
      const longitude = cityExists.longitude;
      const country = cityExists.country;
      const capital = cityExists.name || city; // que me falt a aqui

      // insert restaurant
      const { insertedId } = await ctx.ResturantsCollection.insertOne({
        name,
        address,
        phone,
        email,
        city,
        country,
        latitude,
        longitude,
        capital,
      });

      return {
        _id: insertedId,
        name,
        address,
        phone,
        email,
        city,
        country,
        latitude,
        longitude,
        capital,
      };
    },
  },
};
