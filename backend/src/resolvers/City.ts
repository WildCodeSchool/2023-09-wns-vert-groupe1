import { City } from "../entities";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CityUpdateInput, CityInput } from "../inputs";
import { GeoCodingService } from "../services";
import { redisClient } from "../index";

@Resolver()
export class CityResolver {
  @Query(() => [City])
  async getAllCities(
    @Arg("offset", () => Number, { nullable: true })
    offset: number,
    @Arg("limit", () => Number, { nullable: true })
    limit: number
  ): Promise<City[]> {
    try {
      const result = await City.find({
        relations: ["pois"],
        skip: offset,
        take: limit,
        order: { name: "ASC" },
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch cities");
    }
  }

  @Query(() => City)
  async getCityById(@Arg("id") id: number): Promise<City> {
    try {
      const result = await City.findOne({
        where: {
          id: id,
        },
        relations: { pois: true },
      });

      if (!result) {
        throw new Error(`City with ID ${id} not found`);
      }

      return result;
    } catch (err) {
      console.error("Error", err);
      throw new Error("An error occurred while reading one city");
    }
  }

  @Query(() => City)
  async getCityByName(@Arg("name") name: string): Promise<City> {
    try {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      const cacheResult = await redisClient.get(capitalizedName);
      if (cacheResult !== null) {
        return JSON.parse(cacheResult);
      } else {
        const result = await City.findOne({
          where: {
            name: capitalizedName,
          },
          relations: ["pois", "pois.category"],
        });

        if (!result) {
          throw new Error(`City with name ${name} not found`);
        }
        redisClient.set(capitalizedName, JSON.stringify(result), { EX: 30 });
        return result;
      }
    } catch (err) {
      console.error("Error", err);
      throw new Error("An error occurred while searching for a city by name");
    }
  }

  @Mutation(() => City)
  async createNewCity(@Arg("cityData") cityData: CityInput) {
    const pois = cityData.pois ? cityData.pois.map((poi) => ({ id: poi })) : [];

    const coordinates = await GeoCodingService.getCoordinatesByCity(
      cityData.name
    );

    const city = await City.create({
      ...cityData,
      lat: coordinates?.latitude,
      lon: coordinates?.longitude,
      pois: pois,
    }).save();

    return city;
  }

  @Mutation(() => String)
  async deleteAllCities() {
    City.delete({});
    return "All cities deleted";
  }

  @Mutation(() => String)
  async deleteCityById(@Arg("id") id: number) {
    const cityToDelete = await City.findOneByOrFail({
      id: id,
    });
    cityToDelete.remove();

    return "The city has been deleted";
  }

  @Mutation(() => City)
  async updateCity(
    @Arg("id") id: number,
    @Arg("cityData") cityData: CityUpdateInput
  ) {
    const existingCity = await City.findOneOrFail({
      where: { id },
    });

    if (!existingCity) {
      throw new Error(`City with ID ${id} not found`);
    }

    const updatedCity = await City.save({
      ...existingCity,
      ...cityData,
    });

    return updatedCity;
  }
}
