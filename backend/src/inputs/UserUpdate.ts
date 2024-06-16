import { UserRole } from "../entities";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  city?: number;

  @Field({ nullable: true })
  role?: UserRole;
}
