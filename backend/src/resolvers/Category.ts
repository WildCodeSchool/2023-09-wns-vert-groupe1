import { CategoryInput } from "../inputs";
import { Category } from "../entities";
import { Arg, Query, Resolver, Mutation } from "type-graphql";

@Resolver()
export class CategoryResolver {
	@Query(() => [Category])
	async getAllCategories() {
		const result = await Category.find({ relations: ["pois"] });
		return result;
	}

	@Mutation(() => Category)
	async createNewCategory(@Arg("categoryData") categoryData: CategoryInput) {
		const pois = categoryData.pois
			? categoryData.pois.map((poi) => ({ id: poi }))
			: [];

		const city = await Category.create({
			...categoryData,
			pois: pois,
		}).save();

		return city;
	}

	@Mutation(() => String)
	async deleteCategoryById(@Arg("id") id: number) {
		const categoryToDelete = await Category.findOneByOrFail({ id: id });
		await categoryToDelete.remove();
		return "The Category has been deleted";
	}
}
