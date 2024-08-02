import { CategoryInput } from "../inputs";
import { Category } from "../entities";
import { validate } from "class-validator";
import { Arg, Query, Resolver, Mutation, Authorized } from "type-graphql";
import { GraphQLError } from "graphql";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async getAllCategories() {
    const result = await Category.find({ relations: ["pois"] });
    return result;
  }
  @Authorized("ADMIN")
  @Mutation(() => Category)
  async createNewCategory(@Arg("categoryData") categoryData: CategoryInput) {
    const category = await Category.create({
      ...categoryData,
    });

    const errors = await validate(category);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors}`);
    }

    category.save();

    return category;
  }

  @Authorized("ADMIN")
  @Mutation(() => String)
  async updateCategory(
    @Arg("categoryData") categoryData: CategoryInput,
    @Arg("id") id: number
  ) {
    try {
      const category = await Category.findOne({ where: { id: id } });

      if (!category) {
        throw new GraphQLError(`Category with ID ${id} not found`, {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 },
          },
        });
      }
      Object.assign(category, categoryData);
      await category.save();
      return "Category updated";
    } catch (error) {
      throw new Error(`Error : ${error}`);
    }
  }

  @Authorized("ADMIN")
  @Mutation(() => String)
  async deleteCategoryById(@Arg("id") id: number) {
    const categoryToDelete = await Category.findOneByOrFail({
      id: id,
    });
    categoryToDelete.remove();
    return "The Category has been deleted";
  }
}
