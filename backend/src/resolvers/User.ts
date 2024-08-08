import { City, User, UserInfo, UserRole } from "../entities";
import { UserInput, UserLoginInput } from "../inputs";
import {
	Query,
	Resolver,
	Mutation,
	Arg,
	Ctx,
	ArgumentValidationError,
	Authorized,
} from "type-graphql";
import { validate } from "class-validator";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { UserUpdateInput } from "../inputs/UserUpdate";
import { GraphQLError } from "graphql";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET_KEY) {
	throw new Error("SECRET_KEY environment variable is not defined");
}
const SECRET_KEY = process.env.SECRET_KEY;

@Resolver()
export class UserResolver {
	@Authorized(["ADMIN", "CITYADMIN"])
	@Query(() => [User])
	async getAllUsers(@Ctx() ctx: { role: UserRole; email: string }) {
		try {
			const user = await User.findOneByOrFail({ email: ctx.email });
			if (ctx.role === "ADMIN" || ctx.role === "CITYADMIN") {
				const users = await User.find({
					where:
						ctx.role === "CITYADMIN"
							? { city: { id: user?.cityId } }
							: { city: { id: undefined } },
					relations: { city: true },
				});
				return users;
			} else {
				throw new GraphQLError(
					"You are not authorized to get users informations",
					{
						extensions: {
							code: "UNAUTHORIZED",
							http: { status: 401 },
						},
					}
				);
			}
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	@Authorized()
	@Query(() => User)
	async getUserById(@Arg("id") id: number) {
		try {
			const result = await User.findOne({
				where: {
					id: id,
				},
				relations: { city: true },
			});
			if (!result) {
				throw new GraphQLError(`User with ID ${id} not found`, {
					extensions: {
						code: "NOT_FOUND",
						http: { status: 404 },
					},
				});
			} else {
				return result;
			}
		} catch (error) {
			throw new Error(`Error :  ${error.message}`);
		}
	}

	@Authorized()
	@Mutation(() => String)
	async deleteUserById(
		@Arg("id") id: number,
		@Ctx() ctx: { role: UserRole; email: string }
	) {
		try {
			const userToDelete = await User.findOneByOrFail({
				id: id,
			});
			if (ctx.role === "ADMIN" || ctx.email === userToDelete?.email) {
				userToDelete.remove();
				return "User deleted";
			} else {
				throw new GraphQLError("You are not authorized to delete user", {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	@Authorized("ADMIN")
	@Mutation(() => String)
	async deleteAllUsers() {
		try {
			User.delete({});
			return "All users deleted";
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	@Query(() => User)
	async getUserByEmail(@Arg("email") email: string) {
		try {
			const user = await User.findOneByOrFail({ email: email });
			return user;
		} catch (error) {
			throw new Error(`Error : ${error}`);
		}
	}

	@Authorized()
	@Mutation(() => String)
	async updateUserById(
		@Arg("id") id: number,
		@Arg("newUserInput") newUserInput: UserUpdateInput,
		@Ctx() ctx: { email: string; role: UserRole }
	) {
		try {
			const loggedUser = await User.findOneByOrFail({ email: ctx.email });
			const oldUser = await User.findOneByOrFail({ id: id });

			if (
				ctx.role === "ADMIN" ||
				oldUser?.email === ctx.email ||
				(ctx.role === "CITYADMIN" && oldUser.cityId === loggedUser?.cityId)
			) {
				Object.assign(oldUser, newUserInput);
				await oldUser.save();
				return "User updated";
			} else {
				throw new GraphQLError("You are not authorized to update user", {
					extensions: {
						code: "UNAUTHORIZED",
						http: { status: 401 },
					},
				});
			}
		} catch (error) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	@Mutation(() => String)
	async register(@Arg("newUserData") newUserData: UserInput) {
		try {
			const { firstName, lastName, email, password, city } = newUserData;

			// Check if the user already exists
			const existingUser = await User.findOne({ where: { email } });
			if (existingUser) {
				throw new Error("A user with the given email already exists.");
			}

			const newUser = new User();
			newUser.firstName = firstName;
			newUser.lastName = lastName;
			newUser.email = email;
			newUser.hashedPassword = password;

			if (city) {
				const cityEntity = await City.findOneByOrFail({ id: city });
				if (cityEntity) {
					newUser.city = cityEntity;
				}
			}

			// Perform validation
			const errors = await validate(newUser);
			if (errors.length > 0) {
				console.error("Validation errors:", errors);
				throw new ArgumentValidationError(errors);
			}

			// Hash the password using Argon2
			const hashedPassword = await argon2.hash(password);
			newUser.hashedPassword = hashedPassword;

			// Save the user to the database
			await newUser.save();
			return "User has been successfully registered";
		} catch (err) {
			console.error("Error registering user:", err);
			return "Error creating user";
		}
	}

	@Query(() => String)
	async login(@Arg("userData") { email, password }: UserLoginInput) {
		let payload: { email: string; role: UserRole };
		try {
			const user = await User.findOneByOrFail({ email });
			if (!user) {
				throw new Error("Email not found");
			}

			if (await argon2.verify(user.hashedPassword, password)) {
				payload = {
					email: user.email,
					role: user.role,
				};
				const token: string = jwt.sign(payload, SECRET_KEY);
				return JSON.stringify({ token: token });
			} else {
				throw new Error("Invalid password");
			}
		} catch (err) {
			console.log("Error authenticating user:", err);
			return "Invalid credentials";
		}
	}

	@Query(() => Boolean)
	async isEmailUnique(@Arg("email") email: string): Promise<boolean> {
		const user = await User.findOne({ where: { email } });
		return !user;
	}

	@Query(() => UserInfo)
	async checkSession(@Ctx() ctx: { email: string; role: string }) {
		if (ctx.email !== undefined) {
			return { ...ctx, isLoggedIn: true };
		} else {
			return { isLoggedIn: false };
		}
	}
}
