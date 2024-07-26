import { City, User, UserRole } from "../entities";
import { UserInput, UserLoginInput } from "../inputs";
import {
  Query,
  Resolver,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  ArgumentValidationError,
} from "type-graphql";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { UserUpdateInput } from "../inputs/UserUpdate";
import { validate } from "class-validator";

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is not defined");
}
const SECRET_KEY = process.env.SECRET_KEY;

@ObjectType()
class UserInfo {
  @Field()
  isLoggedIn: boolean;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  role: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    try {
      return await User.find({ relations: { city: true } });
    } catch (e) {
      return "Can't get all users";
    }
  }

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
        throw new Error(`User with ID ${id} not found`);
      }
      return result;
    } catch (err) {
      console.error("Error", err);
      throw new Error(`An error occurred while reading User with ID ${id}`);
    }
  }

  @Mutation(() => String)
  async deleteUserById(@Arg("id") id: number) {
    const userToDelete = await User.findOneByOrFail({
      id: id,
    });
    userToDelete.remove();
    return "User deleted";
  }

  @Mutation(() => String)
  async deleteAllUsers() {
    User.delete({});
    return "all users deleted";
  }

  @Mutation(() => String)
  async updateUserById(
    @Arg("id") id: number,
    @Arg("newUserInput") newUserInput: UserUpdateInput
    // @Arg("role") newUserRole?: UserRole,
  ) {
    try {
      const oldUser = await User.findOne({ where: { id: id } });

      if (!oldUser) {
        throw new Error(`The user with ID : ${id} not found`);
      }

      Object.assign(oldUser, newUserInput);

      await oldUser.save();
      return "User updated";
    } catch (error) {
      throw new Error(`Error when updating the user : ${error.message}`);
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
      console.log("Error registering user:", err);
      return "Error creating user";
    }
  }

  @Query(() => String)
  async login(@Arg("userData") { email, password }: UserLoginInput) {
    let payload: { email: string; role: UserRole };
    try {
      const user = await User.findOneByOrFail({ email });

      if (await argon2.verify(user.hashedPassword, password)) {
        payload = { email: user.email, role: user.role };
        const token: string = jwt.sign(payload, SECRET_KEY);
        return JSON.stringify({ token: token, id: user.id });
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
