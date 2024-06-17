import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	firstName?: string;

	@Field({ nullable: true })
	lastName?: string;

	@Field({ nullable: true })
	email?: string;

	@Field({ nullable: true })
	role?: string;

	@Field(() => Int, { nullable: true })
	city?: number;
}
